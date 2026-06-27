// Moteur de simulation et algorithmes de score pour BelNews
window.BelNewsScoring = {
  
  // Noms d'utilisateurs belges pour le flux social
  socialUsernames: [
    { name: "Julien de Namur", handle: "@jul_namurois", avatar: "🧔" },
    { name: "Kris des Flandres", handle: "@kris_vlaanderen", avatar: "👱‍♂️" },
    { name: "Fleur de Liège", handle: "@fleur_lgeoise", avatar: "👩" },
    { name: "Chantal d'Uccle", handle: "@chanchan_uccloise", avatar: "👩‍🦳" },
    { name: "Yassine de Molenbeek", handle: "@yass_bxl", avatar: "👦" },
    { name: "Sarah de Gand", handle: "@sarah_gent", avatar: "👩‍🦰" },
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
    
    // La fiabilité affecte directement la crédibilité
    if (article.reliability < 50) {
      // C'est une fake news !
      if (isPutaclic) {
        // En putaclic, c'est dévastateur pour la crédibilité
        baseCred -= 35; 
        baseSubs = Math.round(baseSubs * 1.5); // Mais ça buzz encore plus
      } else {
        // Sobre, la fake news fait quand même baisser la confiance
        baseCred -= 15;
      }
    }
    
    // Calcul final des réactions sur le réseau social
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
    
    // Listes de messages thématiques
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
      "Franchement, le titre est abusé. Journalisme poubelle."
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

    // Générer le nombre requis de commentaires
    const limit = Math.min(6, count); // Max 6 commentaires affichés par post pour le visuel
    for (let i = 0; i < limit; i++) {
      const user = this.socialUsernames[Math.floor(Math.random() * this.socialUsernames.length)];
      let text = "";
      
      const rand = Math.random();
      if (isFake && rand < 0.5) {
        text = templatesFake[Math.floor(Math.random() * templatesFake.length)];
      } else if (isPutaclic && rand < 0.4) {
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
      
      // Ajouter au flux social détaillé
      detailedPosts.push({
        article: pub.article,
        titleType: pub.titleType,
        titleText: pub.titleType === 'putaclic' ? pub.article.clickbaitTitle : pub.article.title,
        stats: stats
      });
    });

    // Pression du patron : s'ajuste selon la performance du jour
    // Si l'audience progresse bien, la pression baisse. Sinon, elle monte.
    const level = window.BelNewsState.getCurrentLevel();
    // Seuil de croissance requis par jour estimé
    const dailyTarget = Math.round(level.subscribersGoal / level.days);
    
    let pressureChange = 0;
    if (daySubs >= dailyTarget) {
      pressureChange = -15; // Ouf, le patron se détend
    } else if (daySubs >= dailyTarget * 0.5) {
      pressureChange = 5;  // Un peu déçu
    } else {
      pressureChange = 25; // Le patron s'énerve !
    }

    // Le gain de revenus dépend du lectorat total
    const revenueGained = Math.round(daySubs * 0.15 + (window.BelNewsState.subscribers * 0.02));

    // Mettre à jour l'état réactif
    const actualSubsGained = window.BelNewsState.changeSubscribers(daySubs);
    const actualCredChange = window.BelNewsState.changeCredibility(dayCred);
    window.BelNewsState.changeRevenue(revenueGained);
    window.BelNewsState.changeEthics(dayEthics);
    window.BelNewsState.changeBossPressure(pressureChange);

    // Enregistrer chaque publication dans l'historique de l'état
    detailedPosts.forEach(post => {
      window.BelNewsState.addPublication(post.article, post.titleType, post.titleText, post.stats);
    });

    // Choix du feedback du patron basé sur les clics du jour
    let feedbackMood = "medium";
    if (daySubs >= dailyTarget * 1.2) {
      feedbackMood = "excellent";
    } else if (daySubs < dailyTarget * 0.4) {
      feedbackMood = "bad";
    }
    
    const bossSpeechPool = window.BelNewsPatron.dailyFeedback[feedbackMood];
    const bossSpeech = bossSpeechPool[Math.floor(Math.random() * bossSpeechPool.length)];

    return {
      subscribersGained: actualSubsGained,
      credibilityChange: actualCredChange,
      revenueGained: revenueGained,
      bossSpeech: bossSpeech,
      posts: detailedPosts
    };
  }
};
