const main = document.querySelector('#main');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

const caseStudy = {
  kicker: 'ÉTUDE DE CAS · 4 GÉNÉRATIONS · USAGE RÉEL',
  headline: 'Automatiser ce qui coupe le RP, sans automatiser le RP lui-même.',
  narrative: 'Cet écosystème ne raconte pas quatre dépôts isolés. Il raconte plusieurs années de la même obsession : enlever aux joueurs et aux responsables les tâches de gestion qui les sortent de leur personnage, tout en gardant les décisions importantes entre des mains humaines. Le support change : bot Discord, application web par QR code ou poste de contrôle local. Le problème reste le même.',
  metrics: [
    ['4', 'générations d’outils'],
    ['≈ 40', 'utilisateurs sur HotzDoggz'],
    ['≈ 15 j', 'd’auto-hébergement réel'],
    ['165', 'tests verts sur HotzDoggz audité'],
  ],
  principles: [
    ['Rester dans les habitudes des joueurs', 'Discord quand l’activité vit déjà dans Discord, un QR code quand une interaction de quelques secondes suffit, une application locale quand il vaut mieux que les participants ne quittent jamais le jeu.'],
    ['Automatiser le répétitif, pas la décision', 'Le logiciel collecte, calcule, vérifie, trace et prépare. La direction valide une vente, l’organisateur arbitre un signal anti-triche, le jury décide d’une note.'],
    ['Faire de la donnée une preuve, pas un décor', 'Transactions, historiques, sauvegardes, preuves de vente, écritures financières et exports servent à pouvoir expliquer après coup ce qui s’est passé, au lieu de seulement afficher un joli tableau.'],
  ],
  stages: [
    {
      id: 'saloon',
      number: '01',
      title: 'Saloon',
      subtitle: 'Le prototype · Red Dead RP · Python / Discord',
      lead: 'Le point de départ : transformer un serveur Discord déjà utilisé par l’entreprise RP en outil de caisse, de stock et de comptabilité.',
      capabilities: [
        'Vendre depuis Discord en choisissant catégorie, produit et quantité, puis générer un ticket.',
        'Mettre à jour automatiquement les stocks après chaque transaction.',
        'Actualiser les informations financières et les tableaux dans les salons dédiés.',
        'Centraliser commissions, salaires et suivi de l’activité au lieu de recalculer tout à la main.',
      ],
      flow: ['Employé', 'Interaction Discord', 'Bot Python', 'Stock + ventes', 'Tableaux comptables'],
      proofLabel: 'CE QUE CETTE VERSION A PROUVÉ',
      proof: 'Le besoin n’était pas théorique : l’outil a réellement servi. Saloon a montré qu’une interface métier pouvait se greffer directement sur l’endroit où les joueurs travaillaient déjà. Il a aussi révélé les limites d’une première architecture artisanale : permissions incomplètes, état partagé fragile et peu de transactions métier.',
      tech: ['Python', 'discord.py', 'base locale / SQL', 'messages Discord persistants'],
    },
    {
      id: 'hotzdoggz',
      number: '02',
      title: 'HotzDoggz',
      subtitle: 'La pièce maîtresse · GTA RP · TypeScript / PostgreSQL',
      lead: 'La même idée, mais passée à l’échelle d’une vraie entreprise RP : Discord devient l’interface ; PostgreSQL devient la source de vérité.',
      capabilities: [
        'Déclaration assistée des ventes et ingestion automatique des posts employés.',
        'Idempotence par vente, copie durable des preuves et empreintes SHA-256.',
        'Workflow direction : prise en charge, complément, validation, refus, correction et historique des statuts.',
        'Journal financier, comptabilité hebdomadaire, clôtures, paies, avances et protection contre le double paiement.',
        'Commandes clients, ventes directes, produits, partenaires, stocks, lots périssables, garage, événements et planning.',
        'Dashboards persistants, classements, badges, rôles de prestige, palmarès, notifications et exports.',
      ],
      flow: ['Vente employé', 'Ingestion + preuves', 'Contrôle direction', 'PostgreSQL', 'Compta + paie + dashboards'],
      facts: [
        ['≈ 40 personnes', 'ont réellement utilisé le système pendant sa période d’exploitation.'],
        ['≈ 15 jours', 'd’auto-hébergement sur le PC, y compris pendant les heures de travail.'],
        ['165 tests verts', 'dans l’état audité fin juin, avec lint, build et migrations sur base vierge.'],
        ['≈ 8 M$ RP / semaine', 'ordre de grandeur documenté du CA entreprise ayant servi à recalibrer les badges.'],
      ],
      proofLabel: 'LA PROUESSE DERRIÈRE LE « BOT »',
      proof: 'HotzDoggz n’est plus un bot qui additionne des ventes. C’est un système transactionnel piloté depuis Discord : les événements peuvent arriver deux fois, deux responsables peuvent cliquer en même temps, le bot peut redémarrer, une vente peut être corrigée, une paie ne doit jamais partir deux fois. Une grande partie du travail consiste précisément à rendre ces cas prévisibles, traçables et récupérables.',
      tech: ['TypeScript / Node.js', 'discord.js', 'PostgreSQL + Prisma', 'Docker', 'Vitest + CI', 'journal d’audit'],
    },
    {
      id: 'zeprasso',
      number: '03',
      title: 'ZepRasso',
      subtitle: 'Le participant entre dans la boucle · React / Express',
      lead: 'Pour un événement, l’interface ne doit durer que quelques secondes : scanner, voter, revenir au RP.',
      capabilities: [
        'Accès par QR code sur le Wi-Fi local ou via un tunnel public temporaire.',
        'Vote sur cinq critères, classement et fermeture des votes par l’organisateur.',
        'Événements, véhicules, paiements, loteries, courses chronométrées, paris et exports.',
        'Détection anti-triche par appareil et IP, présentée comme signal et non comme preuve absolue.',
        'Écritures JSON atomiques, sauvegardes automatiques, restauration après corruption et export manuel.',
      ],
      flow: ['QR / lien', 'Téléphone du joueur', 'React', 'Express', 'JSON + backups', 'Classement / admin'],
      proofLabel: 'LE CHANGEMENT DE PRODUIT',
      proof: 'Ici, la sophistication n’est pas de demander plus au participant mais moins. Le PC de l’organisateur héberge tout ; le visiteur ne fait qu’une interaction courte. L’outil peut même être partagé à distance sans serveur permanent grâce à un tunnel, tout en gardant les données sur la machine de l’organisateur.',
      tech: ['React + TypeScript', 'Vite', 'Express', 'JSON local', 'QR / LAN', 'Cloudflare Tunnel'],
    },
    {
      id: 'zepevents',
      number: '04',
      title: 'Zepevents',
      subtitle: 'Le poste de contrôle · Python / interface locale',
      lead: 'Et si demander aux participants d’ouvrir un site était déjà trop ? La complexité se déplace alors entièrement du côté de l’organisateur.',
      capabilities: [
        'Inscriptions, véhicules, paiements complets ou partiels et caisse réellement encaissée.',
        'Concours public, jury ou hybride, classement, disqualification et calcul du podium.',
        'Loterie avec prix conseillé, plafond de tickets, probabilités en direct et ventes ouvrables / fermables.',
        'Tirages reproductibles par seed, re-tirage, exclusion, gagnant forcé et historique auditable.',
        'Exports CSV, Discord, gagnants et caisse depuis une interface graphique ou un CLI complet.',
      ],
      flow: ['Organisateur', 'GUI / CLI', 'Moteur métier', 'JSON local', 'Résultats + caisse + exports'],
      proofLabel: 'UN AUTRE COMPROMIS',
      proof: 'Zepevents n’est pas présenté comme le successeur obligatoire de ZepRasso. C’est une autre réponse au même problème : si un site externe gêne l’immersion ou l’acceptation du serveur, les joueurs restent entièrement en jeu et l’organisateur utilise seul un poste de contrôle local.',
      tech: ['Python 3.13+', 'CustomTkinter', 'CLI', 'dataclasses', 'pytest', 'Ruff'],
    },
  ],
  strengths: [
    ['Human-in-the-loop', 'Le logiciel automatise le calcul et la logistique, mais les validations métier importantes restent explicites.'],
    ['Traçabilité', 'Preuves, historiques, journaux financiers, exports et tirages reproductibles permettent de reconstruire une décision.'],
    ['Résilience', 'Idempotence, contraintes d’unicité, réconciliation au redémarrage, sauvegardes et restauration répondent aux problèmes du monde réel.'],
    ['Interfaces contextuelles', 'Discord, mobile par QR code ou application locale : l’interface change en fonction du coût qu’elle impose au RP.'],
    ['Infrastructure proportionnée', 'Pas de cloud obligatoire partout : l’architecture reste aussi légère que le contexte le permet.'],
    ['Évolution par le terrain', 'Les choix ne viennent pas seulement d’un cahier des charges : HotzDoggz a notamment été recalibré avec des ordres de grandeur observés pendant son exploitation.'],
  ],
  demo: {
    title: 'Pourquoi il n’y a pas encore de bouton « Essayer »',
    body: 'Une démo crédible doit montrer le fonctionnement sans exposer un vrai serveur Discord ni donner l’illusion d’un service public prêt à héberger. HotzDoggz dépend de Discord et PostgreSQL ; Saloon reste une origine historique. ZepRasso est aujourd’hui le meilleur candidat pour une future démo fictive autonome, après durcissement de son accès admin et de ses écritures publiques. Zepevents pourra être montré plus tard avec son interface locale réelle.',
  },
  status: 'Cette étude de cas est volontairement plus importante qu’une simple fiche de dépôt. Saloon a réellement servi ; HotzDoggz a été exploité en conditions réelles puis considérablement enrichi ; ZepRasso et Zepevents explorent deux compromis événementiels différents. Les captures réelles seront ajoutées lorsque les applications pourront être relancées sur une machine adaptée. Aucun faux screenshot ne sera fabriqué entre-temps.',
};

