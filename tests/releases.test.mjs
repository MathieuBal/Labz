import test from 'node:test';
import assert from 'node:assert/strict';
import {validateReleases,addRelease} from '../scripts/release-model.mjs';
const note={version:'1.0.0',date:'2026-10-20',title:'Une nouveauté',description:'Un changement utile.',items:['Détail']};
test('a new site version cannot ship with stale or missing release notes',()=>{
  assert.throws(()=>validateReleases([note],'1.1.0'),/ne correspond pas/);
  assert.throws(()=>validateReleases([],'1.0.0'),/vide/);
  assert.throws(()=>validateReleases([{...note,title:''}],'1.0.0'),/incomplète/);
});
test('release order compares numeric versions and preserves historical notes',()=>{
  const previous=[{...note,version:'0.9.0'}];
  const next=addRelease(previous,{...note,version:'0.10.0'});
  assert.equal(next[0].version,'0.10.0');assert.equal(previous.length,1);
  assert.throws(()=>addRelease(previous,previous[0]),/dupliquée|désordonné/);
  assert.throws(()=>addRelease(previous,{...note,version:'0.8.0'}),/désordonné/);
});
test('invalid dates and changes are rejected before publication',()=>{
  assert.throws(()=>validateReleases([{...note,date:'2026-02-30'}],note.version),/Date/);
  assert.throws(()=>validateReleases([{...note,items:[{}]}],note.version),/changements/);
});
