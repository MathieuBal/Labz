import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('decision schema stays private, admin-only and concurrency safe',async()=>{
 const sql=await read('supabase/migrations/20261026060647_labz_feedback_decisions.sql');
 for(const table of ['labz_topics','labz_topic_feedback','labz_decisions']) {
  assert.match(sql,new RegExp(`alter table public\\.${table} enable row level security`));
 }
 assert.match(sql,/revoke all on schema private from public, anon, authenticated/);
 assert.match(sql,/grant select on public\.labz_decisions to authenticated/);
 assert.doesNotMatch(sql,/grant insert[^;]*public\.labz_decisions[^;]*to authenticated/i);
 assert.match(sql,/pg_advisory_xact_lock\(20261026, 1812\)/);
 assert.match(sql,/count\(\*\) from public\.labz_topics where state = 'in_progress'/);
 assert.match(sql,/message = 'topic_wip_limit'/);
 assert.match(sql,/message = 'decision_rationale_required'/);
 assert.match(sql,/private\.labz_topics_record_decision\(\)[\s\S]*security definer/);
 assert.match(sql,/public\.labz_create_topic\([\s\S]*security invoker/);
 assert.match(sql,/on delete cascade/);
});

test('admin UI separates raw feedback from durable topics and decisions',async()=>{
 const view=await read('admin-view.js');
 assert.match(view,/Retours/);
 assert.match(view,/Sujets & décisions/);
 assert.match(view,/Les messages restent bruts et temporaires/);
 assert.match(view,/La synthèse doit rester exploitable même après suppression du retour brut/);
 assert.match(view,/data-topic-decision/);
 assert.match(view,/data-topic-from-feedback/);
 assert.match(view,/3 en cours/);
});
