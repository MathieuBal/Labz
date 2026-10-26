import {test,expect,devices} from '@playwright/test';

const supabaseBase='https://kforawentogotkizxldl.supabase.co';
const pixel7={...devices['Pixel 7']};
delete pixel7.defaultBrowserType;
const cors={
  'access-control-allow-origin':'http://127.0.0.1:4173',
  'access-control-allow-methods':'GET,POST,PATCH,DELETE,OPTIONS',
  'access-control-allow-headers':'apikey,authorization,content-type,prefer',
};

async function mockSupabase(page,resolver) {
  await page.route(`${supabaseBase}/**`,async route=>{
    const request=route.request();
    if(request.method()==='OPTIONS') {
      await route.fulfill({status:204,headers:cors});
      return;
    }
    const result=await resolver(request,new URL(request.url()));
    if(!result) {
      await route.fulfill({status:404,headers:{...cors,'content-type':'application/json'},body:'{}'});
      return;
    }
    const status=result.status??200;
    const body=status===204?'':JSON.stringify(result.body??null);
    await route.fulfill({status,headers:{...cors,...(status===204?{}:{'content-type':'application/json'})},body});
  });
}

test('l’accueil ouvre une fiche riche réellement chargée dans le navigateur',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1,name:/La curiosité/})).toBeVisible();
  await page.getByRole('link',{name:/Explorer Sensoria/}).click();
  await expect(page).toHaveURL(/#\/projet\/sensoria$/);
  await expect(page.getByRole('heading',{level:1,name:'Sensoria'})).toBeVisible();
  await expect(page.getByText('Jusqu’où peut-on pousser un navigateur ?',{exact:true})).toBeVisible();
  await expect(page).toHaveTitle('Sensoria | Mathieu / Labs');
});

test('la vraie URL publique d’un projet devient la fiche interactive sans 404',async({page})=>{
  const response=await page.goto('/projets/sensoria/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/projets\/sensoria\/#\/projet\/sensoria$/);
  await expect(page.getByRole('heading',{level:1,name:'Sensoria'})).toBeVisible();
  await expect(page.getByText('Jusqu’où peut-on pousser un navigateur ?',{exact:true})).toBeVisible();
});

test('la recherche et les favoris survivent à une navigation puis à un rechargement',async({page})=>{
  await page.goto('/#/catalogue');
  const search=page.getByLabel('Rechercher un projet');
  await search.fill('Sensoria');
  await search.press('Enter');
  await expect(page.locator('.project-card')).toHaveCount(2);
  await expect(page.locator('.project-card h3').filter({hasText:'Sensoria'})).toHaveCount(1);
  await page.getByRole('button',{name:'Ajouter Sensoria aux favoris'}).click();
  await page.goto('/#/catalogue?collection=favorites');
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.getByRole('link',{name:'Sensoria',exact:true})).toBeVisible();
  await page.reload();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.getByRole('link',{name:'Sensoria',exact:true})).toBeVisible();
});

test('un feedback confirmé affiche l’accusé sans écrire dans Supabase pendant le test',async({page})=>{
  let submitted=null;
  await mockSupabase(page,async(request,url)=>{
    if(url.pathname==='/functions/v1/labz-feedback'&&request.method()==='POST') {
      submitted=request.postDataJSON();
      return {body:{accepted:true}};
    }
    return null;
  });
  await page.goto('/#/projet/sensoria');
  await page.getByRole('button',{name:'Déposer un avis'}).click();
  await page.getByLabel('En quelques mots').fill('Test navigateur');
  await page.getByLabel('Raconte-moi').fill('Ce message est intercepté localement par Playwright.');
  await page.getByRole('button',{name:'Envoyer à Mathieu'}).click();
  await expect(page.locator('#feedback-result')).toHaveText('Le texte envoyé a été reçu en privé. Merci !');
  expect(submitted).toMatchObject({project:'sensoria',kind:'idea',summary:'Test navigateur',message:'Ce message est intercepté localement par Playwright.',nickname:'',website:''});
  expect(submitted.requestId).toMatch(/^[0-9a-f-]{36}$/i);
});

