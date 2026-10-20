import test from 'node:test';
import assert from 'node:assert/strict';
import {createInbox,escapeText,filterFeedback} from '../admin-client.js';
const row={request_id:'11111111-1111-4111-8111-111111111111',created_at:'2026-10-20T12:00:00Z',project:'sensoria',status:'new',summary:'Écran noir',message:'<img src=x onerror=alert(1)>',nickname:'<script>x</script>'};
const response=(body,status=200)=>({ok:status<400,status,json:async()=>body});
const defer=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
function setup(extra={}) {
 const calls=[];let time=0;const timers=new Map();let next=0;
 const client=createInbox({url:'https://example.test',key:'public',now:()=>time,
 schedule:(fn,delay)=>{const id=++next;timers.set(id,{fn,delay});return id;},cancel:id=>timers.delete(id),
 fetcher:async(url,options)=>{
  calls.push({url,options});
  if(url.includes('/token?'))return response({access_token:'test-token',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  if(url.includes('/logout'))return response(null,204);
  if(options.method==='PATCH')return response([{request_id:row.request_id,status:JSON.parse(options.body).status}]);
  return response([row]);
 },...extra});
 return {client,calls,timers,setTime:v=>{time=v;}};
}
test('filters combine search, project and status without interpreting markup',()=>{
 assert.equal(filterFeedback([row],{query:'ecran',project:'sensoria',status:'new'}).length,1);
 assert.equal(filterFeedback([row],{query:'ecran',status:'done'}).length,0);
 assert.equal(filterFeedback([row],{query:'<img'}).length,1);
 assert.equal(escapeText('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
 assert.equal(escapeText(row.nickname),'&lt;script&gt;x&lt;/script&gt;');
});
test('owner loads inbox and status is changed only after server acknowledgement',async()=>{
 const {client,calls}=setup();await client.login('owner@example.test','password');
 assert.equal(client.snapshot().phase,'ready');await client.updateStatus(row.request_id,'in_progress');
 assert.equal(client.snapshot().rows[0].status,'in_progress');
 assert.deepEqual(JSON.parse(calls.find(c=>c.options.method==='PATCH').options.body),{status:'in_progress'});
 await client.logout();assert.deepEqual(client.snapshot().rows,[]);
});
test('non-admin is denied before private messages are requested',async()=>{
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
 await client.logout();pending.resolve(response([row]));await login;
 assert.equal(client.snapshot().phase,'signed_out');assert.deepEqual(client.snapshot().rows,[]);
});
test('late login response after disposal cannot create a session',async()=>{
 const pending=defer();const {client}=setup({fetcher:()=>pending.promise});
 const login=client.login('owner@example.test','password');client.dispose();
 pending.resolve(response({access_token:'x',expires_in:60}));await login;
 assert.equal(client.snapshot().phase,'signed_out');assert.deepEqual(client.snapshot().rows,[]);
});
test('late status acknowledgement after logout is discarded',async()=>{
 const pending=defer(),started=defer();
 const {client}=setup({fetcher:async(url,options)=>{
  if(url.includes('/token?'))return response({access_token:'x',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  if(url.includes('/logout'))return response(null,204);
  if(options.method==='PATCH'){started.resolve();return pending.promise;}
  return response([row]);
 }});
 await client.login('owner@example.test','password');
 const update=client.updateStatus(row.request_id,'done');await started.promise;await client.logout();
 pending.resolve(response([{request_id:row.request_id,status:'done'}]));await update;
 assert.equal(client.snapshot().phase,'signed_out');assert.deepEqual(client.snapshot().rows,[]);
});
test('expired session clears private data and prevents writes',async()=>{
 const {client,setTime,calls}=setup();await client.login('owner@example.test','password');setTime(61000);
 await client.updateStatus(row.request_id,'done');assert.equal(client.snapshot().phase,'expired');
 assert.deepEqual(client.snapshot().rows,[]);assert.ok(!calls.some(c=>c.options.method==='PATCH'));
});
test('network error is explicit and retry recovers',async()=>{
 let fail=true;const {client}=setup({fetcher:async(url)=>{
  if(url.includes('/token?'))return response({access_token:'x',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  if(fail)throw new Error('offline');return response([]);
 }});
 await client.login('owner@example.test','password');assert.equal(client.snapshot().phase,'error');
 fail=false;await client.refresh();assert.equal(client.snapshot().phase,'ready');assert.deepEqual(client.snapshot().rows,[]);
});
test('no matching row on update is an error, never a success',async()=>{
 const {client}=setup({fetcher:async(url,options)=>{
  if(url.includes('/token?'))return response({access_token:'x',expires_in:60});
  if(url.includes('/labz_admins'))return response([{user_id:'owner'}]);
  return response(options.method==='PATCH'?[]:[row]);
 }});
 await client.login('owner@example.test','password');await client.updateStatus(row.request_id,'done');
 assert.equal(client.snapshot().phase,'error');assert.deepEqual(client.snapshot().rows,[]);
});
