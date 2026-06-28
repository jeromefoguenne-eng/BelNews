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

  // Sélectionner 10 dépêches avec gradation de difficulté selon le jour
  generateDailyPool() {
    const pool = [...window.BelNewsPool];
    const state = window.BelNewsState;
    const currentDay = state.currentDay;
    
    // Séparer les dépêches par niveau de fiabilité
    const cleanArticles = pool.filter(art => art.reliability >= 80);
    const ambiguousArticles = pool.filter(art => art.reliability >= 50 && art.reliability < 80);
    const fakeArticles = pool.filter(art => art.reliability < 50);

    // Mélanger chaque tableau séparément
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    shuffle(cleanArticles);
    shuffle(ambiguousArticles);
    shuffle(fakeArticles);

    const selection = [];
    
    // Déterminer la composition du pool selon le jour (Gradation de difficulté)
    if (currentDay === 1) {
      // Jour 1 : 6 articles fiables, 2 ambigus, 2 fausses nouvelles (Facile)
      selection.push(...cleanArticles.slice(0, 6));
      selection.push(...ambiguousArticles.slice(0, 2));
      selection.push(...fakeArticles.slice(0, 2));
    } else if (currentDay === 2) {
      // Jour 2 : 4 articles fiables, 3 ambigus, 3 fausses nouvelles (Moyen)
      selection.push(...cleanArticles.slice(0, 4));
      selection.push(...ambiguousArticles.slice(0, 3));
      selection.push(...fakeArticles.slice(0, 3));
    } else {
      // Jour 3+ : 2 articles fiables, 3 ambigus, 5 fausses nouvelles (Difficile / Saturation de fake news)
      selection.push(...cleanArticles.slice(0, 2));
      selection.push(...ambiguousArticles.slice(0, 3));
      selection.push(...fakeArticles.slice(0, 5));
    }

    // Si on manque d'articles pour une catégorie (au cas où le pool est petit), on complète avec le reste
    while (selection.length < 10) {
      const remaining = pool.filter(art => !selection.some(s => s.id === art.id));
      if (remaining.length === 0) break;
      selection.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    // Mélanger la sélection finale
    shuffle(selection);

    // Faire une copie profonde pour éviter de polluer les objets statiques
    return JSON.parse(JSON.stringify(selection.slice(0, 10)));
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
