// Pool de dépêches d'actualités belges pour BelNews
window.BelNewsPool = [
  {
    id: "pol-1",
    title: "Le gouvernement fédéral entame de nouvelles négociations budgétaires",
    clickbaitTitle: "FAILLITE DE L'ÉTAT BELGE ? Les ministres s'écharpent en secret sur vos impôts !",
    summary: "Les partis de la coalition se réunissent au Château de Val Duchesse pour boucher un trou budgétaire de 2 milliards d'euros.",
    category: "Politique",
    reliability: 100,
    source: "Agence Belga",
    emoji: "🗳️",
    proximity: 100,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 150,
      credibility: 5,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 600,
      credibility: -15,
      ethics: -10
    }
  },
  {
    id: "fd-1",
    title: "Un cambriolage insolite signalé dans une friterie à Namur",
    clickbaitTitle: "SCANDALE DES FRITES : Il vole 50 kilos de graisse de bœuf et commet l'irréparable !",
    summary: "Un individu s'est introduit dans une friterie locale pour dérober uniquement des stocks de graisse végétale et de sauces.",
    category: "Faits Divers",
    reliability: 90,
    source: "La Meuse",
    emoji: "🍟",
    proximity: 85,
    exclusivity: true,
    timeRemaining: 1,
    impact: {
      subscribers: 250,
      credibility: 0,
      ethics: 5
    },
    clickbaitImpact: {
      subscribers: 850,
      credibility: -10,
      ethics: -5
    }
  },
  {
    id: "clim-1",
    title: "Inondations redoutées en Ardenne suite aux pluies continues",
    clickbaitTitle: "APOCALYPSE ROUGE : La Wallonie va-t-elle finir sous les eaux d'ici 24 heures ?",
    summary: "L'IRM émet une alerte jaune pour les provinces de Liège et de Luxembourg face à la crue rapide de l'Ourthe.",
    category: "Climat",
    reliability: 100,
    source: "IRM (Institut Royal Météorologique)",
    emoji: "🌧️",
    proximity: 95,
    exclusivity: false,
    timeRemaining: 1,
    impact: {
      subscribers: 200,
      credibility: 10,
      ethics: 15
    },
    clickbaitImpact: {
      subscribers: 900,
      credibility: -20,
      ethics: -10
    }
  },
  {
    id: "mon-1",
    title: "Le Roi Philippe visite une école technique à Courtrai",
    clickbaitTitle: "LE ROI RECADRÉ ! La gaffe impériale du souverain qui choque la Flandre !",
    summary: "Le souverain a visité les ateliers de robotique d'une école flamande et a félicité les élèves en français.",
    category: "Monarchie",
    reliability: 95,
    source: "RTL Info",
    emoji: "👑",
    proximity: 100,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 100,
      credibility: 5,
      ethics: 8
    },
    clickbaitImpact: {
      subscribers: 750,
      credibility: -25,
      ethics: -15
    }
  },
  {
    id: "fake-1",
    title: "Une rumeur prétend que le Manneken Pis va être habillé en habit de sponsor privé",
    clickbaitTitle: "PRIVATISATION DE MANNEKEN PIS : Coca-Cola achète le symbole de Bruxelles !",
    summary: "Un groupe de citoyens s'insurge contre un projet fictif d'habillage publicitaire de la célèbre fontaine.",
    category: "Faits Divers",
    reliability: 10,
    source: "Rumeur sur Facebook",
    emoji: "⛲",
    proximity: 90,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 400,
      credibility: -30,
      ethics: -20
    },
    clickbaitImpact: {
      subscribers: 1200,
      credibility: -60,
      ethics: -40
    }
  },
  {
    id: "san-1",
    title: "Campagne de vaccination préventive contre la grippe en pharmacie",
    clickbaitTitle: "PUCES DANS LES VACCINS ? Ce pharmacien belge brise le silence et balance tout !",
    summary: "Les pharmaciens de Belgique sont désormais autorisés à administrer directement le vaccin contre la grippe saisonnière.",
    category: "Santé",
    reliability: 100,
    source: "Ministère de la Santé",
    emoji: "💉",
    proximity: 100,
    exclusivity: false,
    timeRemaining: 3,
    impact: {
      subscribers: 80,
      credibility: 15,
      ethics: 20
    },
    clickbaitImpact: {
      subscribers: 1400,
      credibility: -80,
      ethics: -60
    }
  },
  {
    id: "sp-1",
    title: "Les Diables Rouges s'imposent face à l'Italie en Ligue des Nations",
    clickbaitTitle: "DIABLES DE FEU ! La raclée historique qui humilie les champions italiens !",
    summary: "L'équipe nationale de football a remporté son match 2-1 après une performance solide à Bruxelles.",
    category: "Sport",
    reliability: 100,
    source: "RTBF Sport",
    emoji: "⚽",
    proximity: 80,
    exclusivity: false,
    timeRemaining: 1,
    impact: {
      subscribers: 300,
      credibility: 2,
      ethics: 5
    },
    clickbaitImpact: {
      subscribers: 950,
      credibility: -5,
      ethics: -5
    }
  },
  {
    id: "eco-1",
    title: "Une hausse tarifaire annoncée sur les abonnements de train de la SNCB",
    clickbaitTitle: "SNCB : Le scandale des prix ! La hausse secrète pour financer les retards !",
    summary: "La SNCB annonce une indexation de ses tarifs de 3,2% à partir de février prochain face à l'inflation.",
    category: "Economie",
    reliability: 100,
    source: "SNCB Communiqué",
    emoji: "🚂",
    proximity: 95,
    exclusivity: false,
    timeRemaining: 3,
    impact: {
      subscribers: 180,
      credibility: 5,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 750,
      credibility: -15,
      ethics: -10
    }
  },
  {
    id: "fake-2",
    title: "Étude douteuse indiquant que boire de la bière belge protège des UV",
    clickbaitTitle: "C'EST PROUVÉ ! Boire 3 Triple Karmeliet par jour empêche les coups de soleil !",
    summary: "Une infographie partagée sur les réseaux affirme sans fondement scientifique que le houblon filtre les rayons solaires.",
    category: "Santé",
    reliability: 5,
    source: "Compte Tik Tok belge anonyme",
    emoji: "🍺",
    proximity: 85,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 350,
      credibility: -40,
      ethics: -30
    },
    clickbaitImpact: {
      subscribers: 1500,
      credibility: -90,
      ethics: -50
    }
  },
  {
    id: "int-1",
    title: "Nouveau sommet européen à Bruxelles sur l'accord commercial avec l'Amérique du Sud",
    clickbaitTitle: "BLOCUS DE BRUXELLES : Les tracteurs européens s'apprêtent à paralyser la capitale !",
    summary: "Les dirigeants européens se réunissent pour débattre du traité Mercosur sous haute surveillance policière.",
    category: "International",
    reliability: 100,
    source: "Le Soir",
    emoji: "🇪🇺",
    proximity: 70,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 120,
      credibility: 10,
      ethics: 12
    },
    clickbaitImpact: {
      subscribers: 680,
      credibility: -10,
      ethics: -5
    }
  },
  {
    id: "cult-1",
    title: "Le festival de Dour dévoile ses premiers noms pour l'édition prochaine",
    clickbaitTitle: "FESTIVAL DE DOUR : Drogues, décibels et programmation infernale déballées !",
    summary: "Les organisateurs annoncent les 15 premiers artistes hip-hop et techno du festival estival.",
    category: "Culture",
    reliability: 100,
    source: "Dour Festival Press",
    emoji: "🎵",
    proximity: 80,
    exclusivity: true,
    timeRemaining: 3,
    impact: {
      subscribers: 220,
      credibility: 2,
      ethics: 5
    },
    clickbaitImpact: {
      subscribers: 780,
      credibility: -8,
      ethics: -5
    }
  },
  {
    id: "tech-1",
    title: "L'application de paiement Payconiq subit une panne temporaire de 2 heures",
    clickbaitTitle: "CRASH BANCAIRE EN BELGIQUE ? Plus aucun moyen de payer votre pain !",
    summary: "Un problème de serveur DNS a rendu le service de paiement par QR code inaccessible en Belgique.",
    category: "Technologie",
    reliability: 95,
    source: "Payconiq Bancontact",
    emoji: "📱",
    proximity: 95,
    exclusivity: false,
    timeRemaining: 1,
    impact: {
      subscribers: 190,
      credibility: 5,
      ethics: 8
    },
    clickbaitImpact: {
      subscribers: 800,
      credibility: -20,
      ethics: -10
    }
  },
  {
    id: "pol-2",
    title: "Une commune belge décide de tester la semaine de 4 jours pour son personnel",
    clickbaitTitle: "FONCTIONNAIRES PAYÉS À NE RIEN FAIRE ? Cette commune belge qui ose tout !",
    summary: "La commune de Chaudfontaine lance une phase pilote de réduction du temps de travail sans perte salariale.",
    category: "Politique",
    reliability: 100,
    source: "Sudinfo",
    emoji: "⏰",
    proximity: 90,
    exclusivity: true,
    timeRemaining: 2,
    impact: {
      subscribers: 200,
      credibility: 5,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 750,
      credibility: -12,
      ethics: -10
    }
  },
  {
    id: "fd-2",
    title: "Un sanglier aperçu en plein centre-ville de Liège",
    clickbaitTitle: "BESTIAL ! Un monstre sauvage sème la terreur en plein cœur du Carré !",
    summary: "L'animal s'est égaré dans les rues commerçantes tôt le matin avant d'être pris en charge par les services forestiers.",
    category: "Faits Divers",
    reliability: 100,
    source: "RTL Info",
    emoji: "🐗",
    proximity: 85,
    exclusivity: false,
    timeRemaining: 1,
    impact: {
      subscribers: 240,
      credibility: 2,
      ethics: 5
    },
    clickbaitImpact: {
      subscribers: 890,
      credibility: -10,
      ethics: -5
    }
  },
  {
    id: "fake-3",
    title: "Fausse alerte à la contamination de l'eau du robinet à Mons",
    clickbaitTitle: "EAU EMPOISONNÉE À MONS : Ne buvez plus l'eau du robinet, danger mortel !",
    summary: "Un faux SMS circule prétendant qu'une bactérie toxique a été détectée dans le réseau de distribution montois.",
    category: "Santé",
    reliability: 1,
    source: "Réseaux sociaux",
    emoji: "🚰",
    proximity: 90,
    exclusivity: false,
    timeRemaining: 1,
    impact: {
      subscribers: 500,
      credibility: -60,
      ethics: -40
    },
    clickbaitImpact: {
      subscribers: 1800,
      credibility: -110,
      ethics: -70
    }
  },
  {
    id: "eco-2",
    title: "Le groupe Delhaize annonce d'excellents résultats pour ses magasins franchisés",
    clickbaitTitle: "EXPLOITATION OU SUCCÈS ? L'argent secret caché derrière la franchise Delhaize !",
    summary: "L'enseigne au lion affiche une hausse de 4% de son chiffre d'affaires après son passage au modèle franchisé.",
    category: "Economie",
    reliability: 95,
    source: "L'Echo",
    emoji: "🦁",
    proximity: 95,
    exclusivity: false,
    timeRemaining: 3,
    impact: {
      subscribers: 130,
      credibility: 8,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 690,
      credibility: -15,
      ethics: -8
    }
  },
  {
    id: "cult-2",
    title: "Une toile inconnue attribuée à Magritte découverte dans un grenier bruxellois",
    clickbaitTitle: "LE TRÉSOR CACHÉ : Cette peinture de Magritte vaut-elle des dizaines de millions ?",
    summary: "Des experts étudient une peinture surréaliste retrouvée lors d'un inventaire de succession à Ixelles.",
    category: "Culture",
    reliability: 80,
    source: "Musée des Beaux-Arts",
    emoji: "🍏",
    proximity: 95,
    exclusivity: true,
    timeRemaining: 3,
    impact: {
      subscribers: 170,
      credibility: 12,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 720,
      credibility: -5,
      ethics: -5
    }
  },
  {
    id: "clim-2",
    title: "Le record de chaleur battu pour un mois de juin à Uccle",
    clickbaitTitle: "BELGIQUE CANICULE : 38°C attendus ! Sommes-nous prêts à griller sur place ?",
    summary: "La station d'Uccle enregistre sa température la plus élevée depuis le début des relevés pour cette période.",
    category: "Climat",
    reliability: 100,
    source: "IRM",
    emoji: "☀️",
    proximity: 100,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 220,
      credibility: 10,
      ethics: 15
    },
    clickbaitImpact: {
      subscribers: 880,
      credibility: -20,
      ethics: -10
    }
  },
  {
    id: "int-2",
    title: "L'OTAN organise un exercice militaire aérien d'envergure au-dessus de la mer du Nord",
    clickbaitTitle: "SIMULATION DE GUERRE MONDIALE : Les avions de chasse de l'OTAN survolent la Belgique !",
    summary: "L'exercice comprend une cinquantaine d'aéronefs issus de 10 pays membres pour tester la défense commune.",
    category: "International",
    reliability: 100,
    source: "OTAN Communiqué",
    emoji: "✈️",
    proximity: 60,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 110,
      credibility: 8,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 650,
      credibility: -15,
      ethics: -5
    }
  },
  {
    id: "mon-2",
    title: "La Princesse Elisabeth fête son anniversaire dans la discrétion",
    clickbaitTitle: "LE MARIAGE SECRET d'Elisabeth ? La famille royale tremble face aux révélations !",
    summary: "L'héritière du trône a célébré ses 25 ans en famille à Oxford où elle poursuit ses études.",
    category: "Monarchie",
    reliability: 95,
    source: "Soir Mag",
    emoji: "👑",
    proximity: 95,
    exclusivity: false,
    timeRemaining: 3,
    impact: {
      subscribers: 140,
      credibility: 5,
      ethics: 8
    },
    clickbaitImpact: {
      subscribers: 820,
      credibility: -30,
      ethics: -20
    }
  },
  {
    id: "sp-2",
    title: "Le coureur belge Remco Evenepoel remporte le contre-la-montre du Critérium",
    clickbaitTitle: "LE MONSTRE REMCO ! Il écrase la concurrence et bat un record inhumain !",
    summary: "Le jeune cycliste s'est imposé avec 35 secondes d'avance sur son dauphin lors de l'étape chronométrée.",
    category: "Sport",
    reliability: 100,
    source: "DirectVélo",
    emoji: "🚴",
    proximity: 90,
    exclusivity: false,
    timeRemaining: 1,
    impact: {
      subscribers: 280,
      credibility: 5,
      ethics: 5
    },
    clickbaitImpact: {
      subscribers: 910,
      credibility: -5,
      ethics: -5
    }
  },
  {
    id: "tech-2",
    title: "L'Université de Liège intègre des outils d'IA générative dans ses examens",
    clickbaitTitle: "LA FIN DES DIPLÔMES ? ChatGPT va corriger et noter les étudiants liégeois !",
    summary: "Un projet pilote encadre l'utilisation éthique de l'IA pour la rédaction de mémoires universitaires.",
    category: "Technologie",
    reliability: 100,
    source: "ULiège Info",
    emoji: "🎓",
    proximity: 95,
    exclusivity: true,
    timeRemaining: 2,
    impact: {
      subscribers: 160,
      credibility: 8,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 730,
      credibility: -15,
      ethics: -10
    }
  },
  {
    id: "fake-4",
    title: "Rumeur sur la fermeture définitive du parc Walibi Belgium en Wallonie",
    clickbaitTitle: "ADIEU WALIBI : Le parc ferme ses portes pour toujours à cause des faillites !",
    summary: "Des publications virales détournent un communiqué sur des travaux de maintenance pour crier à la faillite.",
    category: "Faits Divers",
    reliability: 5,
    source: "Groupe Facebook 'Mons Info'",
    emoji: "🎢",
    proximity: 95,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 300,
      credibility: -35,
      ethics: -25
    },
    clickbaitImpact: {
      subscribers: 1350,
      credibility: -70,
      ethics: -35
    }
  },
  {
    id: "pol-3",
    title: "La Belgique s'accorde sur la baisse du taux de TVA sur l'électricité",
    clickbaitTitle: "CADEAU EMPOISONNÉ ? La vérité cachée derrière votre prochaine facture d'électricité !",
    summary: "Le gouvernement prolonge indéfiniment la réduction du taux de TVA à 6% sur l'énergie domestique.",
    category: "Politique",
    reliability: 100,
    source: "RTBF Info",
    emoji: "⚡",
    proximity: 100,
    exclusivity: false,
    timeRemaining: 2,
    impact: {
      subscribers: 180,
      credibility: 5,
      ethics: 10
    },
    clickbaitImpact: {
      subscribers: 780,
      credibility: -15,
      ethics: -10
    }
  }
];
