// Access tokens and private admin data live in memory only; reloading requires login.
export const statuses = Object.freeze({new:'Nouveau',in_progress:'En cours',done:'Traité'});
export const topicStates = Object.freeze({to_study:'À étudier',in_progress:'En cours',deferred:'Différé',abandoned:'Abandonné',shipped:'Livré'});
export const topicTypes = Object.freeze({idea:'Idée',problem:'Problème',signal:'Signal'});
export const levels = Object.freeze({low:'Faible',medium:'Moyen',high:'Fort'});
export const feedbackCapacity = Object.freeze({maxStored:500,warningAt:400,dailyAdmissions:100});
export function getCapacityState(count) {
 const stored=Number.isFinite(count)?Math.max(0,Math.floor(count)):0;
 const remaining=Math.max(0,feedbackCapacity.maxStored-stored);
 const level=stored>=feedbackCapacity.maxStored?'full':stored>=feedbackCapacity.warningAt?'warning':'ok';
 return {stored,remaining,level,percent:Math.min(100,Math.round(stored/feedbackCapacity.maxStored*100))};
}
export function escapeText(value) {
 return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterFeedback(rows,{query='',project='',status=''}={}) {
 const term=normalize(query.trim());
 return rows.filter(r=>(!project||r.project===project)&&(!status||r.status===status)&&
  (!term||normalize([r.summary,r.message,r.nickname,r.project].join(' ')).includes(term)));
}
export function filterTopics(rows,{query='',project='',state=''}={}) {
 const term=normalize(query.trim());
 return rows.filter(r=>(!project||r.project===project)&&(!state||r.state===state)&&
  (!term||normalize([r.title,r.synthesis,r.project,topicTypes[r.type],topicStates[r.state]].join(' ')).includes(term)));
}

export function createInbox({url,key,fetcher=fetch,changed=()=>{},now=Date.now,
 schedule=setTimeout,cancel=clearTimeout}) {
 let generation=0, token=null, expiry=0, timer=null, controllers=new Set();
 let state={phase:'signed_out',rows:[],topics:[],links:[],decisions:[],error:'',busy:false};
 const clone=()=>({...state,rows:[...state.rows],topics:[...state.topics],links:[...state.links],decisions:[...state.decisions]});
 const emit=patch=>{state={...state,...patch};changed(clone());};
 function clear(phase='signed_out',error='') {
  generation++; controllers.forEach(c=>c.abort());controllers.clear();cancel(timer);
  token=null;expiry=0;state={phase,rows:[],topics:[],links:[],decisions:[],error,busy:false};changed(clone());
 }
 function valid(ticket) {return ticket===generation;}
 async function request(path,{method='GET',body,access=token,returning=false}={}) {
  const controller=new AbortController();controllers.add(controller);
  const timeout=schedule(()=>controller.abort(),15000);
  try {
   const headers={apikey:key,...(access?{Authorization:'Bearer '+access}:{}),...(body?{'Content-Type':'application/json'}:{})};
   if(returning)headers.Prefer='return=representation';
   const response=await fetcher(url+path,{method,signal:controller.signal,cache:'no-store',headers,
    ...(body?{body:JSON.stringify(body)}:{})});
   if(!response.ok) {
    let payload=null;try{payload=await response.json();}catch{}
    const error=new Error('request');error.status=response.status;error.apiMessage=payload?.message||'';throw error;
   }
   return response.status===204?null:await response.json();
  } finally {controllers.delete(controller);cancel(timeout);}
 }
 function operationMessage(error) {
  if(error.apiMessage==='topic_wip_limit')return 'Trois sujets sont déjà en cours. Termine, diffère ou abandonne un sujet avant d’en ouvrir un autre.';
  if(error.apiMessage==='decision_rationale_required')return 'Explique brièvement la décision avant de changer l’état du sujet.';
  if(error.apiMessage==='feedback_project_mismatch')return 'Un retour ne peut être rattaché qu’à un sujet du même projet.';
  if(error.apiMessage==='feedback_not_found')return 'Ce retour n’est plus disponible. Il a peut-être expiré de la boîte privée.';
  if(error.status===409)return 'Cette association existe déjà ou entre en conflit avec une donnée existante.';
  return 'Connexion au service impossible. Réessaie.';
 }
 function fail(error,ticket,preserve=false) {
  if(!valid(ticket))return;
  if(error.status===401||now()>=expiry)clear('expired','Session expirée. Reconnecte-toi.');
  else if(error.status===403)clear('forbidden','Ce compte ne possède pas les droits nécessaires.');
  else if(preserve)emit({busy:false,error:operationMessage(error)});
  else emit({phase:'error',rows:[],topics:[],links:[],decisions:[],busy:false,error:operationMessage(error)});
 }
 async function refresh() {
  if(!token||state.busy)return;
  if(now()>=expiry){clear('expired','Session expirée. Reconnecte-toi.');return;}
  const ticket=generation;emit({phase:'loading',rows:[],topics:[],links:[],decisions:[],busy:true,error:''});
  try {
   const admins=await request('/rest/v1/labz_admins?select=user_id');
   if(!valid(ticket))return;
   if(!Array.isArray(admins)||admins.length!==1){clear('forbidden','Ce compte ne possède pas les droits nécessaires.');return;}
   const [rows,topics,links,decisions]=await Promise.all([
    request('/rest/v1/labz_feedback?select=request_id,created_at,project,kind,summary,message,nickname,status&order=created_at.desc,request_id.desc&limit=500'),
    request('/rest/v1/labz_topics?select=id,created_at,updated_at,project,type,title,synthesis,impact,effort,state,decision_rationale&order=updated_at.desc,id.desc&limit=500'),
    request('/rest/v1/labz_topic_feedback?select=topic_id,feedback_id,created_at&limit=2000'),
    request('/rest/v1/labz_decisions?select=id,topic_id,state,rationale,created_at&order=created_at.desc,id.desc&limit=2000'),
   ]);
   if(!valid(ticket))return;
   if(![rows,topics,links,decisions].every(Array.isArray))throw new Error('invalid');
   emit({phase:'ready',rows,topics,links,decisions,busy:false,error:''});
  }catch(error){fail(error,ticket);}
 }
 async function login(email,password) {
  clear();const ticket=generation;emit({phase:'signing_in',busy:true});
  try {
   const result=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},access:null});
   if(!valid(ticket))return;
   if(!result.access_token||!Number.isFinite(result.expires_in)||result.expires_in<=0)throw new Error('invalid');
   token=result.access_token;expiry=now()+result.expires_in*1000;
   timer=schedule(()=>clear('expired','Session expirée. Reconnecte-toi.'),result.expires_in*1000);
   emit({busy:false});await refresh();
  } catch(error) {
   if(valid(ticket))clear('signed_out',error.status===400||error.status===401?
    'Connexion refusée. Vérifie tes identifiants et la confirmation de ton adresse.':
    error.status===429?'Trop de tentatives. Patiente avant de réessayer.':'Connexion impossible. Réessaie.');
  }
 }
 async function mutate(work) {
  if(!token||state.busy)return false;
  if(now()>=expiry){clear('expired','Session expirée. Reconnecte-toi.');return false;}
  const ticket=generation;emit({busy:true,error:''});
  try {
   await work();if(!valid(ticket))return false;
   emit({busy:false});await refresh();return true;
  }catch(error){fail(error,ticket,true);return false;}
 }
 async function updateStatus(id,status) {
  if(!Object.hasOwn(statuses,status)||!state.rows.some(r=>r.request_id===id))return false;
  return mutate(async()=>{
   const rows=await request('/rest/v1/labz_feedback?request_id=eq.'+encodeURIComponent(id)+'&select=request_id,status',
    {method:'PATCH',body:{status},returning:true});
   if(!Array.isArray(rows)||rows.length!==1||rows[0].status!==status)throw new Error('not_updated');
  });
 }
 async function deleteFeedback(id) {
  if(!state.rows.some(r=>r.request_id===id))return false;
  return mutate(async()=>{
   const rows=await request('/rest/v1/labz_feedback?request_id=eq.'+encodeURIComponent(id)+'&select=request_id',
    {method:'DELETE',returning:true});
   if(!Array.isArray(rows)||rows.length!==1||rows[0].request_id!==id)throw new Error('not_deleted');
  });
 }
 async function createTopic({feedbackId=null,project,type,title,synthesis='',impact='medium',effort='medium'}) {
  if(!project||!Object.hasOwn(topicTypes,type)||!Object.hasOwn(levels,impact)||!Object.hasOwn(levels,effort))return false;
  return mutate(async()=>{
   const id=await request('/rest/v1/rpc/labz_create_topic',{method:'POST',body:{
    p_feedback_id:feedbackId||null,p_project:project,p_type:type,p_title:String(title||'').trim(),
    p_synthesis:String(synthesis||'').trim(),p_impact:impact,p_effort:effort,
   }});
   if(typeof id!=='string'||!id)throw new Error('not_created');
  });
 }
 async function updateTopic(id,patch) {
  const topic=state.topics.find(t=>t.id===id);if(!topic)return false;
  const allowed=['type','title','synthesis','impact','effort','state','decision_rationale'];
  const body=Object.fromEntries(Object.entries(patch).filter(([name])=>allowed.includes(name)));
  if(!Object.keys(body).length)return false;
  if(body.state&&body.state!==topic.state&&!Object.hasOwn(topicStates,body.state))return false;
  return mutate(async()=>{
   const rows=await request('/rest/v1/labz_topics?id=eq.'+encodeURIComponent(id)+'&select=id,state,updated_at',
    {method:'PATCH',body,returning:true});
   if(!Array.isArray(rows)||rows.length!==1)throw new Error('not_updated');
  });
 }
 async function attachFeedback(topicId,feedbackId) {
  const topic=state.topics.find(t=>t.id===topicId), feedback=state.rows.find(r=>r.request_id===feedbackId);
  if(!topic||!feedback||topic.project!==feedback.project||state.links.some(l=>l.topic_id===topicId&&l.feedback_id===feedbackId))return false;
  return mutate(()=>request('/rest/v1/labz_topic_feedback',{method:'POST',body:{topic_id:topicId,feedback_id:feedbackId},returning:true}));
 }
 async function detachFeedback(topicId,feedbackId) {
  if(!state.links.some(l=>l.topic_id===topicId&&l.feedback_id===feedbackId))return false;
  return mutate(()=>request('/rest/v1/labz_topic_feedback?topic_id=eq.'+encodeURIComponent(topicId)+'&feedback_id=eq.'+encodeURIComponent(feedbackId),{method:'DELETE'}));
 }
 async function logout() {
  const previous=token;clear();
  if(previous)try{await request('/auth/v1/logout?scope=local',{method:'POST',access:previous});}
  catch { /* Local private state was already destroyed. No refresh token is stored. */ }
 }
 return {login,refresh,updateStatus,deleteFeedback,createTopic,updateTopic,attachFeedback,detachFeedback,logout,dispose:()=>clear(),snapshot:clone};
}
