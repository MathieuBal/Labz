import test from 'node:test';
import assert from 'node:assert/strict';
import {loadActivity,clearActivityCache,normalizeReleases,normalizeCommits} from '../github-activity.js';
const repo='MathieuBal/Sensoria';
const release={name:'Version <test>',tag_name:'v1',published_at:'2026-10-20T08:00:00Z',html_url:`https://github.com/${repo}/releases/tag/v1`,body:'Notes',draft:false};
const commit={html_url:`https://github.com/${repo}/commit/abc`,commit:{message:'Fix\nDetails',committer:{date:'2026-10-19T08:00:00Z'}}};
const response=data=>({ok:true,json:async()=>data});
test('release normalization rejects drafts, unsafe URLs, missing dates and foreign repos',()=>{
  assert.equal(normalizeReleases([release,{...release,draft:true},{...release,html_url:'javascript:alert(1)'},{...release,html_url:'https://github.com/Other/Repo/releases/tag/v1'},{...release,published_at:'not-a-date'}],repo).length,1);
  assert.equal(normalizeReleases([{...release,body:'a'.repeat(900),prerelease:true}],repo)[0].excerpt.length,600);
  assert.equal(normalizeReleases([{...release,prerelease:true}],repo)[0].preview,true);
  assert.equal(normalizeCommits([commit],repo)[0].title,'Fix');
  assert.throws(()=>normalizeReleases({message:'error'},repo));
});
test('public releases are preferred, cached, and survive a refresh error',async()=>{
  clearActivityCache();let calls=0;
  const fetcher=async(url,options)=>{calls++;assert.match(url,/^https:\/\/api.github.com\/repos\/MathieuBal\/Sensoria\/releases/);assert.equal(options.credentials,'omit');return response([release]);};
  const first=await loadActivity('sensoria',{fetcher,now:100});assert.equal(first.items[0].kind,'release');
  assert.equal((await loadActivity('sensoria',{fetcher,now:200})).cached,true);assert.equal(calls,1);
  const stale=await loadActivity('sensoria',{force:true,fetcher:async()=>({ok:false,status:429})});assert.equal(stale.state,'stale');assert.equal(stale.items.length,1);
});
test('empty releases fall back to explicitly marked commit activity',async()=>{
  clearActivityCache();const urls=[];
  const result=await loadActivity('sensoria',{fetcher:async url=>{urls.push(url);return response(url.includes('/releases')?[]:[commit]);}});
  assert.equal(urls.length,2);assert.equal(result.items[0].kind,'commit');assert.equal(result.state,'ready');
});
test('unknown or private projects never trigger a request; rate limits stay explicit',async()=>{
  clearActivityCache();
  for (const id of ['constella','constructor','__proto__']) assert.equal((await loadActivity(id,{fetcher:()=>{throw Error('must not fetch');}})).state,'unsupported');
  assert.equal((await loadActivity('sensoria',{fetcher:async()=>({ok:false,status:403})})).error,'rate-limit');
});
test('an aborted navigation rejects rather than producing a false empty state',async()=>{
  clearActivityCache();const controller=new AbortController();controller.abort();
  await assert.rejects(()=>loadActivity('sensoria',{signal:controller.signal,fetcher:async()=>{throw new Error('aborted');}}));
});
