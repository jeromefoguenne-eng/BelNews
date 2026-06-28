// Moteur de simulation et algorithmes de score pour BelNews
window.BelNewsScoring = {
  
  // Noms d'utilisateurs belges pour le flux social
  socialUsernames: [
    { name: "Julien de Namur", handle: "@jul_namurois", avatar: "🧔" },
    { name: "Kris des Flandres", handle: "@kris_vlaanderen", avatar: "👱‍♂️" },
    { name: "Fleur de Liège", handle: "@fleur_lgeoise", avatar: "👩" },
    { name: "Chantal d'Uccle", handle: "@chanchan_uccloise", avatar: "👩‍🦳" },
    { name: "Yassine de Molenbeek", handle: "@yass_bxl", avatar: "👦" },
    { name: "Sarah de Gand", handle: "@sarah_gent", avatar: "👩&zwj;🦰" },
    { name: "Le Vrai Débat", handle: "@le_vrai_debat", avatar: "🤔" },
    { name: "Frite Citoyenne", handle: "@frite_belge", avatar: "🍟" },
    { name: "L'Observateur Belge", handle: "@obs_belge", avatar: "🧐" },
    { name: "Politik Mag", handle: "@politik_be", avatar: "👔" }
  ],

  // Calcul de la viralité et des impacts d'un article unique
  calculateArticleStats(article, titleType) {
    const isPutaclic = titleType === 'putaclic';
    const impactData = isPutaclic ? article.clickbaitImpact : article.impact;
    
    // Valeurs de base tirées de la dépêche
    let baseSubs = impactData.subscribers;
    let baseCred = impactData.credibility;
    let baseEthics = impactData.ethics;
    
    const currentDay = window.BelNewsState.currentDay;
    // Gradation : la lassitude de l'audience augmente les pénalités de crédibilité de 10% par jour
    const penaltyMultiplier = 1 + (currentDay - 1) * 0.10;

    // La fiabilité affecte directement la crédibilité
    if (article.reliability < 50) {
      // C'est une fake news !
      if (isPutaclic) {
        baseCred = Math.round(baseCred * penaltyMultiplier) - 35; 
        baseSubs = Math.round(baseSubs * 1.5); // Buzz plus important
      } else {
        baseCred = Math.round(baseCred * penaltyMultiplier) - 15;
      }
    } else {
      // Dépêche fiable mais titre putaclic
      if (isPutaclic) {
        baseCred = Math.round(baseCred * penaltyMultiplier) - 15;
      }
    }
    
    const likes = Math.round(baseSubs * (isPutaclic ? 0.35 : 0.15));
    const shares = Math.round(baseSubs * (isPutaclic ? 0.15 : 0.05));
    const commentsCount = Math.round(baseSubs * 0.08);
    const commentsList = this.generateComments(article, titleType, commentsCount);
    
    return {
      subscribersGained: baseSubs,
      credibilityChange: baseCred,
      ethicsChange: baseEthics,
      likes: likes,
      shares: shares,
      commentsCount: commentsCount,
      commentsList: commentsList
    };
  },

  // Génération procédurale de commentaires en français selon le type et la véracité
  generateComments(article, titleType, count) {
    const comments = [];
    const isPutaclic = titleType === 'putaclic';
    const isFake = article.reliability < 50;
    
    // Commentaires génériques
    const templatesFake = [
      "Attendez, c'est vérifié ça ? Ça me paraît énorme... 🤨",
      "Encore de la désinformation pure. Honte à BelNews d'écrire ça !",
      "J'ai lu le contraire sur un autre site. Vous inventez tout pour le buzz.",
      "C'est totalement faux ! Une simple recherche Google le prouve.",
      "Merci de dénoncer la vérité cachée ! Partagé ! 🙏"
    ];
    
    const templatesPutaclic = [
      "Titre hyper putaclic... le contenu n'a rien à voir. Je me désabonne !",
      "Vous cherchez juste le buzz. Ce journal est devenu une poubelle.",
      "SCANDALEUX ! Il faut partager ça en masse !",
      "Encore une tempête dans un verre d'eau. Merci le stagiaire CM.",
      "Franchement, le titre est abusé. Journalisme de caniveau."
    ];
    
    const templatesClean = [
      "Enfin un article intéressant et sourcé. Merci BelNews.",
      "Article propre et nuancé. Ça change des autres médias.",
      "Rien à dire, c'est du bon boulot journalistique. 🇧🇪",
      "Sujet important, merci d'en parler avec sérieux.",
      "Intéressant. Les sources citées sont fiables, c'est pro."
    ];
    
    const templatesBelge = [
      "Encore un coup des politiciens à Bruxelles ça. 🙄",
      "Une bonne dose de frites et on oublie cette news. 🍟",
      "C'est typiquement belge ce genre d'histoire... Magnifique pays.",
      "Et pendant ce temps, la SNCB a encore du retard. 🚂",
      "M'enfin, c'est n'importe quoi !"
    ];

    // Commentaires thématiques spécifiques
    const topicComments = {
      gov: [
        "Boulanger détruit nos écoles publiques pour enrichir les éditeurs de tablettes !",
        "Les profs ont bien raison de faire grève, 38 élèves par classe c'est ingérable.",
        "Ces fainéants de profs encore en grève... marre de devoir garder mes gosses !",
        "La réforme Boulanger est une honte nationale !"
      ],
      cli: [
        "45 degrés et le journal parle de terrasses et de glaces ? Vous êtes sérieux ?",
        "Super temps pour aller à Ostende, arrêtez d'être catastrophistes !",
        "Le réchauffement climatique est là et BelNews nous parle de piscines publiques...",
        "On va tous griller sur place mais ouf, le glacier fait le plein."
      ],
      con: [
        "Je le savais ! Les pigeons me regardaient bizarrement dans le parc !",
        "BelNews s'intéresse enfin aux vrais sujets occultés par les élites !",
        "La Terre plate ? Et pourquoi pas des frites carrées pendant qu'on y est ?",
        "Pelo Di Pupo est reptilien, ça explique sa voix !"
      ],
      sc: [
        "Il faut renvoyer tous ces Racistanais chez eux, la sécurité avant tout !",
        "Encore un fait divers monté en épingle pour faire peur aux gens.",
        "Les Belges n'ont plus de travail et on loge des étrangers...",
        "Criminalité stable ? C'est faux, on ne se sent plus chez nous !"
      ],
      pm: [
        "Ixelles est devenue une zone de guerre d'après l'article, n'importe quoi.",
        "La panique morale habituelle pour cacher l'inflation.",
        "Merci BelNews de dire tout haut ce que les gens pensent tout bas.",
        "Soutien aux bénévoles qui aident les réfugiés."
      ],
      ad: [
        "C'est moi ou cet article sent le placement de produit à plein nez ? 🤥",
        "J'adore Voltis, c'est vraiment la meilleure voiture du marché !",
        "ChocoKing est blindé d'huile de palme, super le conseil santé...",
        "Un publireportage déguisé, quelle déchéance éditoriale."
      ],
      go: [
        "Soutien total à Pierre Gorgamidi, victime du tribunal féministe de Twitter !",
        "Pierre Gorgamidi aux assises ! Justice pour les stagiaires !",
        "Le silence de la chaîne est complice, c'est une honte.",
        "Présumé innocent ? Il y a quand même cinq plaintes pour viol !"
      ]
    };

    // Déterminer la thématique de la dépêche
    let topicKey = null;
    for (const key of Object.keys(topicComments)) {
      if (article.id.startsWith(key)) {
        topicKey = key;
        break;
      }
    }

    const limit = Math.min(6, count); 
    for (let i = 0; i < limit; i++) {
      const user = this.socialUsernames[Math.floor(Math.random() * this.socialUsernames.length)];
      let text = "";
      
      const rand = Math.random();
      if (topicKey && rand < 0.6) {
        const list = topicComments[topicKey];
        text = list[Math.floor(Math.random() * list.length)];
      } else if (isFake && rand < 0.8) {
        text = templatesFake[Math.floor(Math.random() * templatesFake.length)];
      } else if (isPutaclic && rand < 0.7) {
        text = templatesPutaclic[Math.floor(Math.random() * templatesPutaclic.length)];
      } else if (rand < 0.3) {
        text = templatesBelge[Math.floor(Math.random() * templatesBelge.length)];
      } else {
        text = templatesClean[Math.floor(Math.random() * templatesClean.length)];
      }
      
      comments.push({
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        text: text
      });
    }
    
    return comments;
  },

  // Calcul quotidien global (somme des 3 articles publiés)
  processDailyScoring(selectedArticles) {
    let daySubs = 0;
    let dayCred = 0;
    let dayEthics = 0;
    
    const detailedPosts = [];
    
    selectedArticles.forEach(pub => {
      const stats = this.calculateArticleStats(pub.article, pub.titleType);
      
      daySubs += stats.subscribersGained;
      dayCred += stats.credibilityChange;
      dayEthics += stats.ethicsChange;
      
      detailedPosts.push({
        article: pub.article,
        titleType: pub.titleType,
        titleText: pub.titleType === 'putaclic' ? pub.article.clickbaitTitle : pub.article.title,
        stats: stats
      });
    });

    const level = window.BelNewsState.getCurrentLevel();
    const currentDay = window.BelNewsState.currentDay;
    
    // Calcul de la pression du patron selon l'objectif quotidien
    const dailyTargetBase = Math.round(level.subscribersGoal / level.days);
    const dailyTarget = Math.round(dailyTargetBase * (1 + (currentDay - 1) * 0.15));
    
    // Évaluation du respect de l'objectif thématique de Jean-Jacques
    const preferredCount = selectedArticles.filter(pub => pub.article.choiceType === 'preferred').length;
    const isSuccess = preferredCount >= 2;
    
    let pressureChange = 0;
    if (isSuccess) {
      pressureChange = -15; // Le patron est content, la pression baisse
    } else {
      pressureChange = 25;  // Le patron s'énerve, la pression monte !
    }

    const revenueGained = Math.round(daySubs * 0.15 + (window.BelNewsState.subscribers * 0.02));

    // Mettre à jour l'état réactif
    const actualSubsGained = window.BelNewsState.changeSubscribers(daySubs);
    const actualCredChange = window.BelNewsState.changeCredibility(dayCred);
    window.BelNewsState.changeRevenue(revenueGained);
    window.BelNewsState.changeEthics(dayEthics);
    window.BelNewsState.changeBossPressure(pressureChange);

    // Mettre à jour la couleur du thème 3D
    const hasFakeNews = selectedArticles.some(pub => pub.article.reliability < 50);
    if (window.BelNews3D && window.BelNews3D.updateTheme) {
      window.BelNews3D.updateTheme(window.BelNewsState.credibility, hasFakeNews);
    }

    // Enregistrer chaque publication dans l'historique de l'état
    detailedPosts.forEach(post => {
      window.BelNewsState.addPublication(post.article, post.titleType, post.titleText, post.stats);
    });

    // Dialogue scénarisé spécifique de Jean-Jacques pour cette journée
    const dayFeedback = window.BelNewsPatron.dayFeedbacks[currentDay];
    const bossSpeech = isSuccess ? dayFeedback.success : dayFeedback.fail;

    return {
      subscribersGained: actualSubsGained,
      credibilityChange: actualCredChange,
      revenueGained: revenueGained,
      bossSpeech: bossSpeech,
      posts: detailedPosts
    };
  }
};
