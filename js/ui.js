// Contrôleur de l'Interface Utilisateur (UI) de BelNews
window.BelNewsUI = {
  // Liste des articles placés sur la Une : [ { slotId, article, titleType: 'sobre' | 'putaclic' } ]
  selectedArticles: [],
  // Liste locale des articles du jour reçus
  dailyArticlesPool: [],

  init() {
    this.bossWidget = document.getElementById("boss-chat-widget");
    this.bossToggle = document.getElementById("boss-chat-header");
    this.btnPublish = document.getElementById("btn-publish");

    // Écouteur pour rétracter/déployer le chat du patron
    this.bossToggle.addEventListener("click", () => {
      this.bossWidget.classList.toggle("chat-collapsed");
    });

    // Liaison du State
    window.BelNewsState.subscribe(state => this.renderDashboard(state));
    
    this.setupDragAndDrop();
    this.setupButtonEvents();
  },

  // Rendu des jauges supérieures
  renderDashboard(state) {
    document.getElementById("val-subscribers").textContent = state.subscribers.toLocaleString();
    document.getElementById("val-credibility").textContent = state.credibility + "%";
    document.getElementById("val-revenue").textContent = state.revenue.toLocaleString() + " €";
    document.getElementById("val-boss-pressure").textContent = state.bossPressure + "%";
    
    document.getElementById("val-level-title").textContent = state.getCurrentLevel().title;
    document.getElementById("val-current-day").textContent = state.currentDay;
    document.getElementById("val-total-days").textContent = state.getCurrentLevel().days;

    // Mise à jour visuelle des barres de progression
    const level = state.getCurrentLevel();
    const progressPercent = Math.min(100, (state.subscribers / level.subscribersGoal) * 100);
    document.getElementById("gauge-subscribers").style.width = progressPercent + "%";
    
    // Positionner la ligne verticale de l'objectif sur la jauge
    document.getElementById("val-goal-subscribers").textContent = level.subscribersGoal.toLocaleString();
    
    // Crédibilité couleur
    const gaugeCred = document.getElementById("gauge-credibility");
    gaugeCred.style.width = state.credibility + "%";
    gaugeCred.className = "gauge-bar-inner"; // reset classes
    if (state.credibility >= 60) {
      gaugeCred.classList.add("credibility-high");
    } else if (state.credibility >= 30) {
      gaugeCred.classList.add("credibility-medium");
    } else {
      gaugeCred.classList.add("gauge-pulse", "credibility-low");
    }

    // Revenus et Pression
    document.getElementById("gauge-revenue").style.width = Math.min(100, (state.revenue / 10000) * 100) + "%";
    
    const gaugePressure = document.getElementById("gauge-boss-pressure");
    gaugePressure.style.width = state.bossPressure + "%";
    if (state.bossPressure > 75) {
      gaugePressure.classList.add("gauge-pulse");
    } else {
      gaugePressure.classList.remove("gauge-pulse");
    }
  },

  // Configurer le flux d'une nouvelle journée de jeu
  loadDay(articles) {
    this.dailyArticlesPool = [...articles];
    this.selectedArticles = [];
    this.renderInbox();
    this.renderSlots();
    this.renderIgnoredList();
    this.updatePublishButton();
    
    // Alerte chat du patron au début de journée
    const level = window.BelNewsState.getCurrentLevel();
    if (window.BelNewsState.currentDay === 1) {
      this.displayBossMessage(window.BelNewsPatron.levelIntro[level.id]);
    } else {
      this.displayBossMessage("Journée " + window.BelNewsState.currentDay + ". Fais péter le score d'abonnés !");
    }
    
    // Vider le Belgogram au matin
    const socialFeed = document.getElementById("social-feed-list");
    socialFeed.innerHTML = `
      <div id="social-placeholder">
        <div class="placeholder-social-icon">💬</div>
        <p>Le fil social s'activera dès la publication de votre journal.</p>
      </div>
    `;
  },

  // Affichage de l'Inbox (pile de gauche)
  renderInbox() {
    const listContainer = document.getElementById("inbox-cards-list");
    listContainer.innerHTML = "";
    
    // Filtrer pour n'afficher que les articles non encore sélectionnés
    const available = this.dailyArticlesPool.filter(art => 
      !this.selectedArticles.some(sel => sel.article.id === art.id)
    );

    document.getElementById("inbox-counter").textContent = available.length;

    if (available.length === 0) {
      listContainer.innerHTML = `<div class="empty-list-text text-center" style="margin-top: 50px;">Aucune dépêche en attente. Tout est sur la Une ou ignoré.</div>`;
      return;
    }

    available.forEach(article => {
      const card = document.createElement("article");
      card.className = "news-card card-appear";
      card.setAttribute("draggable", "true");
      card.setAttribute("id", "card-" + article.id);
      
      // Proximité géog. & Fiabilité
      const reliabilityClass = article.reliability >= 80 ? "reliability-high" : (article.reliability >= 45 ? "reliability-medium" : "reliability-low");
      
      card.innerHTML = `
        <div class="card-header-info">
          <span class="card-category cat-${article.category.toLowerCase().replace(/\s+/g, '-')}">${article.category}</span>
          <span class="card-source">${article.source}</span>
        </div>
        <div class="card-illustration">${article.emoji}</div>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <div class="card-meters">
          <div class="meter-row">
            <span class="meter-label">Fiabilité estimée :</span>
            <div class="meter-bar-outer">
              <div class="meter-bar-inner ${reliabilityClass}" style="width: ${article.reliability}%;"></div>
            </div>
            <span class="meter-value-badge ${reliabilityClass}">${article.reliability}%</span>
          </div>
          <div class="meter-row">
            <span class="meter-label">Proximité locale :</span>
            <div class="meter-bar-outer">
              <div class="meter-bar-inner" style="width: ${article.proximity}%; background-color: var(--color-info);"></div>
            </div>
            <span class="meter-value-badge" style="color: var(--color-info);">${article.proximity}%</span>
          </div>
        </div>
      `;
      
      // Événements Drag & Drop
      card.addEventListener("dragstart", (e) => {
        card.classList.add("dragging");
        e.dataTransfer.setData("text/plain", article.id);
      });
      
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });
      
      listContainer.appendChild(card);
    });
  },

  // Dessin des Slots sur la Une (colonne du milieu)
  renderSlots() {
    const slots = document.querySelectorAll(".une-slot");
    slots.forEach(slot => {
      const slotId = parseInt(slot.getAttribute("data-slot"));
      const selection = this.selectedArticles.find(item => item.slotId === slotId);
      
      // Réinitialiser le style
      slot.className = "une-slot";
      
      if (selection) {
        slot.classList.add("filled");
        const article = selection.article;
        
        slot.innerHTML = `
          <div class="slot-number">${slotId}</div>
          <div class="slotted-card">
            <button class="btn-remove-slotted" onclick="window.BelNewsUI.removeArticleFromSlot(${slotId})" title="Retirer de la Une">✕</button>
            <div class="card-header-info">
              <span class="card-category cat-${article.category.toLowerCase().replace(/\s+/g, '-')}">${article.category}</span>
            </div>
            <h3>${article.title}</h3>
            
            <div class="slotted-title-edit">
              <label>Édition du Titre (Choix du traitement) :</label>
              <div class="title-select-container">
                
                <div class="title-option ${selection.titleType === 'sobre' ? 'selected' : ''}" onclick="window.BelNewsUI.setSlotTitleType(${slotId}, 'sobre')">
                  <input type="radio" name="title-type-${slotId}" ${selection.titleType === 'sobre' ? 'checked' : ''}>
                  <div>
                    <span class="title-text-type type-sobre">Sobre & Rigoureux</span>
                    <p style="font-size: 0.8rem; font-weight:600; color: var(--color-text);">${article.title}</p>
                  </div>
                </div>

                <div class="title-option ${selection.titleType === 'putaclic' ? 'selected' : ''}" onclick="window.BelNewsUI.setSlotTitleType(${slotId}, 'putaclic')">
                  <input type="radio" name="title-type-${slotId}" ${selection.titleType === 'putaclic' ? 'checked' : ''}>
                  <div>
                    <span class="title-text-type type-putaclic">Sensationnel (Putaclic)</span>
                    <p style="font-size: 0.8rem; font-weight:600; color: var(--color-primary);">${article.clickbaitTitle}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        `;
      } else {
        // Rendu vide
        const label = slotId === 1 ? "GROS TITRE principal" : (slotId === 2 ? "ACTU SECONDAIRE" : "DÉPÊCHE RAPIDE / INSOLITE");
        slot.innerHTML = `
          <span class="slot-number">${slotId}</span>
          <span class="slot-placeholder-text">Glissez le ${label} ici</span>
        `;
      }
    });

    document.getElementById("une-counter").textContent = `${this.selectedArticles.length} / 3`;
  },

  // Rendu de la zone des ignorés (non publiés)
  renderIgnoredList() {
    const list = document.getElementById("ignored-cards-list");
    list.innerHTML = "";
    
    // Tous les articles du pool qui ne sont ni dans l'inbox dispo ni dans la Une
    const ignored = this.dailyArticlesPool.filter(art => 
      !this.selectedArticles.some(sel => sel.article.id === art.id) &&
      !document.getElementById("card-" + art.id)
    );

    if (ignored.length === 0) {
      list.className = "ignored-list-empty";
      list.innerHTML = `<span class="empty-list-text">Les articles non sélectionnés s'accumuleront ici.</span>`;
      return;
    }

    list.className = "";
    ignored.forEach(art => {
      const row = document.createElement("div");
      row.className = "ignored-card-row";
      row.innerHTML = `
        <span class="ignored-emoji">${art.emoji}</span>
        <span class="ignored-title" title="${art.title}">${art.title}</span>
        <span class="ignored-badge">${art.category}</span>
      `;
      list.appendChild(row);
      
      // Ajouter également à l'historique d'état éthique
      window.BelNewsState.addIgnored(art);
    });
  },

  // Paramétrer le type de titre choisi
  setSlotTitleType(slotId, type) {
    const selection = this.selectedArticles.find(item => item.slotId === slotId);
    if (selection) {
      selection.titleType = type;
      this.renderSlots();
    }
  },

  // Retirer un article d'un slot
  removeArticleFromSlot(slotId) {
    this.selectedArticles = this.selectedArticles.filter(item => item.slotId !== slotId);
    this.renderSlots();
    this.renderInbox();
    this.renderIgnoredList();
    this.updatePublishButton();
  },

  // Configurer les écouteurs Drag & Drop
  setupDragAndDrop() {
    const slots = document.querySelectorAll(".une-slot");
    
    slots.forEach(slot => {
      slot.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (!slot.classList.contains("filled")) {
          slot.classList.add("drag-over");
        }
      });
      
      slot.addEventListener("dragleave", () => {
        slot.classList.remove("drag-over");
      });
      
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.classList.remove("drag-over");
        
        const articleId = e.dataTransfer.getData("text/plain");
        const article = this.dailyArticlesPool.find(art => art.id === articleId);
        
        if (article) {
          const slotId = parseInt(slot.getAttribute("data-slot"));
          
          // S'il y a déjà un article dans ce slot, on le vire avant
          this.selectedArticles = this.selectedArticles.filter(item => item.slotId !== slotId);
          
          // Ajouter le nouveau
          this.selectedArticles.push({
            slotId: slotId,
            article: article,
            titleType: 'sobre' // par défaut
          });
          
          this.renderSlots();
          this.renderInbox();
          this.renderIgnoredList();
          this.updatePublishButton();
        }
      });
    });
  },

  // Activer ou désactiver le bouton publier
  updatePublishButton() {
    if (this.selectedArticles.length === 3) {
      this.btnPublish.className = "btn-primary";
      this.btnPublish.removeAttribute("disabled");
    } else {
      this.btnPublish.className = "btn-disabled";
      this.btnPublish.setAttribute("disabled", "true");
    }
  },

  // Afficher les DM du patron
  displayBossMessage(message) {
    document.getElementById("boss-message-text").textContent = message;
    
    // Vibration et flash visuel
    this.bossWidget.classList.remove("chat-collapsed");
    this.bossWidget.classList.add("chat-vibrate");
    setTimeout(() => {
      this.bossWidget.classList.remove("chat-vibrate");
    }, 500);
  },

  // Setup Button Click Handlers
  setupButtonEvents() {
    // Bouton de lancement
    document.getElementById("btn-start-game").addEventListener("click", () => {
      const activeDiffBtn = document.querySelector(".btn-diff.active");
      const difficulty = activeDiffBtn ? activeDiffBtn.getAttribute("data-difficulty") : 1;
      
      document.getElementById("modal-start").classList.add("hidden");
      window.BelNewsGame.startGame(difficulty);
    });

    // Choix de difficulté
    const diffButtons = document.querySelectorAll(".difficulty-options .btn-diff");
    diffButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        diffButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // Bouton de publication journal
    this.btnPublish.addEventListener("click", () => {
      this.animateAndPublish();
    });

    // Bouton continuer après le rapport du jour
    document.getElementById("btn-next-day").addEventListener("click", () => {
      document.getElementById("modal-day-summary").classList.add("hidden");
      window.BelNewsGame.triggerNextTurn();
    });

    // Recommencer une partie (Défaite)
    document.getElementById("btn-restart-game").addEventListener("click", () => {
      document.getElementById("modal-firing").classList.add("hidden");
      document.getElementById("modal-start").classList.remove("hidden");
    });

    // Rejouer depuis le débriefing
    document.getElementById("btn-debrief-replay").addEventListener("click", () => {
      document.getElementById("modal-debrief").classList.add("hidden");
      document.getElementById("modal-start").classList.remove("hidden");
    });
  },

  // Animation Fly-out à 60 FPS avant de charger le flux social
  animateAndPublish() {
    this.btnPublish.setAttribute("disabled", "true");
    const slots = document.querySelectorAll(".une-slot");
    
    // Animer le fly-out sur les slots
    slots.forEach(slot => {
      slot.classList.add("card-publish-anim");
    });

    // Une fois l'animation finie, calculer le score et lancer le fil social
    setTimeout(() => {
      slots.forEach(slot => slot.classList.remove("card-publish-anim"));
      
      // Traitement des scores
      const result = window.BelNewsScoring.processDailyScoring(this.selectedArticles);
      this.renderSocialFeed(result);
    }, 500);
  },

  // Simulation progressive des réactions sociales à 60 FPS
  renderSocialFeed(scoringResult) {
    const feedContainer = document.getElementById("social-feed-list");
    feedContainer.innerHTML = ""; // Vider

    scoringResult.posts.forEach((post, index) => {
      const socialPost = document.createElement("article");
      socialPost.className = "social-post post-social-anim";
      socialPost.style.animationDelay = `${index * 1.5}s`; // Apparition cadencée
      
      const article = post.article;
      
      socialPost.innerHTML = `
        <div class="social-post-header">
          <span class="social-poster-avatar">🇧🇪</span>
          <div>
            <span class="social-poster-name">BelNews Officiel</span>
            <span class="social-poster-handle">@belnews_actu</span>
          </div>
        </div>
        <div class="social-post-content">
          <div class="social-post-image">${article.emoji}</div>
          <h3 class="social-post-title">${post.titleText}</h3>
          <p class="social-post-summary">${article.summary}</p>
        </div>
        <div class="social-post-actions">
          <span class="action-item" id="like-${article.id}">👍 <span class="action-val">0</span></span>
          <span class="action-item" id="share-${article.id}">🔁 <span class="action-val">0</span></span>
          <span class="action-item" id="comment-icon-${article.id}">💬 <span class="action-val">0</span></span>
        </div>
        <div class="social-comments-section" id="comments-section-${article.id}">
          <!-- Les commentaires apparaîtront progressivement -->
        </div>
      `;

      feedContainer.appendChild(socialPost);

      // Lancer les incrémentations dynamiques décalées
      setTimeout(() => {
        this.animateSocialCounters(article.id, post.stats);
      }, (index * 1500) + 300);
    });

    // Une fois que tout le fil a défilé (environ 6-7 secondes), on affiche le bouton ou le modal
    const totalDuration = (scoringResult.posts.length * 1500) + 5000;
    
    // Alerte DM immédiate du patron sur Belgogram
    setTimeout(() => {
      this.displayBossMessage(scoringResult.bossSpeech);
    }, 2000);

    setTimeout(() => {
      this.showDaySummary(scoringResult);
    }, totalDuration);
  },

  // Animer les clics/likes en temps réel
  animateSocialCounters(articleId, stats) {
    const likeEl = document.querySelector(`#like-${articleId} .action-val`);
    const shareEl = document.querySelector(`#share-${articleId} .action-val`);
    const commEl = document.querySelector(`#comment-icon-${articleId} .action-val`);
    const commentsSec = document.getElementById(`comments-section-${articleId}`);
    
    let currentLikes = 0;
    let currentShares = 0;
    
    // Progression par paliers sur 4 secondes
    const steps = 20;
    const intervalTime = 150;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      
      currentLikes = Math.round((stats.likes / steps) * currentStep);
      currentShares = Math.round((stats.shares / steps) * currentStep);
      
      likeEl.textContent = currentLikes.toLocaleString();
      shareEl.textContent = currentShares.toLocaleString();
      
      // Micro-rebond sur changement
      likeEl.parentElement.classList.add("stat-pop");
      shareEl.parentElement.classList.add("stat-pop");
      setTimeout(() => {
        likeEl.parentElement.classList.remove("stat-pop");
        shareEl.parentElement.classList.remove("stat-pop");
      }, 100);

      // Apparition cadencée des commentaires
      if (currentStep === 5 && stats.commentsList[0]) this.addSingleComment(commentsSec, stats.commentsList[0], commEl, 1);
      if (currentStep === 10 && stats.commentsList[1]) this.addSingleComment(commentsSec, stats.commentsList[1], commEl, 2);
      if (currentStep === 15 && stats.commentsList[2]) this.addSingleComment(commentsSec, stats.commentsList[2], commEl, 3);
      if (currentStep === 20 && stats.commentsList[3]) this.addSingleComment(commentsSec, stats.commentsList[3], commEl, 4);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);
  },

  // Insérer un commentaire dans la liste
  addSingleComment(container, comment, counterEl, countVal) {
    const el = document.createElement("div");
    el.className = "social-comment comment-slide-in";
    el.innerHTML = `
      <span class="comment-author">${comment.avatar} ${comment.handle}</span>
      <span class="comment-text">${comment.text}</span>
    `;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;

    // Incrémenter le badge
    counterEl.textContent = countVal;
    counterEl.parentElement.classList.add("stat-pop");
    setTimeout(() => {
      counterEl.parentElement.classList.remove("stat-pop");
    }, 100);
  },

  // Écran de fin de journée
  showDaySummary(scoringResult) {
    document.getElementById("summary-day-num").textContent = window.BelNewsState.currentDay;
    document.getElementById("summary-boss-speech").textContent = scoringResult.bossSpeech;
    
    document.getElementById("stat-day-subs-gained").textContent = "+" + scoringResult.subscribersGained.toLocaleString();
    document.getElementById("stat-day-rev-gained").textContent = "+" + scoringResult.revenueGained.toLocaleString() + " €";
    document.getElementById("stat-day-credibility").textContent = window.BelNewsState.credibility + "%";
    
    const level = window.BelNewsState.getCurrentLevel();
    const progressPercent = Math.min(100, Math.round((window.BelNewsState.subscribers / level.subscribersGoal) * 100));
    document.getElementById("stat-day-progress").textContent = progressPercent + "%";

    // Liste des publications dans le récapitulatif
    const pubList = document.getElementById("summary-publications-list");
    pubList.innerHTML = "";
    
    this.selectedArticles.forEach(pub => {
      const isPutaclic = pub.titleType === 'putaclic';
      const row = document.createElement("div");
      row.className = "summary-pub-row";
      row.innerHTML = `
        <div class="pub-title-row">${isPutaclic ? pub.article.clickbaitTitle : pub.article.title}</div>
        <div class="pub-meta-row">
          <span>Traitement : <strong class="${isPutaclic ? 'color-danger' : 'color-success'}">${isPutaclic ? 'Sensationnel' : 'Sobre'}</strong></span>
          <span>Fiabilité de base : <strong class="${pub.article.reliability >= 50 ? 'color-success' : 'color-danger'}">${pub.article.reliability}%</strong></span>
        </div>
      `;
      pubList.appendChild(row);
    });

    document.getElementById("modal-day-summary").classList.remove("hidden");
  },

  // Déclencher le licenciement (Game Over)
  showFiringScreen() {
    const letter = document.getElementById("firing-letter-text");
    
    // Générer la date fictive
    document.querySelectorAll(".current-date-fictive").forEach(el => {
      el.textContent = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    });

    letter.innerHTML = `
      Monsieur/Madame,<br><br>
      Nous sommes au regret de vous informer de votre <strong>licenciement immédiat</strong> de la rédaction de BelNews S.A.<br><br>
      Malgré nos multiples rappels sur la nécessité absolue de générer du trafic et de satisfaire les annonceurs, les indicateurs d'abonnés de votre niveau de rôle (${window.BelNewsState.getCurrentLevel().title}) n'ont pas atteint les objectifs de rentabilité fixés.<br><br>
      Votre accès aux bases de données est révoqué. Nous vous souhaitons une meilleure continuation dans un secteur moins exigeant.<br><br>
      Le Service RH.
    `;

    document.getElementById("boss-firing-speech").textContent = `"${window.BelNewsPatron.firing.bossLastWord}"`;
    document.getElementById("modal-firing").classList.remove("hidden");
  },

  // Déclencher le débriefing pédagogique final (Victoire)
  showDebriefScreen() {
    const state = window.BelNewsState;
    
    // 1. Calculer les statistiques du profil éditorial
    const totalPubs = state.history.length;
    const putaclicCount = state.history.filter(item => item.titleType === 'putaclic').length;
    const sensationalismPercent = totalPubs > 0 ? Math.round((putaclicCount / totalPubs) * 100) : 0;
    const rigorPercent = 100 - sensationalismPercent;

    // Proximité moyenne
    const sumProximity = state.history.reduce((sum, item) => sum + item.proximity, 0);
    const avgProximity = totalPubs > 0 ? Math.round(sumProximity / totalPubs) : 0;

    // Remplir les barres radar
    document.getElementById("val-debrief-sensationalism").textContent = sensationalismPercent + "%";
    document.getElementById("radar-sensationalism").style.setProperty("--val-width", sensationalismPercent + "%");
    
    document.getElementById("val-debrief-rigor").textContent = rigorPercent + "%";
    document.getElementById("radar-rigor").style.setProperty("--val-width", rigorPercent + "%");

    document.getElementById("val-debrief-proximity").textContent = avgProximity + "%";
    document.getElementById("radar-proximity").style.setProperty("--val-width", avgProximity + "%");

    // 2. Jauge éthique cachée
    const ethicsScore = state.ethics;
    document.getElementById("val-debrief-ethics").textContent = `${ethicsScore} / 100`;
    
    const ethicsEmoji = document.getElementById("debrief-ethics-emoji");
    const ethicsVerdict = document.getElementById("debrief-ethics-verdict");
    
    if (ethicsScore >= 80) {
      ethicsEmoji.textContent = "😇";
      ethicsVerdict.textContent = "Profil : Journaliste exemplaire. Vous avez préservé la vérité et le débat démocratique, quitte à irriter votre patron. Une perle rare en voie de disparition.";
    } else if (ethicsScore >= 45) {
      ethicsEmoji.textContent = "⚖️";
      ethicsVerdict.textContent = "Profil : Pragmatique équilibriste. Vous avez fait quelques compromis cyniques pour sauver votre poste, tout en gardant une certaine limite morale. Le compromis à la belge.";
    } else {
      ethicsEmoji.textContent = "😈";
      ethicsVerdict.textContent = "Profil : Mercenaire du clic. Prêt à inventer des pandémies et à ruiner la confiance publique pour voir des chiffres grimper. Le patron est fier de vous, la démocratie un peu moins.";
    }

    // 3. Rendu de la liste des actus importantes ignorées
    const ignoredContainer = document.getElementById("debrief-ignored-list");
    ignoredContainer.innerHTML = "";

    // Filtrer les articles de fiabilité 100% que le joueur a ignorés
    const importantIgnored = state.ignoredHistory.filter(item => item.reliability === 100);
    
    if (importantIgnored.length === 0) {
      ignoredContainer.innerHTML = `<p class="empty-list-text text-center">Impressionnant ! Vous n'avez omis aucune information d'intérêt général majeure.</p>`;
    } else {
      importantIgnored.forEach(item => {
        const row = document.createElement("div");
        row.className = "debrief-ignored-row";
        row.innerHTML = `
          <span class="ignored-emoji">${item.emoji}</span>
          <span class="ignored-title">${item.title}</span>
          <span class="ignored-badge-reliability reliability-high">Fiabilité 100%</span>
        `;
        ignoredContainer.appendChild(row);
      });
    }

    document.getElementById("modal-debrief").classList.remove("hidden");
    
    // Déclencher les confettis de victoire !
    this.spawnVictoryConfetti();
  },

  // Effet de pluie de confettis
  spawnVictoryConfetti() {
    const colors = ["#ff2d55", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement("div");
      particle.className = "confetti-particle";
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDelay = Math.random() * 2 + "s";
      particle.style.transform = `scale(${Math.random() * 0.6 + 0.4})`;
      document.body.appendChild(particle);
      
      // Nettoyage
      setTimeout(() => particle.remove(), 4000);
    }
  }
};
