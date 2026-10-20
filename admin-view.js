import {createInbox,escapeText as esc,filterFeedback,statuses} from './admin-client.js';
import {adminConfig} from './admin-config.js';

export function mountAdmin(root,projects) {
 let disposed=false, filters={query:'',project:'',status:''};
 const names=new Map(projects.map(p=>[p.id,p.name]));
 const client=createInbox({...adminConfig,changed:render});
 const title='<div class="page-intro"><span class="eyebrow">ESPACE PRIVÉ</span><h1>La boîte du labo.</h1><p>Les retours reçus, du premier regard à la résolution.</p></div>';
 function render(state) {
  if(disposed)return;
  const signin=['signed_out','signing_in','expired','forbidden'].includes(state.phase);
  if(signin) {
   root.innerHTML=title+`<section class="admin-login"><h2>Connexion propriétaire</h2><p>Utilise ton compte préalablement autorisé. Cette page ne crée aucun accès administrateur.</p>
   <form id="admin-login"><label class="field">Adresse e-mail<input type="email" name="email" autocomplete="username" required></label>
   <label class="field">Mot de passe<input type="password" name="password" autocomplete="current-password" required></label>
   <button class="button primary" ${state.busy?'disabled':''}>${state.busy?'Connexion…':'Ouvrir ma boîte'}</button></form>
   <p role="status">${esc(state.error)}</p><p class="muted">La session reste uniquement dans cet onglet. Un rechargement ou une sortie de cet espace demande une nouvelle connexion.</p></section>`;
   root.querySelector('#admin-login').addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;
    const email=form.elements.email.value.trim(), password=form.elements.password.value;
    form.elements.password.value='';void client.login(email,password);
   });return;
  }
  root.innerHTML=title+`<section class="admin-inbox"><div class="admin-toolbar"><p class="muted">Messages privés · aucune publication automatique</p><div class="admin-actions">
   <button class="button secondary" id="admin-refresh" ${state.busy?'disabled':''}>Actualiser</button>
   <button class="button secondary" id="admin-logout">Se déconnecter</button></div></div>
   <div class="admin-counts">${Object.entries(statuses).map(([id,label])=>`<div><strong>${state.rows.filter(r=>r.status===id).length}</strong><span>${label}</span></div>`).join('')}</div>
   <div class="admin-filters"><label class="field">Rechercher<input id="admin-query" type="search" placeholder="Titre, message ou pseudo" value="${esc(filters.query)}"></label>
   <label class="field">Projet<select id="admin-project"><option value="">Tous les projets</option>${projects.map(p=>`<option value="${esc(p.id)}" ${filters.project===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label>
   <label class="field">Statut<select id="admin-status"><option value="">Tous les statuts</option>${Object.entries(statuses).map(([id,label])=>`<option value="${id}" ${filters.status===id?'selected':''}>${label}</option>`).join('')}</select></label></div>
   <p role="status" id="admin-result"></p><div id="admin-list" aria-busy="${state.busy}"></div></section>`;
  root.querySelector('#admin-refresh').onclick=()=>void client.refresh();
  root.querySelector('#admin-logout').onclick=()=>{filters={query:'',project:'',status:''};void client.logout();};
  for(const [id,key] of [['admin-query','query'],['admin-project','project'],['admin-status','status']]) {
   root.querySelector('#'+id).addEventListener(key==='query'?'input':'change',event=>{filters[key]=event.target.value;drawRows(state);});
  }
  drawRows(state);
 }
 function drawRows(state) {
  const rows=filterFeedback(state.rows,filters), result=root.querySelector('#admin-result');
  result.textContent=state.phase==='loading'?'Chargement des retours…':state.phase==='error'?state.error:
   state.busy?'Enregistrement du statut…':state.rows.length===0?'Aucun retour reçu pour le moment.':
   rows.length===0?'Aucun retour ne correspond à ces filtres.':rows.length+' retour(s) affiché(s) sur '+state.rows.length+'.';
  root.querySelector('#admin-list').innerHTML=rows.map(r=>`<article class="admin-message">
   <div class="admin-message-meta"><span>${esc(names.get(r.project)||r.project)} · ${esc({idea:'Idée',bug:'Problème',opinion:'Avis'}[r.kind]||r.kind)}</span>
   <time>${esc(new Date(r.created_at).toLocaleString('fr-FR'))}</time></div>
   <h2>${esc(r.summary)}</h2><p class="admin-message-body">${esc(r.message)}</p>
   ${r.nickname?`<p class="muted">Pseudo : ${esc(r.nickname)}</p>`:''}
   <label class="field">Statut du retour<select data-status-id="${esc(r.request_id)}" ${state.busy?'disabled':''}>
   ${Object.entries(statuses).map(([id,label])=>`<option value="${id}" ${r.status===id?'selected':''}>${label}</option>`).join('')}</select></label></article>`).join('');
  root.querySelectorAll('[data-status-id]').forEach(select=>select.onchange=()=>void client.updateStatus(select.dataset.statusId,select.value));
 }
 render(client.snapshot());
 return ()=>{disposed=true;filters={query:'',project:'',status:''};void client.logout();root.replaceChildren();};
}
