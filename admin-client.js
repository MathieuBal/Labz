// Access tokens and messages live in memory only; reloading requires login.
export const statuses = Object.freeze({new:'Nouveau',in_progress:'En cours',done:'Traité'});
export function escapeText(value) {
 return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function filterFeedback(rows,{query='',project='',status=''}={}) {
 const term=normalize(query.trim());
 return rows.filter(r=>(!project||r.project===project)&&(!status||r.status===status)&&
  (!term||normalize([r.summary,r.message,r.nickname,r.project].join(' ')).includes(term)));
}
export function createInbox({url,key,fetcher=fetch,changed=()=>{},now=Date.now,
 schedule=setTimeout,cancel=clearTimeout}) {
 let generation=0, token=null, expiry=0, timer=null, controllers=new Set();
 let state={phase:'signed_out',rows:[],error:'',busy:false};
 const emit=patch=>{state={...state,...patch};changed({...state,rows:[...state.rows]});};
 function clear(phase='signed_out',error='') {
  generation++; controllers.forEach(c=>c.abort());controllers.clear();cancel(timer);
  token=null;expiry=0;state={phase,rows:[],error,busy:false};changed({...state,rows:[]});
 }
 function valid(ticket) {return ticket===generation;}
 async function request(path,{method='GET',body,access=token}={}) {
  const controller=new AbortController();controllers.add(controller);
  const timeout=schedule(()=>controller.abort(),15000);
  try {
   const response=await fetcher(url+path,{method,signal:controller.signal,cache:'no-store',
    headers:{apikey:key,...(access?{Authorization:'Bearer '+access}:{}),
     ...(body?{'Content-Type':'application/json'}:{}),
     ...(method==='PATCH'?{Prefer:'return=representation'}:{})},
    ...(body?{body:JSON.stringify(body)}:{})});
   if(!response.ok) {const error=new Error('request');error.status=response.status;throw error;}
   return response.status===204?null:await response.json();
  } finally {controllers.delete(controller);cancel(timeout);}
 }
 function fail(error,ticket) {
  if(!valid(ticket))return;
  if(error.status===401||now()>=expiry)clear('expired','Session expirée. Reconnecte-toi.');
  else if(error.status===403)clear('forbidden','Ce compte ne possède pas les droits nécessaires.');
  else emit({phase:'error',rows:[],busy:false,error:'Connexion au service impossible. Réessaie.'});
 }
 async function refresh() {
  if(!token||state.busy)return;
  if(now()>=expiry){clear('expired','Session expirée. Reconnecte-toi.');return;}
  const ticket=generation;emit({phase:'loading',rows:[],busy:true,error:''});
  try {
   const admins=await request('/rest/v1/labz_admins?select=user_id');
   if(!valid(ticket))return;
   if(!Array.isArray(admins)||admins.length!==1){clear('forbidden','Ce compte ne possède pas les droits nécessaires.');return;}
   const rows=await request('/rest/v1/labz_feedback?select=request_id,created_at,project,kind,summary,message,nickname,status&order=created_at.desc,request_id.desc&limit=500');
   if(!valid(ticket))return;
   if(!Array.isArray(rows))throw new Error('invalid');
   emit({phase:'ready',rows,busy:false});
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
 async function updateStatus(id,status) {
  if(!token||state.busy||!Object.hasOwn(statuses,status)||!state.rows.some(r=>r.request_id===id))return;
  if(now()>=expiry){clear('expired','Session expirée. Reconnecte-toi.');return;}
  const ticket=generation;emit({busy:true,error:''});
  try {
   const rows=await request('/rest/v1/labz_feedback?request_id=eq.'+encodeURIComponent(id)+'&select=request_id,status',
    {method:'PATCH',body:{status}});
   if(!valid(ticket))return;
   if(!Array.isArray(rows)||rows.length!==1||rows[0].status!==status)throw new Error('not_updated');
   emit({rows:state.rows.map(r=>r.request_id===id?{...r,status}:r),busy:false});
  }catch(error){fail(error,ticket);}
 }
 async function logout() {
  const previous=token;clear();
  if(previous)try{await request('/auth/v1/logout?scope=local',{method:'POST',access:previous});}
  catch { /* Local private state was already destroyed. No refresh token is stored. */ }
 }
 return {login,refresh,updateStatus,logout,dispose:()=>clear(),snapshot:()=>({...state,rows:[...state.rows]})};
}
