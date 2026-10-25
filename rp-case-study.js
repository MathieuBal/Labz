const main = document.querySelector('#main');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

const caseStudy = {
  kicker: 'ÉTUDE DE CAS · 4 OUTILS · 5 ÉTAPES · USAGE RÉEL',
  headline: 'Automatiser ce qui coupe le RP, sans automatiser le RP lui-même.',
  narrative: 'Ces quatre outils racontent deux périodes de mon parcours. J’ai d’abord construit Saloon puis, plusieurs années plus tard, HotzDoggz pour éviter que la gestion d’une entreprise RP prenne le dessus sur le jeu. Ensuite, avec ZepRasso et Zepevents, j’ai exploré deux façons d’organiser des événements GTA RP : une plateforme web participative et un poste de contrôle local.',
  metrics: [
    ['4', 'outils distincts'],
    ['≈ 40', 'utilisateurs sur HotzDoggz'],
    ['≈ 15 j', 'd’auto-hébergement réel'],
    ['165', 'tests verts sur HotzDoggz audité'],
  ],
  principles: [
    ['Partir du problème, pas de la technologie', 'Je pars d’une situation vécue en RP : gérer une entreprise, suivre une caisse, organiser un concours ou éviter de transformer une soirée en séance Excel. La technologie vient ensuite.'],
    ['Automatiser le répétitif, pas la décision', 'Je laisse le logiciel collecter, calculer, vérifier, tracer et préparer. Les validations métier importantes restent humaines : direction, organisateur ou jury.'],
    ['Adapter l’interface au contexte', 'J’utilise Discord quand l’activité vit déjà dans Discord, le web mobile quand les joueurs peuvent intervenir quelques secondes, et une application locale quand il vaut mieux qu’ils ne quittent jamais le jeu.'],
  ],
  stages: [
    {
      id: 'saloon',
      number: '01',
      title: 'Saloon',
      subtitle: 'Première réponse · Red Dead RP · Python / Discord',
      lead: 'À l’époque, je cherche surtout à gérer un saloon RP sans passer la soirée dans des tableaux et des calculs manuels. Comme toute l’activité de l’entreprise passe déjà par Discord, j’en fais naturellement l’interface de travail.',
      capabilities: [
        'Vendre depuis Discord en choisissant catégorie, produit et quantité, puis générer un ticket.',
        'Mettre à jour automatiquement les stocks après chaque transaction.',
        'Actualiser les informations financières et les tableaux dans les salons dédiés.',
        'Centraliser commissions, salaires et suivi de l’activité au lieu de recalculer tout à la main.',
      ],
      flow: ['Employé', 'Interaction Discord', 'Bot Python', 'Stock + ventes', 'Tableaux comptables'],
      proofLabel: 'CE QUE CETTE PREMIÈRE EXPÉRIENCE M’A APPORTÉ',
      proof: 'Saloon a réellement servi. Je ne le regarde pas aujourd’hui comme une base de code moderne, mais comme la première fois où j’ai transformé un problème RP concret en outil métier : absorber la logistique directement là où les joueurs travaillent déjà.',
      tech: ['Python', 'discord.py', 'base locale / SQL', 'messages Discord persistants'],
    },
    {
      id: 'hotzdoggz',
      number: '02',
      title: 'HotzDoggz',
      subtitle: 'Plusieurs années plus tard · GTA RP · TypeScript / PostgreSQL',
      lead: 'Plusieurs années plus tard, Zep rachète une entreprise GTA RP et je deviens copatron. Je retrouve immédiatement les mêmes problèmes de ventes, stock, comptabilité et paie. Je repars donc de zéro pour construire HotzDoggz, avec plusieurs années d’expérience technique en plus.',
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
        ['≈ 15 jours', 'd’auto-hébergement sur mon PC, y compris pendant mes heures de travail.'],
        ['165 tests verts', 'dans l’état audité fin juin, avec lint, build et migrations sur base vierge.'],
        ['≈ 8 M$ RP / semaine', 'ordre de grandeur documenté du CA entreprise ayant servi à recalibrer les badges.'],
      ],
      proofLabel: 'CE QUE LES ANNÉES D’EXPÉRIENCE CHANGENT',
      proof: 'Je retrouve un besoin déjà connu, mais je le traite à un autre niveau. HotzDoggz n’est plus seulement un bot qui additionne des ventes : c’est un système transactionnel piloté depuis Discord, avec base de données, preuves, validations, audit, paies et protections contre les doublons ou les actions concurrentes.',
      tech: ['TypeScript / Node.js', 'discord.js', 'PostgreSQL + Prisma', 'Docker', 'Vitest + CI', 'journal d’audit'],
    },
    {
      id: 'zeprasso',
      number: '03',
      title: 'ZepRasso',
      subtitle: 'Plateforme web d’événements GTA RP · React / Express',
      lead: 'ZepRasso est une plateforme web locale que je conçois pour organiser des rassemblements et événements automobiles GTA RP. Depuis leur téléphone, les joueurs peuvent rejoindre un événement, inscrire leur véhicule et voter. De mon côté, une interface d’administration me permet de gérer participants, résultats, paiements et données de l’événement.',
      capabilities: [
        'Créer un événement automobile et gérer véhicules, participants et inscriptions.',
        'Permettre aux joueurs d’ouvrir l’événement par lien ou QR code, puis de voter sur plusieurs critères.',
        'Piloter résultats, paiements et administration depuis une interface organisateur séparée.',
        'Conserver les données localement avec écritures JSON atomiques et sauvegardes automatiques.',
      ],
      flow: ['Événement GTA RP', 'Lien ou QR', 'Téléphone du joueur', 'Web React', 'Serveur local', 'Administration'],
      proofLabel: 'POURQUOI J’AI MIS CETTE PISTE EN PAUSE',
      proof: 'Le doute arrive côté serveur RP : demander aux joueurs d’ouvrir un site externe ou de scanner un QR code peut être mal perçu par l’administration, voire être considéré comme une pratique non autorisée. Avant d’investir encore plus dans cette direction, je préfère imaginer une version où les participants n’ont rien à ouvrir hors du jeu.',
      tech: ['React + TypeScript', 'Vite', 'Express', 'JSON local', 'QR / LAN', 'Cloudflare Tunnel'],
    },
    {
      id: 'zepevents',
      number: '04',
      title: 'Zepevents',
      subtitle: 'Application locale de gestion d’événements RP · Python',
      lead: 'Zepevents est le plan B que je développe pour gérer le même type d’événements sans demander aux joueurs d’utiliser un site. Tout se passe sur le poste de l’organisateur : inscriptions, véhicules, concours, paiements, caisse, loterie et résultats.',
      capabilities: [
        'Enregistrer participants, véhicules, paiements complets ou partiels et caisse réellement encaissée.',
        'Gérer un concours public, jury ou hybride avec classement, disqualification et podium.',
        'Préparer une loterie avec valeur estimée du lot, marge souhaitée, prix conseillé, seuil de rentabilité et objectif de tickets.',
        'Suivre probabilités, plafond par joueur, ouverture et fermeture des ventes et correction des tickets.',
        'Effectuer des tirages reproductibles par seed, re-tirage, exclusion, gagnant forcé, historique et exports.',
      ],
      flow: ['Organisateur', 'Application locale', 'Moteur métier', 'JSON local', 'Concours + loterie + caisse', 'Résultats + exports'],
      proofLabel: 'POURQUOI J’AI CRÉÉ CE PLAN B',
      proof: 'Zepevents n’est pas une seconde version de ZepRasso. Je le construis comme une solution de repli : si le web externe ou le QR code pose problème avec les règles du serveur, je peux toujours organiser l’événement depuis un poste local sans demander quoi que ce soit aux participants hors du jeu.',
      tech: ['Python 3.13+', 'CustomTkinter', 'CLI', 'dataclasses', 'pytest', 'Ruff'],
    },
    {
      id: 'zeprasso-retour',
      number: '05',
      title: 'Retour à ZepRasso',
      subtitle: 'La plateforme s’élargit · web participatif + contrôle organisateur',
      lead: 'Après les premiers essais, le blocage que je redoutais ne se produit pas et les joueurs accueillent plutôt bien le principe. Je reviens donc à ZepRasso et je l’élargis au-delà du simple vote automobile : événements multiples, loteries, courses, paris et suivi financier.',
      capabilities: [
        'Le QR code reste un moyen d’accès, pas une obligation : je peux aussi saisir et gérer les données manuellement côté organisateur.',
        'Gérer plusieurs événements avec véhicules, participants, votes, catégories et paiements.',
        'Suivre des loteries avec prix du ticket, coût réel du lot, statut payé, revenus, bénéfice et export pour course de billes.',
        'Gérer des courses chronométrées avec pilotes, frais d’entrée, paris, répartition des gains et part organisateur.',
        'Agrég­er concours, loteries, courses, redistributions, coûts et bénéfice net dans un récap financier global.',
        'Conserver un audit anti-triche, des sauvegardes, une restauration et une administration dédiée.',
      ],
      flow: ['Joueur ou organisateur', 'Web mobile / admin', 'Événements', 'Loteries + courses + paris', 'Calculs métier', 'Suivi financier'],
      proofLabel: 'POURQUOI JE REVIENS À ZEPRASSO',
      proof: 'ZepRasso finit par réunir les deux usages qui m’intéressent : faire participer directement les joueurs depuis leur téléphone quand cela apporte quelque chose au RP, et garder une gestion manuelle côté organisateur quand elle suffit. La loterie l’illustre bien : je peux ajouter quelqu’un moi-même, suivre son paiement, le coût réel du lot, les recettes et le bénéfice sans imposer de scan.',
      tech: ['React + TypeScript', 'Vite', 'Express', 'JSON local', 'mobile + admin', 'backups + audit'],
    },
  ],
  strengths: [
    ['Même problème, solutions différentes', 'Saloon et HotzDoggz montrent comment j’ai retrouvé plusieurs années plus tard un besoin métier très proche, sans simplement reprendre mon ancien code.'],
    ['Décision guidée par le terrain', 'ZepRasso, le détour par Zepevents puis mon retour au web montrent comment les règles du serveur et les réactions des joueurs ont réellement influencé mes choix.'],
    ['Traçabilité', 'Preuves, historiques, journaux financiers, exports et tirages reproductibles me permettent de reconstruire une décision plutôt que de seulement afficher un résultat.'],
    ['Résilience', 'Idempotence, contraintes d’unicité, réconciliation au redémarrage, sauvegardes et restauration répondent aux problèmes que ces outils peuvent rencontrer en usage réel.'],
    ['Interfaces contextuelles', 'Je change d’interface selon le coût imposé au RP : Discord, téléphone, QR code facultatif ou application locale côté organisateur.'],
    ['Économie exploitable', 'Je ne voulais pas seulement compter des participants : les outils préparent une rentabilité, suivent les paiements et montrent ce qui a réellement été encaissé, dépensé ou redistribué.'],
  ],
  demo: {
    title: 'Pourquoi il n’y a pas encore de bouton « Essayer »',
    body: 'Je préfère une démo crédible à une fausse vitrine. HotzDoggz dépend de Discord et PostgreSQL. ZepRasso reste le meilleur candidat pour une future démo autonome avec de fausses données, mais son accès administrateur et ses écritures publiques doivent d’abord être durcis. Zepevents pourra être montré avec son interface locale réelle. Réunir un jour certaines idées des deux projets reste une possibilité, pas un développement planifié aujourd’hui.',
  },
  status: 'Je présente ici deux histoires distinctes. Saloon et HotzDoggz partagent un besoin métier, mais plusieurs années et une forte montée en maturité technique les séparent. ZepRasso et Zepevents appartiennent au même cycle événementiel : plateforme web participative, détour local face au risque lié aux QR codes, puis retour vers ZepRasso après les premiers usages. J’ajouterai des captures réelles quand je pourrai relancer proprement les applications ; je ne fabriquerai pas de faux screenshots entre-temps.',
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
  host.innerHTML = `<header class="rich-project-heading rp-hero"><span class="eyebrow">${esc(caseStudy.kicker)}</span><h2>${esc(caseStudy.headline)}</h2><p>${esc(caseStudy.narrative)}</p></header><div class="rp-metrics">${caseStudy.metrics.map(([value,label]) => `<div><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div><section class="rp-manifesto"><span class="eyebrow">LE FIL ROUGE</span><h3>Le logiciel doit soutenir le RP, pas devenir l’activité principale.</h3><div>${caseStudy.principles.map(([title,body]) => `<article><h4>${esc(title)}</h4><p>${esc(body)}</p></article>`).join('')}</div></section><ol class="project-timeline rp-timeline">${caseStudy.stages.map(stageMarkup).join('')}</ol><section class="rp-strengths"><span class="eyebrow">CE QUE JE RETIENS DE CET ÉCOSYSTÈME</span><h3>La valeur vient surtout de la façon dont j’ai adapté les outils à des contraintes réelles.</h3><div class="rp-strength-grid">${caseStudy.strengths.map(([title,body]) => `<article><h4>${esc(title)}</h4><p>${esc(body)}</p></article>`).join('')}</div></section><section class="rp-demo"><span class="eyebrow">DÉMONSTRATION</span><h3>${esc(caseStudy.demo.title)}</h3><p>${esc(caseStudy.demo.body)}</p></section><section class="rich-status"><span class="eyebrow">ÉTAT DE L’ÉTUDE DE CAS</span><p>${esc(caseStudy.status)}</p></section>`;
}

const observer = new MutationObserver(render);
if (main) observer.observe(main, {childList:true, subtree:true});
window.addEventListener('hashchange', () => queueMicrotask(render));
render();
