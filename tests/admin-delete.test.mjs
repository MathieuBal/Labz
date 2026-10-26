import test from 'node:test';
import assert from 'node:assert/strict';
import {createInbox} from '../admin-client.js';

const feedbackId='11111111-1111-4111-8111-111111111111';
const response=(body,status=200)=>({ok:status<400,status,json:async()=>body});

function setup() {
 let deleted=false;
 const calls=[];
 const fetcher=async(url,options)=>{
  calls.push({url,options});
  if(url.includes('/auth/v1/token?'))return response({access_token:'token',expires_in:60});
  if(url.includes('/rest/v1/labz_admins'))return response([{user_id:'owner'}]);
  if(url.includes('/rest/v1/labz_topics'))return response([]);
  if(url.includes('/rest/v1/labz_topic_feedback'))return response([]);
  if(url.includes('/rest/v1/labz_decisions'))return response([]);
  if(url.includes('/rest/v1/labz_feedback')) {
   if(options.method==='DELETE') {
    deleted=true;
    return response([{request_id:feedbackId}]);
   }
   return response(deleted?[]:[{
    request_id:feedbackId,
    created_at:'2026-10-26T12:00:00Z',
    project:'sensoria',
    kind:'opinion',
    status:'new',
    summary:'Hors sujet',
    message:'Commentaire à supprimer.',
    nickname:'',
   }]);
  }
  if(url.includes('/auth/v1/logout'))return response(null,204);
  throw new Error('unexpected '+url);
 };
 const client=createInbox({
  url:'https://example.test',key:'public',fetcher,
  schedule:()=>1,cancel:()=>{},now:()=>0,
 });
 return {client,calls};
}

test('an authorized admin deletes one known feedback and refreshes the inbox',async()=>{
 const {client,calls}=setup();
 await client.login('owner@example.test','password');
 assert.equal(client.snapshot().rows.length,1);
 assert.equal(await client.deleteFeedback(feedbackId),true);
 assert.equal(client.snapshot().rows.length,0);
 const call=calls.find(item=>item.options.method==='DELETE'&&item.url.includes('/rest/v1/labz_feedback'));
 assert.ok(call);
 assert.match(call.url,/request_id=eq\.11111111-1111-4111-8111-111111111111/);
 assert.match(call.url,/select=request_id/);
 assert.equal(call.options.headers.Prefer,'return=representation');
});

test('an unknown feedback id is never sent to the delete endpoint',async()=>{
 const {client,calls}=setup();
 await client.login('owner@example.test','password');
 assert.equal(await client.deleteFeedback('22222222-2222-4222-8222-222222222222'),false);
 assert.equal(calls.filter(item=>item.options.method==='DELETE').length,0);
});
