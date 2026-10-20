const {PGlite} = await import(process.env.LABZ_PGLITE_MODULE || '@electric-sql/pglite');
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const db=new PGlite();
await db.exec('create role anon; create role authenticated; create role service_role;');
await db.exec(await readFile(new URL('../supabase/migrations/20261020150000_labz_feedback.sql', import.meta.url),'utf8'));
const id='12345678-1234-4123-8123-123456789abc';
const submit=async()=> (await db.query("select public.labz_submit_feedback($1,'sensoria','idea','Une idée','Un message de test','') as result",[id])).rows[0].result;
await db.exec('set role service_role');assert.equal(await submit(),'accepted');assert.equal(await submit(),'accepted');
await db.exec('reset role');assert.equal((await db.query('select count(*)::int as n from public.labz_feedback')).rows[0].n,1);
for(const role of ['anon','authenticated']){
 await db.exec('set role '+role);
 await assert.rejects(db.query('select * from public.labz_feedback'),/permission denied/);
 await assert.rejects(submit(),/permission denied/);
 await assert.rejects(db.query("insert into public.labz_feedback(request_id,project,kind,summary,message) values(gen_random_uuid(),'sensoria','idea','abc','hello')"),/permission denied/);
 await db.exec('reset role');
}
await db.exec('update public.labz_feedback_quota set count=100; set role service_role');
assert.equal((await db.query("select public.labz_submit_feedback(gen_random_uuid(),'sensoria','idea','Autre idée','Autre message','') as result")).rows[0].result,'limited');
await db.exec('reset role');assert.equal((await db.query('select count(*)::int as n from public.labz_feedback')).rows[0].n,1);
console.log('PostgreSQL checks passed: migration, private access, idempotency, quota.');
await db.close();
