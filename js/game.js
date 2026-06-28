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

  // Sélectionner les dépêches spécifiques au jour courant
  generateDailyPool() {
    const pool = window.BelNewsPool.filter(art => art.day === window.BelNewsState.currentDay);
    
    // Mélanger le tableau pour l'ordre d'affichage
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    shuffle(pool);

    // Faire une copie profonde pour éviter de polluer les objets statiques
    return JSON.parse(JSON.stringify(pool));
  },

  // Transitionner vers le jour ou niveau suivant
  triggerNextTurn() {
    const state = window.BelNewsState;
    const result = state.nextDay();
    
    if (result === "next_day") {
      this.startNewDay();
    } else if (result === "level_up") {
      const newLevel = state.getCurrentLevel();
      
      // Message de promotion cynique
      alert(`🎉 PROMOTION CYNIQUE !\n\nVous passez au niveau supérieur : ${newLevel.title}.\n\nVos nouveaux objectifs d'abonnés sont fixés à : ${newLevel.subscribersGoal.toLocaleString()}.\n\nLe patron vous surveille.`);
      
      this.startNewDay();
    } else if (result === "victory") {
      window.BelNewsUI.showDebriefScreen();
    } else if (result === "firing") {
      window.BelNewsUI.showFiringScreen();
    }
  }
};
