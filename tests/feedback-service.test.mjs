import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../supabase/functions/labz-feedback/handler.js';
import {sendPrivateFeedback} from '../feedback-client.js';
const data={project:'sensoria',kind:'idea',summary:'Une idée',message:'Voici mon retour',nickname:'',website:'',requestId:'12345678-1234-4123-8123-123456789abc'};
const request=(body=data,origin='https://mathieubal.github.io')=>new Request('https://example.test',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
test('server accepts only validated messages and acknowledges stored data',async()=>{
 let saved;const handler=createHandler({store:async x=>{saved=x;return 'accepted'}});
 assert.equal((await handler(request())).status,201);assert.equal(saved.p_project,'sensoria');assert.equal(saved.p_message,data.message);
 for(const change of [{project:'Invalid Project!'},{message:' '},{summary:'a'.repeat(121)},{nickname:42},{website:'spam'},{requestId:'invalid'}])assert.equal((await handler(request({...data,...change}))).status,400);
});
test('foreign origins, unsupported methods and oversized bodies never reach storage',async()=>{
 let calls=0;const handler=createHandler({store:async()=>{calls++;return 'accepted'}});
 assert.equal((await handler(request(data,'https://attacker.test'))).status,403);
 assert.equal((await handler(new Request('https://example.test',{headers:{origin:'https://mathieubal.github.io'}}))).status,405);
 assert.equal((await handler(request({...data,message:'x'.repeat(17000)}))).status,413);assert.equal(calls,0);
});
test('quota and storage errors cannot be mistaken for delivery',async()=>{
 assert.equal((await createHandler({store:async()=> 'limited'})(request())).status,429);
 const response=await createHandler({store:async()=>{throw new Error('secret')}})(request());
 assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/secret/);
});
test('client needs an explicit receipt and never sends cookies',async()=>{
 const endpoint='https://example.test/feedback';let options;
 await sendPrivateFeedback(endpoint,data,{fetcher:async(_url,opts)=>{options=opts;return Response.json({accepted:true},{status:201})}});
 assert.equal(options.credentials,'omit');
 await assert.rejects(sendPrivateFeedback(endpoint,data,{fetcher:async()=>Response.json({})}),/unconfirmed/);
 await assert.rejects(sendPrivateFeedback(endpoint,data,{fetcher:async()=>new Response('',{status:429})}),/limited/);
 await assert.rejects(sendPrivateFeedback('http://example.test',data),/configuration/);
});