function chips(items) {
  return `<div class="rp-tech-chips">${items.map(item => `<span>${esc(item)}</span>`).join('')}</div>`;
}

function flow(items) {
  return `<div class="rp-flow" aria-label="Flux de fonctionnement">${items.map((item, index) => `${index ? '<span class="rp-flow-arrow" aria-hidden="true">→</span>' : ''}<span class="rp-flow-node">${esc(item)}</span>`).join('')}</div>`;
}

function stageMarkup(stage) {
  const facts = stage.facts?.length ? `<div class="rp-facts">${stage.facts.map(([value, label]) => `<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div>` : '';
  return `<li class="rp-stage rp-stage-${esc(stage.id)}"><span class="timeline-index">${esc(stage.number)}</span><article><div class="rp-stage-head"><div><span class="eyebrow">${esc(stage.subtitle)}</span><h3>${esc(stage.title)}</h3></div></div><p class="rp-stage-lead">${esc(stage.lead)}</p><div class="rp-stage-grid"><section><span class="eyebrow">CE QUE L’OUTIL FAIT</span><ul class="rp-capabilities">${stage.capabilities.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section><section><span class="eyebrow">COMMENT ÇA CIRCULE</span>${flow(stage.flow)}${chips(stage.tech)}</section></div>${facts}<section class="rp-proof"><span class="eyebrow">${esc(stage.proofLabel)}</span><p>${esc(stage.proof)}</p></section></article></li>`;
}

function render() {
  if (!/^#\/projet\/ecosysteme-rp(?:[/?]|$)/.test(location.hash || '')) return;
  const host = main?.querySelector('[data-rich-project-page]');
  if (!host || host.dataset.rpCaseStudy === 'true') return;
  host.dataset.rpCaseStudy = 'true';
  host.classList.add('rp-case-study');
  host.innerHTML = `<header class="rich-project-heading rp-hero"><span class="eyebrow">${esc(caseStudy.kicker)}</span><h2>${esc(caseStudy.headline)}</h2><p>${esc(caseStudy.narrative)}</p></header><div class="rp-metrics">${caseStudy.metrics.map(([value,label]) => `<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div><section class="rp-manifesto"><span class="eyebrow">LE FIL ROUGE</span><h3>Le logiciel doit soutenir le RP, pas devenir l’activité principale.</h3><div>${caseStudy.principles.map(([title,body]) => `<article><h4>${esc(title)}</h4><p>${esc(body)}</p></article>`).join('')}</div></section><ol class="project-timeline rp-timeline">${caseStudy.stages.map(stageMarkup).join('')}</ol><section class="rp-strengths"><span class="eyebrow">CE QUI REND L’ÉCOSYSTÈME PUISSANT</span><h3>La prouesse n’est pas un algorithme isolé. C’est la fiabilité opérationnelle.</h3><div class="rp-strength-grid">${caseStudy.strengths.map(([title,body]) => `<article><h4>${esc(title)}</h4><p>${esc(body)}</p></article>`).join('')}</div></section><section class="rp-demo"><span class="eyebrow">DÉMONSTRATION</span><h3>${esc(caseStudy.demo.title)}</h3><p>${esc(caseStudy.demo.body)}</p></section><section class="rich-status"><span class="eyebrow">ÉTAT DE L’ÉTUDE DE CAS</span><p>${esc(caseStudy.status)}</p></section>`;
}

const observer = new MutationObserver(render);
if (main) observer.observe(main, {childList:true, subtree:true});
window.addEventListener('hashchange', () => queueMicrotask(render));
render();
