import {test,expect} from '@playwright/test';

const supabaseBase='https://kforawentogotkizxldl.supabase.co';
const feedbackId='11111111-1111-4111-8111-111111111111';
const cors={
  'access-control-allow-origin':'http://127.0.0.1:4173',
  'access-control-allow-methods':'GET,POST,PATCH,DELETE,OPTIONS',
  'access-control-allow-headers':'apikey,authorization,content-type,prefer',
};

test('un admin peut supprimer un retour non pertinent après confirmation',async({page})=>{
  let deleted=false, deleteCalls=0;
  await page.route(`${supabaseBase}/**`,async route=>{
    const request=route.request(), url=new URL(request.url()), path=url.pathname;
    if(request.method()==='OPTIONS')return route.fulfill({status:204,headers:cors});
    let status=200, body=[];
    if(path==='/auth/v1/token'&&request.method()==='POST')body={access_token:'e2e-token',expires_in:3600};
    else if(path==='/rest/v1/labz_admins')body=[{user_id:'owner'}];
    else if(path==='/rest/v1/labz_feedback') {
      if(request.method()==='DELETE') {
        deleted=true;deleteCalls++;body=[{request_id:feedbackId}];
      } else body=deleted?[]:[{request_id:feedbackId,created_at:'2026-10-26T18:00:00Z',project:'sensoria',kind:'opinion',summary:'Message hors sujet',message:'Ce retour simulé doit pouvoir être supprimé.',nickname:'',status:'new'}];
    }
    else if(['/rest/v1/labz_topics','/rest/v1/labz_topic_feedback','/rest/v1/labz_decisions'].includes(path))body=[];
    else {status=404;body={};}
    await route.fulfill({status,headers:{...cors,'content-type':'application/json'},body:JSON.stringify(body)});
  });

  await page.goto('/#/admin');
  await page.getByLabel('Adresse e-mail').fill('owner@example.test');
  await page.getByLabel('Mot de passe').fill('password');
  await page.getByRole('button',{name:'Ouvrir mon espace'}).click();
  await expect(page.getByRole('heading',{name:'Message hors sujet'})).toBeVisible();

  page.once('dialog',async dialog=>{
    expect(dialog.message()).toContain('Supprimer définitivement le retour');
    await dialog.accept();
  });
  await page.getByRole('button',{name:'Supprimer'}).click();

  await expect(page.getByText('Aucun retour reçu pour le moment.')).toBeVisible();
  expect(deleteCalls).toBe(1);
});
