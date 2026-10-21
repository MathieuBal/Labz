import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedbackDrafts,DRAFT_TTL} from '../feedback-drafts.js';
const data={kind:'idea',summary:'Une idée',message:'Un message de test',nickname:''};
function fixture() {
  const entries=new Map();let sequence=0,time=1000000000000;
  const storage={getItem:k=>entries.get(k)||null,setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.delete(k)};
  const options={storage,now:()=>time,uuid:()=>`12345678-1234-4123-8123-${String(++sequence).padStart(12,'0')}`};
  return {entries,options,advance:ms=>time+=ms,create:()=>createFeedbackDrafts(options)};
}
test('lost receipt and reload retry the same request, resulting in one simulated server row',()=>{
  const f=fixture(), server=new Set();
  const ticket=f.create().prepare('sensoria',data);server.add(ticket.requestId);
  // Response lost: no settle. The second instance models a page reload.
  const next=f.create(), retry=next.prepare('sensoria',data);server.add(retry.requestId);
  assert.equal(retry.requestId,ticket.requestId);assert.equal(server.size,1);
  next.settle(retry,true);
  const third=f.create();assert.equal(third.state('sensoria',data),'received');
  assert.equal(third.prepare('sensoria',data).alreadyReceived,true);
});
test('edited content has a new identity and late success does not replace the draft',()=>{
  const f=fixture(),drafts=f.create(),ticket=drafts.prepare('sensoria',data);
  const edited={...data,summary:'Autre titre'};
  drafts.save('sensoria',edited);drafts.settle(ticket,true);
  assert.equal(drafts.read('sensoria').data.summary,edited.summary);
  assert.equal(drafts.state('sensoria',edited),'draft');
  const second=drafts.prepare('sensoria',edited);assert.notEqual(second.requestId,ticket.requestId);
  assert.equal(drafts.prepare('sensoria',data).alreadyReceived,true);
});
test('late acknowledgement after erasure cannot resurrect any private text',()=>{
  const f=fixture(),drafts=f.create(),ticket=drafts.prepare('sensoria',data);
  assert.equal(drafts.erase('sensoria'),true);assert.equal(drafts.settle(ticket,true),false);
  assert.equal(drafts.read('sensoria'),null);assert.equal(f.entries.size,0);
});
test('response for one project does not change another open project',()=>{
  const f=fixture(),drafts=f.create(),ticket=drafts.prepare('sensoria',data);
  drafts.save('lootchest',{...data,message:'Autre projet'});drafts.settle(ticket,true);
  assert.equal(drafts.state('lootchest'),'draft');
  assert.equal(drafts.read('lootchest').data.message,'Autre projet');
});
test('blocked storage keeps the session retry identity and reports lack of persistence',()=>{
  const drafts=createFeedbackDrafts({storage:{getItem(){throw Error();},setItem(){throw Error();}},uuid:()=> '12345678-1234-4123-8123-000000000001'});
  const ticket=drafts.prepare('sensoria',data);drafts.settle(ticket,false);
  assert.equal(ticket.persisted,false);assert.equal(drafts.isPersistent('sensoria'),false);
  assert.equal(drafts.state('sensoria',data),'uncertain');
  assert.equal(drafts.prepare('sensoria',data).requestId,ticket.requestId);
  assert.equal(drafts.erase('sensoria'),false);
});
test('expired drafts and receipt history are removed without a network call',()=>{
  const f=fixture(),drafts=f.create(),ticket=drafts.prepare('sensoria',data);
  drafts.settle(ticket,true);f.advance(DRAFT_TTL);
  assert.equal(f.create().read('sensoria'),null);assert.equal(f.entries.size,0);
  assert.equal(drafts.settle(ticket,true),false);
});
test('legacy drafts migrate without being mistaken for delivered messages',()=>{
  const f=fixture();f.entries.set('labs-draft-sensoria',JSON.stringify({...data,createdAt:new Date(f.options.now()).toISOString(),status:'local-draft'}));
  const drafts=f.create();assert.equal(drafts.read('sensoria').data.message,data.message);
  assert.equal(drafts.state('sensoria'),'draft');drafts.prepare('sensoria',data);
  assert.equal(JSON.parse(f.entries.get('labs-draft-sensoria')).version,2);
});
test('expired receipt text is removed from storage even when the current draft is recent',()=>{
  const f=fixture(),drafts=f.create(),ticket=drafts.prepare('sensoria',data);
  drafts.settle(ticket,true);f.advance(DRAFT_TTL-1000);
  drafts.save('sensoria',{...data,message:'Texte récent'});f.advance(1000);
  assert.equal(f.create().read('sensoria').attempts.length,0);
  assert.equal(JSON.parse(f.entries.get('labs-draft-sensoria')).attempts.length,0);
});
test('corrupt stored data is bounded and cannot invent valid receipt fields',()=>{
  const f=fixture();f.entries.set('labs-draft-sensoria',JSON.stringify({version:2,updatedAt:f.options.now(),data:{kind:'__proto__',message:'x'.repeat(10000)},attempts:[{signature:'bad',requestId:'invalid',status:'received',createdAt:f.options.now()}]}));
  const record=f.create().read('sensoria');assert.equal(record.data.kind,'idea');
  assert.equal(record.data.message.length,3000);assert.deepEqual(record.attempts,[]);
});
