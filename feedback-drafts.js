// Local drafts are never an authorization mechanism. The server deduplicates
// requests using the UUID saved here before the first network attempt.
export const DRAFT_TTL = 30 * 24 * 60 * 60 * 1000;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const kinds = new Set(['idea','bug','opinion']);
const key = project => `labs-draft-${project}`;
function clean(data) {
  return {kind:kinds.has(data?.kind)?data.kind:'idea',
    summary:typeof data?.summary==='string'?data.summary.slice(0,120):'',
    message:typeof data?.message==='string'?data.message.slice(0,3000):'',
    nickname:typeof data?.nickname==='string'?data.nickname.slice(0,50):''};
}
export function submissionSignature(data) {
  const d=clean(data);
  return JSON.stringify([d.kind,d.summary.trim(),d.message.trim(),d.nickname.trim()]);
}
export function createFeedbackDrafts({storage,now=Date.now,uuid=()=>crypto.randomUUID()}={}) {
  const records=new Map();
  const persisted=new Map();
  function persist(project,record) {
    try {storage.setItem(key(project),JSON.stringify(record));persisted.set(project,true);return true;}
    catch {persisted.set(project,false);return false;}
  }
  function read(project) {
    let record=records.get(project);
    if(!record) {
      try {
        const raw=JSON.parse(storage.getItem(key(project))||'null');
        if(raw && typeof raw==='object') {
          const updatedAt=raw.version===2?raw.updatedAt:Date.parse(raw.createdAt);
          if(Number.isFinite(updatedAt) && updatedAt<=now() && now()-updatedAt<DRAFT_TTL) {
            record={version:2,updatedAt,data:clean(raw.version===2?raw.data:raw),attempts:[]};
            if(raw.version===2 && Array.isArray(raw.attempts)) record.attempts=raw.attempts.filter(a=>
              a && typeof a.signature==='string' && a.signature.length<=20000 && uuidPattern.test(a.requestId) &&
              ['pending','uncertain','received'].includes(a.status) && Number.isFinite(a.createdAt) &&
              a.createdAt<=now() && now()-a.createdAt<DRAFT_TTL).slice(-10);
            records.set(project,record);
            persisted.set(project,true);
          }
        }
        if(!record)storage.removeItem(key(project));
      } catch { /* Storage may be blocked; in-memory drafts still work. */ }
    }
    if(record && now()-record.updatedAt>=DRAFT_TTL) {erase(project);record=null;}
    return record||null;
  }
  function save(project,data) {
    let record=read(project);
    if(!record) {record={version:2,updatedAt:now(),data:clean(data),attempts:[]};records.set(project,record);}
    record.data=clean(data);record.updatedAt=now();
    record.attempts=record.attempts.filter(a=>now()-a.createdAt<DRAFT_TTL);
    return {record,persisted:persist(project,record)};
  }
  function state(project,data) {
    const record=read(project), signature=submissionSignature(data||record?.data);
    return record?.attempts.find(a=>a.signature===signature)?.status||'draft';
  }
  function prepare(project,data) {
    const {record}=save(project,data),signature=submissionSignature(data);
    let attempt=record.attempts.find(a=>a.signature===signature);
    if(!attempt) {
      attempt={signature,requestId:uuid(),status:'pending',createdAt:now()};
      record.attempts.push(attempt);record.attempts=record.attempts.slice(-10);
    } else if(attempt.status!=='received') attempt.status='pending';
    return {project,record,attempt,requestId:attempt.requestId,alreadyReceived:attempt.status==='received',persisted:persist(project,record)};
  }
  function settle(ticket,accepted) {
    // Erasure/expiry creates a new lifecycle. A late response cannot recreate it.
    if(read(ticket.project)!==ticket.record || !ticket.record.attempts.includes(ticket.attempt))return false;
    ticket.attempt.status=accepted?'received':'uncertain';
    persist(ticket.project,ticket.record);return true;
  }
  function erase(project) {
    records.delete(project);
    persisted.delete(project);
    try {storage.removeItem(key(project));return true;} catch {return false;}
  }
  return {read,save,state,prepare,settle,erase,isPersistent:project=>persisted.get(project)!==false};
}
