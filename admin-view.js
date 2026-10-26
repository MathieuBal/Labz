import {createInbox,escapeText as esc,feedbackCapacity,filterFeedback,filterTopics,getCapacityState,levels,statuses,topicStates,topicTypes} from './admin-client.js';
import {adminConfig} from './admin-config.js';

export function mountAdmin(root,projects) {
 let disposed=false, section='feedback', filters={query:'',project:'',status:''}, topicFilters={query:'',project:'',state:''}, composer=null;
 const names=new Map(projects.map(p=>[p.id,p.name]));
 const client=createInbox({...adminConfig,changed:render});
 const title='<div class="page-intro"><span class="eyebrow">ESPACE PRIVÉ</span><h1>Du retour à la décision.</h1><p>Les messages restent bruts et temporaires. Les sujets gardent seulement la synthèse utile pour décider.</p></div>';
 const selectOptions=(values,current='')=>Object.entries(values).map(([id,label])=>`<option value="${id}" ${current===id?'selected':''}>${esc(label)}</option>`).join('');
 const projectOptions=current=>projects.map(p=>`<option value="${esc(p.id)}" ${current===p.id?'selected':''}>${esc(p.name)}</option>`).join('');
 const kindToTopic={idea:'idea',bug:'problem',opinion:'signal'};
 function render(state) {
  if(disposed)return;
  const signin=['signed_out','signing_in','expired','forbidden'].includes(state.phase);
  if(signin) {
   root.innerHTML=title+`<section class="admin-login"><h2>Connexion propriétaire</h2><p>Utilise ton compte préalablement autorisé. Cette page ne crée aucun accès administrateur.</p>
   <form id="admin-login"><label class="field">Adresse e-mail<input type="email" name="email" autocomplete="username" required></label>
   <label class="field">Mot de passe<input type="password" name="password" autocomplete="current-password" required></label>
   <button class="button primary" ${state.busy?'disabled':''}>${state.busy?'Connexion…':'Ouvrir mon espace'}</button></form>
   <p role="status">${esc(state.error)}</p><p class="muted">La session reste uniquement dans cet onglet. Un rechargement ou une sortie de cet espace demande une nouvelle connexion.</p></section>`;
   root.querySelector('#admin-login').addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;
    const email=form.elements.email.value.trim(), password=form.elements.password.value;
    form.elements.password.value='';void client.login(email,password);
   });return;
  }
  const capacity=getCapacityState(state.rows.length), wip=state.topics.filter(t=>t.state==='in_progress').length;
  const capacityNote=capacity.level==='full'?
   'Capacité atteinte : le statut « Traité » ne libère pas de place. Les messages bruts quittent la boîte selon leur cycle de rétention.':
   capacity.level==='warning'?
    `Capacité à surveiller : ${capacity.remaining} place(s) restante(s) sur ${feedbackCapacity.maxStored}.`:
    `${capacity.remaining} place(s) restante(s) sur ${feedbackCapacity.maxStored}.`;
  root.innerHTML=title+`<section class="admin-inbox"><div class="admin-toolbar"><p class="muted">Données privées · aucune publication automatique</p><div class="admin-actions">
   <button class="button secondary" id="admin-refresh" ${state.busy?'disabled':''}>Actualiser</button>
   <button class="button secondary" id="admin-logout">Se déconnecter</button></div></div>
   <div class="admin-counts"><div><strong>${state.rows.length}</strong><span>Retours bruts</span></div><div><strong>${state.topics.length}</strong><span>Sujets</span></div><div><strong>${wip}/3</strong><span>Sujets en cours</span></div><div><strong>${capacity.stored}/${feedbackCapacity.maxStored}</strong><span>Capacité · ${capacity.percent}%</span></div></div>
   <p class="muted">${esc(capacityNote)} Limite d’admission : ${feedbackCapacity.dailyAdmissions} nouveaux envois par jour UTC. Un sujet et son historique de décisions survivent à l’expiration du message brut.</p>
   <div class="admin-tabs" role="tablist" aria-label="Pilotage des retours"><button class="admin-tab ${section==='feedback'?'active':''}" data-admin-tab="feedback" role="tab" aria-selected="${section==='feedback'}">Retours</button><button class="admin-tab ${section==='topics'?'active':''}" data-admin-tab="topics" role="tab" aria-selected="${section==='topics'}">Sujets & décisions</button></div>
   <p role="status" id="admin-operation">${esc(state.error)}</p><div id="admin-panel" aria-busy="${state.busy}"></div></section>`;
  root.querySelector('#admin-refresh').onclick=()=>void client.refresh();
  root.querySelector('#admin-logout').onclick=()=>{filters={query:'',project:'',status:''};topicFilters={query:'',project:'',state:''};composer=null;void client.logout();};
  root.querySelectorAll('[data-admin-tab]').forEach(button=>button.onclick=()=>{section=button.dataset.adminTab;composer=null;renderPanel(state);});
  renderPanel(state);
 }
 function renderPanel(state) {
  if(section==='topics')drawTopics(state);else drawFeedback(state);
  root.querySelectorAll('[data-admin-tab]').forEach(button=>{
   const active=button.dataset.adminTab===section;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));
  });
 }
 function composerMarkup() {
  if(!composer)return '';
  const feedback=composer.feedbackId?client.snapshot().rows.find(r=>r.request_id===composer.feedbackId):null;
  const fixedProject=Boolean(feedback);
  return `<form class="admin-composer" id="admin-topic-create"><div class="admin-composer-head"><div><span class="eyebrow">NOUVEAU SUJET</span><h2>${feedback?'À partir de ce retour':'Sujet indépendant'}</h2></div><button class="text-link" type="button" id="admin-composer-close">Fermer</button></div>
   ${feedback?`<p class="admin-source">Source : ${esc(feedback.summary)}</p>`:`<label class="field">Projet<select name="project" required><option value="">Choisir un projet</option>${projectOptions(composer.project||'')}</select></label>`}
   ${fixedProject?`<input type="hidden" name="project" value="${esc(composer.project)}">`:''}
   <div class="admin-form-grid"><label class="field">Type<select name="type">${selectOptions(topicTypes,composer.type)}</select></label><label class="field">Impact<select name="impact">${selectOptions(levels,composer.impact)}</select></label><label class="field">Effort<select name="effort">${selectOptions(levels,composer.effort)}</select></label></div>
   <label class="field">Titre<input name="title" required minlength="3" maxlength="120" value="${esc(composer.title||'')}"></label>
   <label class="field">Synthèse utile<textarea name="synthesis" maxlength="3000" rows="4" placeholder="Le problème, le besoin ou l’opportunité à retenir. Inutile de recopier le message brut.">${esc(composer.synthesis||'')}</textarea></label>
   <p class="muted">La synthèse doit rester exploitable même après suppression du retour brut. Évite d’y recopier un pseudo ou une information personnelle qui n’aide pas la décision.</p>
   <button class="button primary" ${client.snapshot().busy?'disabled':''}>Créer le sujet</button></form>`;
 }
 function wireComposer(state) {
  const form=root.querySelector('#admin-topic-create');if(!form)return;
  root.querySelector('#admin-composer-close').onclick=()=>{composer=null;renderPanel(state);};
  form.onsubmit=event=>{
   event.preventDefault();const data=new FormData(form);
   const payload={feedbackId:composer.feedbackId||null,project:String(data.get('project')||''),type:String(data.get('type')||''),title:String(data.get('title')||''),synthesis:String(data.get('synthesis')||''),impact:String(data.get('impact')||''),effort:String(data.get('effort')||'')};
   composer=null;void client.createTopic(payload);
  };
 }
 function redrawSearch(state,draw,id,filtersState,event) {
  filtersState.query=event.target.value;
  const start=event.target.selectionStart,end=event.target.selectionEnd;
  draw(state);
  const next=root.querySelector('#'+id);
  if(!next)return;
  next.focus({preventScroll:true});
  if(start!==null&&end!==null)next.setSelectionRange(start,end);
 }
 function drawFeedback(state) {
  const panel=root.querySelector('#admin-panel');if(!panel)return;
  const rows=filterFeedback(state.rows,filters);
  panel.innerHTML=`${composerMarkup()}<div class="admin-filters"><label class="field">Rechercher<input id="admin-query" type="search" placeholder="Titre, message ou pseudo" value="${esc(filters.query)}"></label>
   <label class="field">Projet<select id="admin-project"><option value="">Tous les projets</option>${projectOptions(filters.project)}</select></label>
   <label class="field">Statut<select id="admin-status"><option value="">Tous les statuts</option>${selectOptions(statuses,filters.status)}</select></label></div>
   <p class="admin-result">${state.phase==='loading'?'Chargement des retours…':state.rows.length===0?'Aucun retour reçu pour le moment.':rows.length===0?'Aucun retour ne correspond à ces filtres.':rows.length+' retour(s) affiché(s) sur '+state.rows.length+'.'}</p>
   <div id="admin-list">${rows.map(r=>feedbackCard(r,state)).join('')}</div>`;
  panel.querySelector('#admin-query').addEventListener('input',event=>redrawSearch(state,drawFeedback,'admin-query',filters,event));
  panel.querySelector('#admin-project').addEventListener('change',event=>{filters.project=event.target.value;drawFeedback(state);});
  panel.querySelector('#admin-status').addEventListener('change',event=>{filters.status=event.target.value;drawFeedback(state);});
  panel.querySelectorAll('[data-status-id]').forEach(select=>select.onchange=()=>void client.updateStatus(select.dataset.statusId,select.value));
  panel.querySelectorAll('[data-topic-from-feedback]').forEach(button=>button.onclick=()=>{
   const feedback=state.rows.find(r=>r.request_id===button.dataset.topicFromFeedback);if(!feedback)return;
   composer={feedbackId:feedback.request_id,project:feedback.project,type:kindToTopic[feedback.kind]||'signal',title:feedback.summary,synthesis:'',impact:'medium',effort:'medium'};drawFeedback(state);
  });
  panel.querySelectorAll('[data-attach-feedback]').forEach(select=>select.onchange=()=>{if(select.value)void client.attachFeedback(select.value,select.dataset.attachFeedback);});
  panel.querySelectorAll('[data-delete-feedback]').forEach(button=>button.onclick=()=>{
   const feedback=state.rows.find(r=>r.request_id===button.dataset.deleteFeedback);if(!feedback)return;
   const linked=state.links.filter(l=>l.feedback_id===feedback.request_id).length;
   const consequence=linked?' Il sera aussi détaché des sujets auxquels il est lié, sans supprimer ces sujets.':'';
   if(window.confirm(`Supprimer définitivement le retour « ${feedback.summary} » ?${consequence}`))void client.deleteFeedback(feedback.request_id);
  });
  wireComposer(state);
 }
 function feedbackCard(r,state) {
  const linked=state.links.filter(l=>l.feedback_id===r.request_id).map(l=>state.topics.find(t=>t.id===l.topic_id)).filter(Boolean);
  const available=state.topics.filter(t=>t.project===r.project&&!linked.some(item=>item.id===t.id));
  return `<article class="admin-message"><div class="admin-message-meta"><span>${esc(names.get(r.project)||r.project)} · ${esc({idea:'Idée',bug:'Problème',opinion:'Avis'}[r.kind]||r.kind)}</span><time>${esc(new Date(r.created_at).toLocaleString('fr-FR'))}</time></div>
   <h2>${esc(r.summary)}</h2><p class="admin-message-body">${esc(r.message)}</p>${r.nickname?`<p class="muted">Pseudo : ${esc(r.nickname)}</p>`:''}
   ${linked.length?`<div class="admin-linked"><span class="eyebrow">RATTACHÉ À</span>${linked.map(t=>`<span class="admin-chip">${esc(t.title)}</span>`).join('')}</div>`:''}
   <div class="admin-message-actions"><label class="field">Statut du retour<select data-status-id="${esc(r.request_id)}" ${state.busy?'disabled':''}>${selectOptions(statuses,r.status)}</select></label>
   <button class="button secondary" type="button" data-topic-from-feedback="${esc(r.request_id)}" ${state.busy?'disabled':''}>Créer un sujet</button>
   ${available.length?`<label class="field">Rattacher à un sujet<select data-attach-feedback="${esc(r.request_id)}" ${state.busy?'disabled':''}><option value="">Choisir…</option>${available.map(t=>`<option value="${esc(t.id)}">${esc(t.title)}</option>`).join('')}</select></label>`:''}
   <button class="button secondary" type="button" data-delete-feedback="${esc(r.request_id)}" ${state.busy?'disabled':''}>Supprimer</button></div></article>`;
 }
 function drawTopics(state) {
  const panel=root.querySelector('#admin-panel');if(!panel)return;
  const topics=filterTopics(state.topics,topicFilters), wip=state.topics.filter(t=>t.state==='in_progress').length;
  panel.innerHTML=`${composerMarkup()}<div class="admin-topic-toolbar"><div><strong>${wip}/3 en cours</strong><p class="muted">La base bloque automatiquement un quatrième sujet en cours.</p></div><button class="button secondary" id="admin-new-topic" ${state.busy?'disabled':''}>Nouveau sujet</button></div>
   <div class="admin-filters"><label class="field">Rechercher<input id="topic-query" type="search" placeholder="Titre ou synthèse" value="${esc(topicFilters.query)}"></label>
   <label class="field">Projet<select id="topic-project"><option value="">Tous les projets</option>${projectOptions(topicFilters.project)}</select></label>
   <label class="field">État<select id="topic-state"><option value="">Tous les états</option>${selectOptions(topicStates,topicFilters.state)}</select></label></div>
   <p class="admin-result">${state.topics.length===0?'Aucun sujet structuré pour le moment.':topics.length===0?'Aucun sujet ne correspond à ces filtres.':topics.length+' sujet(s) affiché(s) sur '+state.topics.length+'.'}</p>
   <div id="admin-topic-list">${topics.map(t=>topicCard(t,state)).join('')}</div>`;
  panel.querySelector('#admin-new-topic').onclick=()=>{composer={feedbackId:null,project:'',type:'signal',title:'',synthesis:'',impact:'medium',effort:'medium'};drawTopics(state);};
  panel.querySelector('#topic-query').addEventListener('input',event=>redrawSearch(state,drawTopics,'topic-query',topicFilters,event));
  panel.querySelector('#topic-project').addEventListener('change',event=>{topicFilters.project=event.target.value;drawTopics(state);});
  panel.querySelector('#topic-state').addEventListener('change',event=>{topicFilters.state=event.target.value;drawTopics(state);});
  panel.querySelectorAll('[data-topic-edit]').forEach(form=>form.onsubmit=event=>{
   event.preventDefault();const data=new FormData(form);void client.updateTopic(form.dataset.topicEdit,{type:String(data.get('type')),title:String(data.get('title')),synthesis:String(data.get('synthesis')),impact:String(data.get('impact')),effort:String(data.get('effort'))});
  });
  panel.querySelectorAll('[data-topic-decision]').forEach(form=>form.onsubmit=event=>{
   event.preventDefault();const data=new FormData(form), topic=state.topics.find(t=>t.id===form.dataset.topicDecision), next=String(data.get('state')), rationale=String(data.get('rationale')).trim();
   if(!topic||next===topic.state){root.querySelector('#admin-operation').textContent='Choisis un nouvel état pour enregistrer une décision.';return;}
   if(rationale.length<3){root.querySelector('#admin-operation').textContent='Explique brièvement la décision.';return;}
   void client.updateTopic(topic.id,{state:next,decision_rationale:rationale});
  });
  panel.querySelectorAll('[data-unlink-topic]').forEach(button=>button.onclick=()=>void client.detachFeedback(button.dataset.unlinkTopic,button.dataset.feedbackId));
  wireComposer(state);
 }
 function topicCard(topic,state) {
  const links=state.links.filter(l=>l.topic_id===topic.id), feedback=links.map(l=>state.rows.find(r=>r.request_id===l.feedback_id)).filter(Boolean), decisions=state.decisions.filter(d=>d.topic_id===topic.id);
  return `<article class="admin-topic"><div class="admin-message-meta"><span>${esc(names.get(topic.project)||topic.project)} · ${esc(topicTypes[topic.type]||topic.type)}</span><time>Mis à jour ${esc(new Date(topic.updated_at).toLocaleString('fr-FR'))}</time></div>
   <div class="admin-topic-heading"><div><span class="admin-state state-${esc(topic.state)}">${esc(topicStates[topic.state]||topic.state)}</span><h2>${esc(topic.title)}</h2></div><div class="admin-score"><span>Impact <strong>${esc(levels[topic.impact]||topic.impact)}</strong></span><span>Effort <strong>${esc(levels[topic.effort]||topic.effort)}</strong></span></div></div>
   <p class="admin-topic-synthesis">${topic.synthesis?esc(topic.synthesis):'<span class="muted">Synthèse à compléter.</span>'}</p>
   <div class="admin-linked"><span class="eyebrow">RETOURS LIÉS · ${links.length}</span>${feedback.length?feedback.map(r=>`<span class="admin-link-row"><span>${esc(r.summary)}</span><button class="text-link" data-unlink-topic="${esc(topic.id)}" data-feedback-id="${esc(r.request_id)}" ${state.busy?'disabled':''}>Détacher</button></span>`).join(''):'<span class="muted">Les sources brutes peuvent avoir expiré. La synthèse du sujet reste conservée.</span>'}</div>
   <details class="admin-topic-section"><summary>Modifier la synthèse</summary><form data-topic-edit="${esc(topic.id)}"><div class="admin-form-grid"><label class="field">Type<select name="type">${selectOptions(topicTypes,topic.type)}</select></label><label class="field">Impact<select name="impact">${selectOptions(levels,topic.impact)}</select></label><label class="field">Effort<select name="effort">${selectOptions(levels,topic.effort)}</select></label></div><label class="field">Titre<input name="title" required minlength="3" maxlength="120" value="${esc(topic.title)}"></label><label class="field">Synthèse<textarea name="synthesis" maxlength="3000" rows="4">${esc(topic.synthesis)}</textarea></label><button class="button secondary" ${state.busy?'disabled':''}>Enregistrer la synthèse</button></form></details>
   <details class="admin-topic-section"><summary>Prendre une décision</summary><form data-topic-decision="${esc(topic.id)}"><label class="field">Nouvel état<select name="state">${selectOptions(topicStates,topic.state)}</select></label><label class="field">Pourquoi ?<textarea name="rationale" required minlength="3" maxlength="2000" rows="3" placeholder="La raison de cette décision, assez claire pour être comprise plus tard."></textarea></label><button class="button primary" ${state.busy?'disabled':''}>Enregistrer la décision</button></form></details>
   ${decisions.length?`<details class="admin-topic-section"><summary>Historique des décisions · ${decisions.length}</summary><ol class="admin-decisions">${decisions.map(d=>`<li><div><strong>${esc(topicStates[d.state]||d.state)}</strong><time>${esc(new Date(d.created_at).toLocaleString('fr-FR'))}</time></div><p>${esc(d.rationale)}</p></li>`).join('')}</ol></details>`:''}</article>`;
 }
 render(client.snapshot());
 return ()=>{disposed=true;filters={query:'',project:'',status:''};topicFilters={query:'',project:'',state:''};composer=null;void client.logout();root.replaceChildren();};
}
