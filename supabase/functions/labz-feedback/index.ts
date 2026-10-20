import { createHandler } from './handler.js';
// Secrets remain in the Edge Function runtime, never in the Pages bundle.
Deno.serve(createHandler({store: async (submission: Record<string,string>) => {
  const base = Deno.env.get('SUPABASE_URL');
  const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
  const key = keys.default || Deno.env.get('LABZ_SECRET_KEY');
  if (!base || !key) throw new Error('not-configured');
  const response = await fetch(`${base}/rest/v1/rpc/labz_submit_feedback`, {
    method:'POST',headers:{apikey:key,'Content-Type':'application/json'},
    body:JSON.stringify(submission),signal:AbortSignal.timeout(8000)
  });
  if(!response.ok)throw new Error('storage');
  return await response.json();
}}));
