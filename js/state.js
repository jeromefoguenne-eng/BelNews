// Gestionnaire d'état de BelNews (Zustand-like en JS Vanilla)
window.BelNewsState = {
  // Valeurs initiales
  subscribers: 100,
  credibility: 100, // En % (0 à 100)
  revenue: 1200, // En €
  bossPressure: 0, // En % (0 à 100)
  ethics: 100, // Jauge Éthique cachée (0 à 100, commence à 100, baisse si dérive)
  
  currentLevelIndex: 0, // 0 = Niveau 1
  currentDay: 1,
  difficulty: 1, // 1 = Stagiaire, 2 = Normal, 3 = Expert
  
  history: [], // Articles publiés: { id, titleType, titleText, day, levelId, stats: { likes, shares, comments } }
  ignoredHistory: [], // Articles ignorés: { id, title, reliability, day, levelId }
  dailyResults: [], // Historique par jour de jeu
  
  activeScreen: "start", // start, game, summary, firing, debrief
  
  listeners: [],
  
  // Enregistrement d'un écouteur de changement d'état
  subscribe(listener) {
    this.listeners.push(listener);
  },
  
  // Déclencher les écouteurs sur mise à jour
  notify() {
    this.listeners.forEach(fn => fn(this));
  },
  
  // Réinitialiser tout l'état de jeu
  reset(difficulty = 1) {
    const levelData = window.BelNewsLevels[0];
    this.difficulty = Number(difficulty);
    this.currentLevelIndex = 0;
    this.currentDay = 1;
    this.subscribers = levelData.startSubscribers;
    this.credibility = 100;
    this.revenue = 1200;
    this.bossPressure = 0;
    this.ethics = 100;
    this.history = [];
    this.ignoredHistory = [];
    this.dailyResults = [];
    this.activeScreen = "game";
    
    this.notify();
  },
  
  // Récupérer le niveau actif de la configuration globale
  getCurrentLevel() {
    return window.BelNewsLevels[this.currentLevelIndex];
  },
  
  // Modifier les abonnés avec garde-fous
  changeSubscribers(amount) {
    // La difficulté augmente ou réduit les gains
    let multiplier = 1;
    if (this.difficulty === 1) multiplier = 1.2; // Plus facile
    if (this.difficulty === 3) multiplier = 0.8; // Plus dur
    
    const change = Math.round(amount * multiplier);
    this.subscribers = Math.max(0, this.subscribers + change);
    
    // Impact sur la pression du patron si gains d'audience
    if (change > 0) {
      this.changeBossPressure(-change / 100);
    }
    
    this.notify();
    return change;
  },
  
  // Modifier la crédibilité avec garde-fous
  changeCredibility(amount) {
    let multiplier = 1;
    if (this.difficulty === 3) multiplier = 1.5; // Plus punitif en Expert
    
    const change = Math.round(amount * multiplier);
    this.credibility = Math.max(0, Math.min(100, this.credibility + change));
    
    this.notify();
    return change;
  },
  
  // Modifier les revenus publicitaires
  changeRevenue(amount) {
    this.revenue = Math.max(0, this.revenue + amount);
    this.notify();
  },
  
  // Modifier la jauge éthique cachée
  changeEthics(amount) {
    this.ethics = Math.max(0, Math.min(100, this.ethics + amount));
    this.notify();
  },
  
  // Modifier la pression du patron
  changeBossPressure(amount) {
    const change = Math.round(amount);
    this.bossPressure = Math.max(0, Math.min(100, this.bossPressure + change));
    this.notify();
  },
  
  // Passer au jour suivant
  nextDay() {
    const level = this.getCurrentLevel();
    if (this.currentDay < level.days) {
      this.currentDay++;
      this.notify();
      return "next_day";
    } else {
      // Fin du niveau
      if (this.subscribers >= level.subscribersGoal) {
        // Niveau réussi
        if (this.currentLevelIndex < window.BelNewsLevels.length - 1) {
          this.currentLevelIndex++;
          this.currentDay = 1;
          this.notify();
          return "level_up";
        } else {
          // Fin du jeu - Victoire complète
          this.activeScreen = "debrief";
          this.notify();
          return "victory";
        }
      } else {
        // Niveau raté - Licenciement !
        this.activeScreen = "firing";
        this.notify();
        return "firing";
      }
    }
  },
  
  // Ajouter un article publié à l'historique
  addPublication(article, titleType, titleText, stats) {
    this.history.push({
      id: article.id,
      originalTitle: article.title,
      category: article.category,
      titleType: titleType, // 'sobre' ou 'putaclic'
      titleText: titleText,
      reliability: article.reliability,
      proximity: article.proximity,
      source: article.source,
      day: this.currentDay,
      levelId: this.getCurrentLevel().id,
      stats: stats // { likes, shares, commentsCount, commentsList }
    });
  },
  
  // Ajouter un article ignoré à l'historique
  addIgnored(article) {
    // Éviter les doublons
    if (!this.ignoredHistory.some(item => item.id === article.id)) {
      this.ignoredHistory.push({
        id: article.id,
        title: article.title,
        reliability: article.reliability,
        emoji: article.emoji,
        day: this.currentDay,
        levelId: this.getCurrentLevel().id
      });
    }
  }
};
