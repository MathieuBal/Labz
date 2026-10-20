const projects = new Set(['sensoria','million-de-pixels','lootchest','diagnostic','constella','chess','pipboy','atelierflow']);
const kinds = new Set(['idea','bug','opinion']);
const MAX_BYTES = 16000;
export function validateSubmission(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const {project,kind,summary,message,nickname='',website='',requestId} = value;
  if (!projects.has(project) || !kinds.has(kind) || typeof website !== 'string' || website.trim()) return null;
  if (![summary,message,nickname].every(x=>typeof x==='string')) return null;
  if (summary.trim().length<3 || summary.length>120 || message.trim().length<5 || message.length>3000 || nickname.length>50) return null;
  if (typeof requestId!=='string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return null;
  return {p_request_id:requestId,p_project:project,p_kind:kind,p_summary:summary.trim(),p_message:message.trim(),p_nickname:nickname.trim()};
}
async function readBounded(request) {
  if (Number(request.headers.get('content-length'))>MAX_BYTES) throw new Error('size');
  if (!request.body) throw new Error('body');
  const reader=request.body.getReader();let size=0;let text='';const decoder=new TextDecoder();
  try { while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BYTES)throw new Error('size');text+=decoder.decode(value,{stream:true});}text+=decoder.decode();return JSON.parse(text); }
  finally { await reader.cancel().catch(()=>{});reader.releaseLock(); }
}
export function createHandler({store, origin='https://mathieubal.github.io'}) {
  return async request => {
    const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
    const respond=(status,body)=>new Response(JSON.stringify(body),{status,headers});
    if(request.headers.get('origin')!==origin)return respond(403,{error:'origin'});
    headers['Access-Control-Allow-Origin']=origin;
    headers['Access-Control-Allow-Methods']='POST, OPTIONS';
    headers['Access-Control-Allow-Headers']='content-type';
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
    if(request.method!=='POST')return respond(405,{error:'method'});
    if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return respond(415,{error:'content-type'});
    let submission;
    try { submission=validateSubmission(await readBounded(request)); }
    catch(error){return respond(error.message==='size'?413:400,{error:'invalid'});}
    if(!submission)return respond(400,{error:'invalid'});
    try {
      const result=await store(submission);
      if(result==='limited')return respond(429,{error:'limited'});
      if(result!=='accepted')throw new Error('storage');
      return respond(201,{accepted:true});
    } catch { return respond(503,{error:'unavailable'}); }
  };
}
