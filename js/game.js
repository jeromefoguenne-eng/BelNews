// Moteur de boucle de jeu pour BelNews
window.BelNewsGame = {
  
  // Lancer une nouvelle partie
  startGame(difficulty) {
    window.BelNewsState.reset(difficulty);
    this.startNewDay();
  },

  // Démarrer une nouvelle journée de travail
  startNewDay() {
    const dailyPool = this.generateDailyPool();
    window.BelNewsUI.loadDay(dailyPool);
  },

  // Sélectionner aléatoirement 10 à 12 dépêches pour la journée en mélangeant catégories et fiabilités
  generateDailyPool() {
    const pool = [...window.BelNewsPool];
    const dayArticles = [];
    const count = 10; // Pool fixe de 10 articles pour le tri quotidien
    
    // Mélange de Fisher-Yates du pool complet
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Prendre les 10 premiers
    for (let i = 0; i < count; i++) {
      if (pool[i]) {
        // Faire une copie profonde pour éviter de polluer le pool statique sur réécriture de titres
        dayArticles.push(JSON.parse(JSON.stringify(pool[i])));
      }
    }
    
    return dayArticles;
  },

  // Transitionner vers le jour ou niveau suivant
  triggerNextTurn() {
    const state = window.BelNewsState;
    const levelBefore = state.currentLevelIndex;
    
    const result = state.nextDay();
    
    if (result === "next_day") {
      // Jour suivant simple
      this.startNewDay();
    } else if (result === "level_up") {
      // Promotion cynique
      const newLevel = state.getCurrentLevel();
      
      // Message d'alerte de promotion du patron
      alert(`🎉 FÉLICITATIONS !\n\nVous êtes promu au poste de : ${newLevel.title}.\n\nLe patron vous attend au tournant.`);
      
      this.startNewDay();
    } else if (result === "victory") {
      // Fin du jeu : Débrief final
      window.BelNewsUI.showDebriefScreen();
    } else if (result === "firing") {
      // Fin du jeu : Licenciement
      window.BelNewsUI.showFiringScreen();
    }
  }
};
