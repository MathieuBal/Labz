import test from 'node:test';
import assert from 'node:assert/strict';
import {createInbox,escapeText,feedbackCapacity,filterFeedback,filterTopics,getCapacityState} from '../admin-client.js';

const row={request_id:'11111111-1111-4111-8111-111111111111',created_at:'2026-10-20T12:00:00Z',project:'sensoria',kind:'bug',status:'new',summary:'Écran noir',message:'<img src=x onerror=alert(1)>',nickname:'<script>x</script>'};
const topic={id:'22222222-2222-4222-8222-222222222222',created_at:'2026-10-20T12:00:00Z',updated_at:'2026-10-20T12:00:00Z',project:'sensoria',type:'problem',title:'Écran noir au lancement',synthesis:'Un écran noir apparaît sur certains lancements.',impact:'high',effort:'medium',state:'to_study',decision_rationale:''};
const link={topic_id:topic.id,feedback_id:row.request_id,created_at:'2026-10-20T12:05:00Z'};
const decision={id:'33333333-3333-4333-8333-333333333333',topic_id:topic.id,state:'in_progress',rationale:'Le problème bloque la découverte.',created_at:'2026-10-20T12:10:00Z'};
const response=(body,status=200)=>({ok:status<400,status,json:async()=>body});
const defer=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};

