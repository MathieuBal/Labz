const main = document.querySelector('#main');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

const caseStudy = {
  kicker: 'ÉTUDE DE CAS · 4 OUTILS · 5 ÉTAPES · USAGE RÉEL',
  headline: 'Automatiser ce qui coupe le RP, sans automatiser le RP lui-même.',
  narrative: 'Cette histoire ne suit pas une simple suite de versions. Saloon et HotzDoggz répondent au même problème à plusieurs années d’intervalle, avec un niveau d’expérience technique très différent. ZepRasso et Zepevents racontent ensuite un autre cycle : une idée web participative, un détour local pour éviter un risque côté serveur, puis un retour assumé vers ZepRasso après les premiers usages.',
  metrics: [
    ['4', 'outils distincts'],
    ['≈ 40', 'utilisateurs sur HotzDoggz'],
    ['≈ 15 j', 'd’auto-hébergement réel'],
    ['165', 'tests verts sur HotzDoggz audité'],
  ],
  principles: [
    ['Partir du problème, pas de la technologie', 'Le point commun n’est pas un framework. À chaque fois, le besoin vient d’une situation vécue en RP : gérer une entreprise, suivre une caisse, organiser un concours ou éviter de transformer une soirée en séance Excel.'],
    ['Automatiser le répétitif, pas la décision', 'Le logiciel collecte, calcule, vérifie, trace et prépare. La direction valide une vente, l’organisateur arbitre un signal anti-triche, le jury décide d’une note.'],
    ['Adapter l’interface au contexte', 'Discord quand l’activité vit déjà dans Discord, web mobile quand les joueurs peuvent intervenir quelques secondes, application locale quand il vaut mieux qu’ils ne quittent jamais le jeu.'],
  ],
  stages: [
    {
      id: 'saloon',
      number: '01',
      title: 'Saloon',
      subtitle: 'Première réponse · Red Dead RP · Python / Discord',
      lead: 'À l’époque, le problème est simple : gérer un saloon RP sans passer la soirée dans des tableaux et des calculs manuels. Discord devient alors l’interface de travail.',
      capabilities: [
        'Vendre depuis Discord en choisissant catégorie, produit et quantité, puis générer un ticket.',
        'Mettre à jour automatiquement les stocks après chaque transaction.',
        'Actualiser les informations financières et les tableaux dans les salons dédiés.',
        'Centraliser commissions, salaires et suivi de l’activité au lieu de recalculer tout à la main.',
      ],
      flow: ['Employé', 'Interaction Discord', 'Bot Python', 'Stock + ventes', 'Tableaux comptables'],
      proofLabel: 'CE QUE CETTE PREMIÈRE EXPÉRIENCE A APPORTÉ',
      proof: 'Saloon a réellement servi. Sa valeur aujourd’hui n’est pas d’être une base de code moderne, mais d’avoir posé une première méthode : quand la gestion prend trop de place dans le RP, un outil métier peut absorber une partie de la logistique directement là où les joueurs travaillent déjà.',
      tech: ['Python', 'discord.py', 'base locale / SQL', 'messages Discord persistants'],
    },
    {
      id: 'hotzdoggz',
      number: '02',
      title: 'HotzDoggz',
      subtitle: 'Plusieurs années plus tard · GTA RP · TypeScript / PostgreSQL',
      lead: 'Le même type de problème revient dans une autre vie RP. Zep rachète une entreprise, Mathieu devient copatron, et refaire un outil de gestion apparaît naturellement. Ce n’est pas une reprise du code Saloon : c’est une nouvelle construction avec plusieurs années d’expérience en plus.',
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
      proofLabel: 'CE QUE LES ANNÉES D’EXPÉRIENCE CHANGENT',
      proof: 'HotzDoggz reprend un besoin déjà connu, mais le traite à un autre niveau. Ce n’est plus seulement un bot qui additionne des ventes : c’est un système transactionnel piloté depuis Discord, avec base de données, preuves, validations, audit, paies et protections contre les doublons ou les actions concurrentes.',
      tech: ['TypeScript / Node.js', 'discord.js', 'PostgreSQL + Prisma', 'Docker', 'Vitest + CI', 'journal d’audit'],
    },
    {
      id: 'zeprasso',
      number: '03',
      title: 'ZepRasso',
      subtitle: 'Premier pari événementiel · React / Express · QR / mobile',
      lead: 'Pour les événements, l’idée change : cette fois les participants peuvent entrer eux-mêmes dans la boucle. Le web mobile et le QR code doivent rendre l’interaction courte, visible et un peu plus spectaculaire.',
      capabilities: [
        'Accès depuis un téléphone par lien ou QR code, sur réseau local ou via tunnel temporaire.',
        'Inscription de véhicules et vote multi-critères côté participant.',
        'Interface d’administration séparée pour piloter l’événement et les résultats.',
        'Persistance locale avec écritures JSON atomiques et sauvegardes automatiques.',
      ],
      flow: ['QR ou lien', 'Téléphone du joueur', 'React', 'Express', 'JSON local', 'Administration'],
      proofLabel: 'LE DOUTE QUI CHANGE LA DIRECTION',
      proof: 'Le problème n’est pas technique mais contextuel : sur un serveur RP, demander aux joueurs d’ouvrir un site externe peut être mal perçu par l’administration, voire être considéré comme une pratique non autorisée. Avant d’investir encore plus dans cette piste, une alternative sans site côté participant devient nécessaire.',
      tech: ['React + TypeScript', 'Vite', 'Express', 'JSON local', 'QR / LAN', 'Cloudflare Tunnel'],
    },
    {
      id: 'zepevents',
      number: '04',
      title: 'Zepevents',
      subtitle: 'Le plan B local · Python / CustomTkinter',
      lead: 'Zepevents naît comme réponse directe à ce risque : toute la complexité se déplace du côté de l’organisateur et les joueurs peuvent rester entièrement dans le jeu.',
      capabilities: [
        'Inscriptions, véhicules, paiements complets ou partiels et caisse réellement encaissée.',
        'Concours public, jury ou hybride, classement, disqualification et calcul du podium.',
        'Loterie avec valeur estimée du lot, marge souhaitée, prix conseillé, seuil de rentabilité et objectif de tickets.',
        'Probabilités en direct, plafond par joueur, ouverture et fermeture des ventes, correction des tickets.',
        'Tirages reproductibles par seed, re-tirage, exclusion, gagnant forcé, historique et exports.',
      ],
      flow: ['Organisateur', 'GUI / CLI', 'Moteur métier', 'JSON local', 'Résultats + caisse + exports'],
      proofLabel: 'POURQUOI CE PROJET EXISTE',
      proof: 'Zepevents n’est pas une seconde version de ZepRasso. C’est un contournement produit : si le QR code ou le site externe devient un problème avec les règles du serveur, l’événement reste organisable depuis un poste local, sans demander quoi que ce soit aux participants hors du jeu.',
      tech: ['Python 3.13+', 'CustomTkinter', 'CLI', 'dataclasses', 'pytest', 'Ruff'],
    },
    {
      id: 'zeprasso-retour',
      number: '05',
      title: 'Retour à ZepRasso',
      subtitle: 'Le choix assumé · Web participatif + contrôle organisateur',
      lead: 'Les premiers usages du QR code ne provoquent pas le blocage redouté. Les joueurs accueillent plutôt bien l’idée. ZepRasso redevient alors la plateforme principale et continue à s’élargir.',
      capabilities: [
        'Le QR code reste un moyen d’accès, pas une obligation : l’organisateur peut aussi saisir et gérer les données manuellement.',
        'Gestion de plusieurs événements avec véhicules, participants, votes, catégories et paiements.',
        'Loteries avec prix du ticket, coût réel du lot, statut payé, revenus, bénéfice et export pour course de billes.',
        'Courses chronométrées, pilotes, frais d’entrée, paris, répartition des gains et part organisateur.',
        'Récap financier global qui agrège concours, loteries, courses, redistributions, coûts et bénéfice net organisateur.',
        'Audit anti-triche, sauvegardes, restauration et administration dédiée.',
      ],
      flow: ['Joueur ou organisateur', 'Web mobile / admin', 'Express', 'Données événement', 'Calculs métier', 'Suivi financier'],
      proofLabel: 'CE QUI FAIT DE ZEPRASSO LE PROJET LE PLUS LARGE',
      proof: 'Le projet finit par réunir deux modes de fonctionnement : une participation directe depuis le téléphone quand elle apporte quelque chose au jeu, et une gestion manuelle côté organisateur quand elle suffit. La loterie l’illustre bien : un joueur n’a pas besoin de scanner quoi que ce soit pour être ajouté, tandis que l’organisateur garde le suivi des paiements, des recettes et du coût réel du lot.',
      tech: ['React + TypeScript', 'Vite', 'Express', 'JSON local', 'mobile + admin', 'backups + audit'],
    },
  ],
  strengths: [
    ['Même problème, solutions différentes', 'Saloon et HotzDoggz montrent comment un besoin de gestion réapparaît à plusieurs années d’intervalle, sans que le second soit une simple version du premier.'],
    ['Décision guidée par le terrain', 'ZepRasso, Zepevents puis le retour vers ZepRasso montrent un arbitrage réel entre ambition produit, règles du serveur et réaction des joueurs.'],
    ['Traçabilité', 'Preuves, historiques, journaux financiers, exports et tirages reproductibles permettent de reconstruire une décision.'],
    ['Résilience', 'Idempotence, contraintes d’unicité, réconciliation au redémarrage, sauvegardes et restauration répondent aux problèmes du monde réel.'],
    ['Interfaces contextuelles', 'Discord, mobile par QR code ou application locale : l’interface change en fonction du coût qu’elle impose au RP.'],
    ['Économie exploitable', 'Les outils ne se contentent pas d’afficher des participants : ils aident à préparer une rentabilité, suivre des paiements et mesurer ce qui a réellement été encaissé ou redistribué.'],
  ],
  demo: {
    title: 'Pourquoi il n’y a pas encore de bouton « Essayer »',
    body: 'Une démo crédible doit montrer le fonctionnement sans exposer un vrai serveur Discord ni donner l’illusion d’un service public prêt à héberger. ZepRasso reste le meilleur candidat pour une future démo fictive autonome, après durcissement de son accès admin et de ses écritures publiques. Zepevents pourra être montré plus tard avec son interface locale réelle. Une convergence fonctionnelle entre les deux est une piste possible, pas un développement planifié aujourd’hui.',
  },
  status: 'Cette étude de cas raconte désormais deux histoires distinctes. Saloon et HotzDoggz partagent un besoin métier mais sont séparés par plusieurs années et par une forte montée en maturité technique. ZepRasso et Zepevents appartiennent au même cycle événementiel : web participatif, détour local face au risque lié aux QR codes, puis retour vers ZepRasso après validation terrain. Les captures réelles seront ajoutées lorsque les applications pourront être relancées. Aucun faux screenshot ne sera fabriqué entre-temps.',
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
  host.innerHTML = `<header class="rich-project-heading rp-hero"><span class="eyebrow">${esc(caseStudy.kicker)}</span><h2>${esc(caseStudy.headline)}</h2><p>${esc(caseStudy.narrative)}</p></header><div class="rp-metrics">${caseStudy.metrics.map(([value,label]) => `<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div><section class="rp-manifesto"><span class="eyebrow">LE FIL ROUGE</span><h3>Le logiciel doit soutenir le RP, pas devenir l’activité principale.</h3><div>${caseStudy.principles.map(([title,body]) => `<article><h4>${esc(title)}</h4><p>${esc(body)}</p></article>`).join('')}</div></section><ol class="project-timeline rp-timeline">${caseStudy.stages.map(stageMarkup).join('')}</ol><section class="rp-strengths"><span class="eyebrow">CE QUI REND L’ÉCOSYSTÈME PUISSANT</span><h3>La prouesse vient de la façon dont les outils répondent à de vraies contraintes.</h3><div class="rp-strength-grid">${caseStudy.strengths.map(([title,body]) => `<article><h4>${esc(title)}</h4><p>${esc(body)}</p></article>`).join('')}</div></section><section class="rp-demo"><span class="eyebrow">DÉMONSTRATION</span><h3>${esc(caseStudy.demo.title)}</h3><p>${esc(caseStudy.demo.body)}</p></section><section class="rich-status"><span class="eyebrow">ÉTAT DE L’ÉTUDE DE CAS</span><p>${esc(caseStudy.status)}</p></section>`;
}

const observer = new MutationObserver(render);
if (main) observer.observe(main, {childList:true, subtree:true});
window.addEventListener('hashchange', () => queueMicrotask(render));
render();
