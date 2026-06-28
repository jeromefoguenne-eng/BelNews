// Contrôleur de l'Interface Utilisateur (UI) de BelNews v0.2
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
    
    // Réinitialiser la couleur du graphe 3D
    if (window.BelNews3D && window.BelNews3D.updateTheme) {
      window.BelNews3D.updateTheme(window.BelNewsState.credibility, false);
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

  // Génération dynamique du média de la carte (Photo, Vidéo, GIF)
  getMediaHTML(article) {
    if (article.mediaType === "photo") {
      return `
        <div class="media-photo" style="background-image: ${article.mediaTheme};">
          <div class="media-photo-overlay">${article.title}</div>
        </div>
      `;
    } else if (article.mediaType === "video") {
      return `
        <div class="media-video" style="background: ${article.mediaTheme};">
          <span class="video-play-btn">▶️</span>
          <div class="video-controls-mock">
            <div class="video-progress-mock"></div>
          </div>
          <span class="video-time-badge">01:${Math.floor(Math.random() * 40) + 10}</span>
        </div>
      `;
    } else {
      // GIF
      return `
        <div class="media-gif" style="background: ${article.mediaTheme};">
          <span class="gif-badge">GIF</span>
          <span style="font-size: 3rem;">${article.emoji}</span>
        </div>
      `;
    }
  },

  // Effet de survol parallaxe 3D sur les cartes d'articles
  apply3DTilt(card) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const angleX = (yc - y) / 12; // angle de rotation X
      const angleY = (x - xc) / 12; // angle de rotation Y
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.03, 1.03, 1.03)`;
      
      // Ajuster l'ombre pour la profondeur
      card.style.boxShadow = `${-angleY * 1.5}px ${angleX * 1.5}px 25px rgba(255, 45, 85, 0.2)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.boxShadow = "var(--box-shadow)";
    });
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
      
      const reliabilityClass = article.reliability >= 80 ? "reliability-high" : (article.reliability >= 45 ? "reliability-medium" : "reliability-low");
      
      card.innerHTML = `
        <div class="card-header-info">
          <span class="card-category cat-${article.category.toLowerCase().replace(/\s+/g, '-')}">${article.category}</span>
          <span class="card-source">${article.source}</span>
        </div>
        ${this.getMediaHTML(article)}
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
      
      // Ajouter l'effet 3D tilt
      this.apply3DTilt(card);

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
        const label = slotId === 1 ? "GROS TITRE principal" : (slotId === 2 ? "ACTU SECONDAIRE" : "DÉPÊCHE RAPIDE / INSOLITE");
        slot.innerHTML = `
          <span class="slot-number">${slotId}</span>
          <span class="slot-placeholder-text">Glissez le ${label} ici</span>
        `;
      }
    });

    document.getElementById("une-counter").textContent = `${this.selectedArticles.length} / 3`;
  },

  // Rendu de la zone des ignorés
  renderIgnoredList() {
    const list = document.getElementById("ignored-cards-list");
    list.innerHTML = "";
    
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
      window.BelNewsState.addIgnored(art);
    });
  },

  setSlotTitleType(slotId, type) {
    const selection = this.selectedArticles.find(item => item.slotId === slotId);
    if (selection) {
      selection.titleType = type;
      this.renderSlots();
    }
  },

  removeArticleFromSlot(slotId) {
    this.selectedArticles = this.selectedArticles.filter(item => item.slotId !== slotId);
    this.renderSlots();
    this.renderInbox();
    this.renderIgnoredList();
    this.updatePublishButton();
  },

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
          
          this.selectedArticles = this.selectedArticles.filter(item => item.slotId !== slotId);
          this.selectedArticles.push({
            slotId: slotId,
            article: article,
            titleType: 'sobre'
          });
          
          this.renderSlots();
          this.renderInbox();
          this.renderIgnoredList();
          this.updatePublishButton();
        }
      });
    });
  },

  updatePublishButton() {
    if (this.selectedArticles.length === 3) {
      this.btnPublish.className = "btn-primary";
      this.btnPublish.removeAttribute("disabled");
    } else {
      this.btnPublish.className = "btn-disabled";
      this.btnPublish.setAttribute("disabled", "true");
    }
  },

  displayBossMessage(message) {
    document.getElementById("boss-message-text").textContent = message;
    this.bossWidget.classList.remove("chat-collapsed");
    this.bossWidget.classList.add("chat-vibrate");
    setTimeout(() => {
      this.bossWidget.classList.remove("chat-vibrate");
    }, 550);
  },

  setupButtonEvents() {
    document.getElementById("btn-start-game").addEventListener("click", () => {
      const activeDiffBtn = document.querySelector(".btn-diff.active");
      const difficulty = activeDiffBtn ? activeDiffBtn.getAttribute("data-difficulty") : 1;
      
      document.getElementById("modal-start").classList.add("hidden");
      window.BelNewsGame.startGame(difficulty);
    });

    const diffButtons = document.querySelectorAll(".difficulty-options .btn-diff");
    diffButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        diffButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    this.btnPublish.addEventListener("click", () => {
      this.animateAndPublish();
    });

    document.getElementById("btn-next-day").addEventListener("click", () => {
      document.getElementById("modal-day-summary").classList.add("hidden");
      window.BelNewsGame.triggerNextTurn();
    });

    document.getElementById("btn-restart-game").addEventListener("click", () => {
      document.getElementById("modal-firing").classList.add("hidden");
      document.getElementById("modal-start").classList.remove("hidden");
    });

    document.getElementById("btn-debrief-replay").addEventListener("click", () => {
      document.getElementById("modal-debrief").classList.add("hidden");
      document.getElementById("modal-start").classList.remove("hidden");
    });
  },

  animateAndPublish() {
    this.btnPublish.setAttribute("disabled", "true");
    const slots = document.querySelectorAll(".une-slot");
    
    slots.forEach(slot => {
      slot.classList.add("card-publish-anim");
    });

    setTimeout(() => {
      slots.forEach(slot => slot.classList.remove("card-publish-anim"));
      
      const result = window.BelNewsScoring.processDailyScoring(this.selectedArticles);
      this.renderSocialFeed(result);
    }, 500);
  },

  // Publication SÉQUENTIELLE et Réactions dynamiques WebGL 3D
  renderSocialFeed(scoringResult) {
    const feedContainer = document.getElementById("social-feed-list");
    feedContainer.innerHTML = ""; // Vider

    // Lancer la publication en chaîne (séquence)
    this.publishPostSequentially(scoringResult.posts, 0, () => {
      // Une fois tous les articles animés, afficher le résumé quotidien
      setTimeout(() => {
        this.showDaySummary(scoringResult);
      }, 3500);
      
      // Dialogue du patron à la fin du défilement
      this.displayBossMessage(scoringResult.bossSpeech);
    });
  },

  // Chaîner les publications
  publishPostSequentially(posts, index, onComplete) {
    if (index >= posts.length) {
      onComplete();
      return;
    }

    const post = posts[index];
    const feedContainer = document.getElementById("social-feed-list");
    
    const socialPost = document.createElement("article");
    socialPost.className = "social-post post-social-anim";
    
    const article = post.article;
    const isPutaclic = post.titleType === 'putaclic';

    socialPost.innerHTML = `
      <div class="social-post-header">
        <span class="social-poster-avatar">🇧🇪</span>
        <div>
          <span class="social-poster-name">BelNews Officiel</span>
          <span class="social-poster-handle">@belnews_actu</span>
        </div>
      </div>
      <div class="social-post-content">
        ${this.getMediaHTML(article)}
        <h3 class="social-post-title">${post.titleText}</h3>
        <p class="social-post-summary">${article.summary}</p>
      </div>
      <div class="social-post-actions">
        <span class="action-item" id="like-${article.id}">👍 <span class="action-val">0</span></span>
        <span class="action-item" id="share-${article.id}">🔁 <span class="action-val">0</span></span>
        <span class="action-item" id="comment-icon-${article.id}">💬 <span class="action-val">0</span></span>
      </div>
      <div class="social-comments-section" id="comments-section-${article.id}">
        <!-- Commentaires progressifs -->
      </div>
    `;

    // Si c'est le premier post, on vire le placeholder
    const placeholder = document.getElementById("social-placeholder");
    if (placeholder) placeholder.remove();

    feedContainer.appendChild(socialPost);
    feedContainer.scrollTop = feedContainer.scrollHeight;

    // Lancer les compteurs de clics et abonnés pour CE post
    this.animateSinglePostCounters(article.id, post.stats, () => {
      // Passer au post suivant après 1,5 seconde d'attente
      setTimeout(() => {
        this.publishPostSequentially(posts, index + 1, onComplete);
      }, 1500);
    });
  },

  // Animer compteurs d'abonnés globaux et likes d'un seul post de manière synchrone
  animateSinglePostCounters(articleId, stats, callback) {
    const likeEl = document.querySelector(`#like-${articleId} .action-val`);
    const shareEl = document.querySelector(`#share-${articleId} .action-val`);
    const commEl = document.querySelector(`#comment-icon-${articleId} .action-val`);
    const commentsSec = document.getElementById(`comments-section-${articleId}`);
    
    let currentLikes = 0;
    let currentShares = 0;
    
    // Découper l'incrémentation en 20 paliers sur 2,5 secondes
    const steps = 20;
    const intervalTime = 120;
    let currentStep = 0;
    
    // Calcul de l'abonnement par palier pour la jauge globale d'en-tête
    const subsGainedPerStep = Math.round(stats.subscribersGained / steps);

    const interval = setInterval(() => {
      currentStep++;
      
      currentLikes = Math.round((stats.likes / steps) * currentStep);
      currentShares = Math.round((stats.shares / steps) * currentStep);
      
      likeEl.textContent = currentLikes.toLocaleString();
      shareEl.textContent = currentShares.toLocaleString();
      
      // Bouncer les jauges locales du post
      likeEl.parentElement.classList.add("stat-pop");
      shareEl.parentElement.classList.add("stat-pop");
      setTimeout(() => {
        likeEl.parentElement.classList.remove("stat-pop");
        shareEl.parentElement.classList.remove("stat-pop");
      }, 80);

      // INCREMENTER LA JAUGE D'ABONNÉS GLOBALE EN DIRECT !
      window.BelNewsState.changeSubscribersLive(subsGainedPerStep);
      
      // Animer l'en-tête d'abonnés globaux (effet de pop)
      const globalSubsValue = document.getElementById("val-subscribers");
      globalSubsValue.classList.add("stat-pop");
      setTimeout(() => {
        globalSubsValue.classList.remove("stat-pop");
      }, 80);

      // DÉCLENCHER LES IMPULSIONS 3D WEBGL DANS LE GRAPHE DE FOND !
      if (window.BelNews3D && window.BelNews3D.triggerNetworkPulse) {
        const pulseIntensity = Math.max(1, Math.round(stats.shares / 25));
        window.BelNews3D.triggerNetworkPulse(pulseIntensity * 0.1);
      }

      // Rendu successif des commentaires
      if (currentStep === 4 && stats.commentsList[0]) this.addSingleComment(commentsSec, stats.commentsList[0], commEl, 1);
      if (currentStep === 9 && stats.commentsList[1]) this.addSingleComment(commentsSec, stats.commentsList[1], commEl, 2);
      if (currentStep === 14 && stats.commentsList[2]) this.addSingleComment(commentsSec, stats.commentsList[2], commEl, 3);
      if (currentStep === 19 && stats.commentsList[3]) this.addSingleComment(commentsSec, stats.commentsList[3], commEl, 4);

      if (currentStep >= steps) {
        clearInterval(interval);
        callback(); // Lancer l'action suivante
      }
    }, intervalTime);
  },

  addSingleComment(container, comment, counterEl, countVal) {
    const el = document.createElement("div");
    el.className = "social-comment comment-slide-in";
    el.innerHTML = `
      <span class="comment-author">${comment.avatar} ${comment.handle}</span>
      <span class="comment-text">${comment.text}</span>
    `;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;

    counterEl.textContent = countVal;
    counterEl.parentElement.classList.add("stat-pop");
    setTimeout(() => {
      counterEl.parentElement.classList.remove("stat-pop");
    }, 80);
  },

  showDaySummary(scoringResult) {
    document.getElementById("summary-day-num").textContent = window.BelNewsState.currentDay;
    document.getElementById("summary-boss-speech").textContent = scoringResult.bossSpeech;
    
    document.getElementById("stat-day-subs-gained").textContent = "+" + scoringResult.subscribersGained.toLocaleString();
    document.getElementById("stat-day-rev-gained").textContent = "+" + scoringResult.revenueGained.toLocaleString() + " €";
    document.getElementById("stat-day-credibility").textContent = window.BelNewsState.credibility + "%";
    
    const level = window.BelNewsState.getCurrentLevel();
    const progressPercent = Math.min(100, Math.round((window.BelNewsState.subscribers / level.subscribersGoal) * 100));
    document.getElementById("stat-day-progress").textContent = progressPercent + "%";

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
          <span>Fiabilité : <strong class="${pub.article.reliability >= 50 ? 'color-success' : 'color-danger'}">${pub.article.reliability}%</strong></span>
        </div>
      `;
      pubList.appendChild(row);
    });

    document.getElementById("modal-day-summary").classList.remove("hidden");
  },

  showFiringScreen() {
    const letter = document.getElementById("firing-letter-text");
    
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

  showDebriefScreen() {
    const state = window.BelNewsState;
    
    const totalPubs = state.history.length;
    const putaclicCount = state.history.filter(item => item.titleType === 'putaclic').length;
    const sensationalismPercent = totalPubs > 0 ? Math.round((putaclicCount / totalPubs) * 100) : 0;
    const rigorPercent = 100 - sensationalismPercent;

    const sumProximity = state.history.reduce((sum, item) => sum + item.proximity, 0);
    const avgProximity = totalPubs > 0 ? Math.round(sumProximity / totalPubs) : 0;

    document.getElementById("val-debrief-sensationalism").textContent = sensationalismPercent + "%";
    document.getElementById("radar-sensationalism").style.setProperty("--val-width", sensationalismPercent + "%");
    
    document.getElementById("val-debrief-rigor").textContent = rigorPercent + "%";
    document.getElementById("radar-rigor").style.setProperty("--val-width", rigorPercent + "%");

    document.getElementById("val-debrief-proximity").textContent = avgProximity + "%";
    document.getElementById("radar-proximity").style.setProperty("--val-width", avgProximity + "%");

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

    const ignoredContainer = document.getElementById("debrief-ignored-list");
    ignoredContainer.innerHTML = "";

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
    this.spawnVictoryConfetti();
  },

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
      setTimeout(() => particle.remove(), 4000);
    }
  }
};