function setup({topics=[],links=[],decisions=[],fetcher:override}={}) {
 const calls=[];let time=0;const timers=new Map();let next=0;
 const defaultFetcher=async(url,options)=>{
  calls.push({url,options});
  if(url.includes('/token?'))return response({access_token:'test-token',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  if(url.includes('/logout'))return response(null,204);
  if(url.includes('/rpc/labz_create_topic'))return response(topic.id);
  if(url.includes('/labz_topic_feedback')) {
   if(options.method==='DELETE')return response(null,204);
   if(options.method==='POST')return response([link]);
   return response(links);
  }
  if(url.includes('/labz_decisions'))return response(decisions);
  if(url.includes('/labz_topics')) {
   if(options.method==='PATCH')return response([{id:topic.id,state:JSON.parse(options.body).state||topic.state,updated_at:topic.updated_at}]);
   return response(topics);
  }
  if(url.includes('/labz_feedback')) {
   if(options.method==='PATCH')return response([{request_id:row.request_id,status:JSON.parse(options.body).status}]);
   return response([row]);
  }
  throw new Error('unexpected request '+url);
 };
 const client=createInbox({url:'https://example.test',key:'public',now:()=>time,
  schedule:(fn,delay)=>{const id=++next;timers.set(id,{fn,delay});return id;},cancel:id=>timers.delete(id),
  fetcher:override?async(url,options)=>{calls.push({url,options});return override(url,options);}:defaultFetcher});
 return {client,calls,timers,setTime:v=>{time=v;}};
}

test('filters combine search, project and status without interpreting markup',()=>{
 assert.equal(filterFeedback([row],{query:'ecran',project:'sensoria',status:'new'}).length,1);
 assert.equal(filterFeedback([row],{query:'ecran',status:'done'}).length,0);
 assert.equal(filterFeedback([row],{query:'<img'}).length,1);
 assert.equal(escapeText('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
 assert.equal(escapeText(row.nickname),'&lt;script&gt;x&lt;/script&gt;');
});

test('topic filters combine text, project and workflow state',()=>{
 assert.equal(filterTopics([topic],{query:'lancement',project:'sensoria',state:'to_study'}).length,1);
 assert.equal(filterTopics([topic],{query:'lancement',state:'shipped'}).length,0);
 assert.equal(filterTopics([topic],{query:'probleme'}).length,1);
});

test('capacity state exposes remaining space and warning thresholds',()=>{
 assert.deepEqual(getCapacityState(0),{stored:0,remaining:500,level:'ok',percent:0});
 assert.equal(getCapacityState(feedbackCapacity.warningAt-1).level,'ok');
 assert.equal(getCapacityState(feedbackCapacity.warningAt).level,'warning');
 assert.equal(getCapacityState(feedbackCapacity.maxStored).level,'full');
 assert.deepEqual(getCapacityState(600),{stored:600,remaining:0,level:'full',percent:100});
 assert.deepEqual(getCapacityState(Number.NaN),{stored:0,remaining:500,level:'ok',percent:0});
});

test('owner loads feedback, topics, links and decisions before becoming ready',async()=>{
 const {client,calls}=setup({topics:[topic],links:[link],decisions:[decision]});
 await client.login('owner@example.test','password');
 const snapshot=client.snapshot();
 assert.equal(snapshot.phase,'ready');assert.equal(snapshot.rows.length,1);assert.equal(snapshot.topics.length,1);assert.equal(snapshot.links.length,1);assert.equal(snapshot.decisions.length,1);
 for(const name of ['labz_feedback','labz_topics','labz_topic_feedback','labz_decisions'])assert.ok(calls.some(c=>c.url.includes(name)));
 await client.logout();assert.deepEqual(client.snapshot().rows,[]);assert.deepEqual(client.snapshot().topics,[]);
});

test('feedback status is changed only after server acknowledgement',async()=>{
 const {client,calls}=setup();await client.login('owner@example.test','password');
 await client.updateStatus(row.request_id,'in_progress');
 const patch=calls.find(c=>c.options.method==='PATCH'&&c.url.includes('/labz_feedback'));
 assert.deepEqual(JSON.parse(patch.options.body),{status:'in_progress'});
});

test('creating a topic from feedback uses the atomic RPC without copying the raw message',async()=>{
 const {client,calls}=setup();await client.login('owner@example.test','password');
 await client.createTopic({feedbackId:row.request_id,project:'sensoria',type:'problem',title:row.summary,synthesis:'Le lancement peut afficher un écran noir.',impact:'high',effort:'medium'});
 const call=calls.find(c=>c.url.includes('/rpc/labz_create_topic'));
 const body=JSON.parse(call.options.body);
 assert.equal(body.p_feedback_id,row.request_id);assert.equal(body.p_project,'sensoria');assert.equal(body.p_title,row.summary);
 assert.equal(body.p_synthesis,'Le lancement peut afficher un écran noir.');assert.ok(!JSON.stringify(body).includes(row.message));
});

test('topic state change sends the rationale in the same patch',async()=>{
 const {client,calls}=setup({topics:[topic]});await client.login('owner@example.test','password');
 await client.updateTopic(topic.id,{state:'in_progress',decision_rationale:'Le sujet bloque une expérience publique.'});
 const patch=calls.find(c=>c.options.method==='PATCH'&&c.url.includes('/labz_topics'));
 assert.deepEqual(JSON.parse(patch.options.body),{state:'in_progress',decision_rationale:'Le sujet bloque une expérience publique.'});
});

test('WIP limit error stays explicit and keeps private data visible',async()=>{
 const {client}=setup({topics:[topic],fetcher:async(url,options)=>{
  if(url.includes('/token?'))return response({access_token:'x',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  if(url.includes('/labz_feedback'))return response([row]);
  if(url.includes('/labz_topic_feedback'))return response([]);
  if(url.includes('/labz_decisions'))return response([]);
  if(url.includes('/labz_topics')&&options.method==='PATCH')return response({message:'topic_wip_limit'},400);
  if(url.includes('/labz_topics'))return response([topic]);
  return response(null,204);
 }});
 await client.login('owner@example.test','password');
 const ok=await client.updateTopic(topic.id,{state:'in_progress',decision_rationale:'Priorité maintenant'});
 assert.equal(ok,false);assert.equal(client.snapshot().phase,'ready');assert.equal(client.snapshot().topics.length,1);
 assert.match(client.snapshot().error,/Trois sujets/);
});

test('feedback can be attached and detached from a topic of the same project',async()=>{
 const {client,calls}=setup({topics:[topic]});await client.login('owner@example.test','password');
 assert.equal(await client.attachFeedback(topic.id,row.request_id),true);
 assert.ok(calls.some(c=>c.options.method==='POST'&&c.url.endsWith('/rest/v1/labz_topic_feedback')));
 const second=setup({topics:[topic],links:[link]});await second.client.login('owner@example.test','password');
 assert.equal(await second.client.detachFeedback(topic.id,row.request_id),true);
 assert.ok(second.calls.some(c=>c.options.method==='DELETE'&&c.url.includes('/labz_topic_feedback?')));
});

test('non-admin is denied before private datasets are requested',async()=>{
 const calls=[];const {client}=setup({fetcher:async(url)=>{calls.push(url);return url.includes('/token?')?response({access_token:'x',expires_in:60}):response([]);}});
 await client.login('other@example.test','password');
 assert.equal(client.snapshot().phase,'forbidden');assert.equal(calls.length,2);
});

test('late list response after logout cannot repopulate the inbox even if abort is ignored',async()=>{
 const pending=defer(),started=defer();
 const {client}=setup({fetcher:async(url)=>{
  if(url.includes('/token?'))return response({access_token:'x',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  if(url.includes('/logout'))return response(null,204);
  started.resolve();return pending.promise;
 }});
 const login=client.login('owner@example.test','password');await started.promise;
 await client.logout();pending.resolve(response([]));await login;
 assert.equal(client.snapshot().phase,'signed_out');assert.deepEqual(client.snapshot().rows,[]);assert.deepEqual(client.snapshot().topics,[]);
});

test('late login response after disposal cannot create a session',async()=>{
 const pending=defer();const {client}=setup({fetcher:()=>pending.promise});
 const login=client.login('owner@example.test','password');client.dispose();
 pending.resolve(response({access_token:'x',expires_in:60}));await login;
 assert.equal(client.snapshot().phase,'signed_out');assert.deepEqual(client.snapshot().rows,[]);
});

test('expired session clears every private dataset and prevents writes',async()=>{
 const {client,setTime,calls}=setup({topics:[topic]});await client.login('owner@example.test','password');setTime(61000);
 await client.updateTopic(topic.id,{title:'Nouveau titre'});assert.equal(client.snapshot().phase,'expired');
 assert.deepEqual(client.snapshot().rows,[]);assert.deepEqual(client.snapshot().topics,[]);
 assert.ok(!calls.some(c=>c.options.method==='PATCH'));
});

test('network error is explicit and retry recovers',async()=>{
 let fail=true;const {client}=setup({fetcher:async(url)=>{
  if(url.includes('/token?'))return response({access_token:'x',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  if(fail)throw new Error('offline');return response([]);
 }});
 await client.login('owner@example.test','password');assert.equal(client.snapshot().phase,'error');
 fail=false;await client.refresh();assert.equal(client.snapshot().phase,'ready');assert.deepEqual(client.snapshot().rows,[]);assert.deepEqual(client.snapshot().topics,[]);
});
