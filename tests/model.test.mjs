import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCollection, readCollection, writeCollection, rememberLaunch, parseRoute,
  catalogueHref, githubFeedbackUrl, validateFeedback } from '../model.js';
const ids = new Set(['sensoria','lootchest','pixels']);
test('stored collection rejects deleted projects, duplicates and malformed content', () => {
  assert.deepEqual(sanitizeCollection({favorites:['sensoria','sensoria','unknown',null],recent:['pixels',42]},ids),{favorites:['sensoria'],recent:['pixels']});
  assert.deepEqual(readCollection({getItem(){return '{broken';}},ids),{favorites:[],recent:[]});
  assert.deepEqual(readCollection(null,ids),{favorites:[],recent:[]});
  assert.equal(writeCollection({setItem(){throw Error('quota');}},{}),false);
});
test('reopening a project moves it first without duplicate history or lost favorites', () => {
  assert.deepEqual(rememberLaunch({favorites:['pixels'],recent:['sensoria','lootchest']},'lootchest'),{favorites:['pixels'],recent:['lootchest','sensoria']});
  const many = {favorites:[],recent:Array.from({length:8},(_,i)=>`p${i}`)};
  assert.equal(rememberLaunch(many,'new').recent.length,8);
});
test('combined filters survive route serialization including punctuation and accents', () => {
  const href=catalogueHref({category:'jeux',query:'échecs & <idée> ?',playable:true,favorites:true,sort:'name'});
  const route=parseRoute(href);
  assert.deepEqual(route,{segments:['catalogue','jeux'],query:'échecs & <idée> ?',playable:true,favorites:true,sort:'name'});
  assert.equal(parseRoute('#/catalogue?sort=evil').sort,'selection');
});
const data={projectName:'Sensoria',kind:'bug',summary:'Écran noir & retour',message:'Après le lancement, aucun tableau.',nickname:'Test'};
test('feedback rejects whitespace-only fields',()=>{
  assert.notEqual(validateFeedback({...data,summary:'   '}),'');
  assert.notEqual(validateFeedback({...data,message:'  \n  '}),'');
  assert.equal(validateFeedback(data),'');
});
test('GitHub handoff encodes text and only targets the chosen public issue form',()=>{
  const url=new URL(githubFeedbackUrl(data));
  assert.equal(url.origin,'https://github.com');
  assert.equal(url.pathname,'/MathieuBal/Labz/issues/new');
  assert.match(url.searchParams.get('title'),/Écran noir & retour/);
  assert.ok(url.searchParams.get('body').includes(data.message));
  assert.equal(githubFeedbackUrl({...data,message:'🧪'.repeat(2000)}),null);
});