test('une panne de réception garde le brouillon après rechargement',async({page})=>{
  await mockSupabase(page,async(request,url)=>{
    if(url.pathname==='/functions/v1/labz-feedback'&&request.method()==='POST') return {status:503,body:{error:'unavailable'}};
    return null;
  });
  await page.goto('/#/projet/sensoria');
  await page.getByRole('button',{name:'Déposer un avis'}).click();
  await page.getByLabel('En quelques mots').fill('Brouillon à reprendre');
  await page.getByLabel('Raconte-moi').fill('Le texte doit rester disponible malgré une erreur réseau.');
  await page.getByRole('button',{name:'Envoyer à Mathieu'}).click();
  await expect(page.locator('#feedback-result')).toHaveText('La réception n’a pas pu être confirmée. Tu peux réessayer sans changer le texte.');
  await page.reload();
  await page.getByRole('button',{name:'Déposer un avis'}).click();
  await expect(page.getByLabel('En quelques mots')).toHaveValue('Brouillon à reprendre');
  await expect(page.getByLabel('Raconte-moi')).toHaveValue('Le texte doit rester disponible malgré une erreur réseau.');
});

test.describe('navigation mobile',()=>{
  test.use(pixel7);
  test('la barre mobile pilote les routes principales',async({page})=>{
    await page.goto('/');
    const nav=page.getByRole('navigation',{name:'Navigation mobile'});
    await expect(nav).toBeVisible();
    await nav.getByRole('link',{name:'Catalogue'}).click();
    await expect(page).toHaveURL(/#\/catalogue$/);
    await expect(page.getByRole('heading',{level:1,name:'Trouve ton prochain détour.'})).toBeVisible();
    await nav.getByRole('link',{name:'Nouveautés'}).click();
    await expect(page).toHaveURL(/#\/nouveautes$/);
    await expect(nav.locator('[data-nav="nouveautes"]')).toHaveAttribute('aria-current','page');
  });
});

test('l’administration simulée se connecte et confirme un changement de statut',async({page})=>{
  let feedbackStatus='new';
  const feedbackId='11111111-1111-4111-8111-111111111111';
  const topicId='22222222-2222-4222-8222-222222222222';
  await mockSupabase(page,async(request,url)=>{
    const path=url.pathname;
    if(path==='/auth/v1/token'&&request.method()==='POST') return {body:{access_token:'e2e-token',expires_in:3600}};
    if(path==='/auth/v1/logout') return {status:204};
    if(path==='/rest/v1/labz_admins') return {body:[{user_id:'owner'}]};
    if(path==='/rest/v1/labz_feedback') {
      if(request.method()==='PATCH') {
        feedbackStatus=request.postDataJSON().status;
        return {body:[{request_id:feedbackId,status:feedbackStatus}]};
      }
      return {body:[{request_id:feedbackId,created_at:'2026-10-26T06:00:00Z',project:'sensoria',kind:'bug',summary:'Navigation mobile',message:'Un retour simulé pour le test navigateur.',nickname:'',status:feedbackStatus}]};
    }
    if(path==='/rest/v1/labz_topics') return {body:[{id:topicId,created_at:'2026-10-26T06:01:00Z',updated_at:'2026-10-26T06:02:00Z',project:'sensoria',type:'problem',title:'Navigation mobile',synthesis:'Vérifier le parcours mobile.',impact:'medium',effort:'low',state:'to_study',decision_rationale:''}]};
    if(path==='/rest/v1/labz_topic_feedback') return {body:[]};
    if(path==='/rest/v1/labz_decisions') return {body:[]};
    return null;
  });
  await page.goto('/#/admin');
  await page.getByLabel('Adresse e-mail').fill('owner@example.test');
  await page.getByLabel('Mot de passe').fill('password');
  await page.getByRole('button',{name:'Ouvrir mon espace'}).click();
  await expect(page.getByRole('tab',{name:'Retours'})).toBeVisible();
  const status=page.getByLabel('Statut du retour');
  await status.selectOption('in_progress');
  await expect(page.getByLabel('Statut du retour')).toHaveValue('in_progress');
  await page.getByRole('tab',{name:'Sujets & décisions'}).click();
  await expect(page.getByRole('heading',{name:'Navigation mobile'})).toBeVisible();
  await expect(page.locator('.admin-topic-synthesis')).toHaveText('Vérifier le parcours mobile.');
});
