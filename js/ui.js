// Contrôleur de l'Interface Utilisateur (UI) de BelNews v0.3
window.BelNewsUI = {
  // Liste des articles placés sur la Une : [ { slotId, article, titleType: 'sobre' | 'putaclic' } ]
  selectedArticles: [],
  // Liste locale des articles du jour reçus
  dailyArticlesPool: [],

  // Fausses publicités satiriques belges intercalées
  satiricalAds: [
    { sponsor: "Maison de la Fricadelle S.A.", avatar: "🍟", text: "De la viande de qualité non identifiée pour vos frites du samedi soir. 10 achetées, 1 offerte !", buttonText: "S'empiffrer", image: "assets/media/incident.png" },
    { sponsor: "Brasserie du Houblon Sacré", avatar: "🍺", text: "Promo : La caisse de Triple Karmeliet à prix cassé. Idéal pour oublier vos impôts et la météo !", buttonText: "Commander", image: "assets/media/tech.png" },
    { sponsor: "Le Roi de la Graisse de Bœuf", avatar: "🐄", text: "Blanc de bœuf raffiné pour friteries de prestige. Faites croustiller votre vie !", buttonText: "Acheter en gros", image: "assets/media/incident.png" },
    { sponsor: "Institut des Diplômes Express", avatar: "🎓", text: "Marre d'échouer à l'ULiège ? Obtenez votre Master en frites appliquées en 48h chrono !", buttonText: "Tricher légalement", image: "assets/media/tech.png" }
  ],

  // Notifications smartphone push amusantes
  satiricalNotifs: [
    { icon: "💬", title: "Maman", text: "N'oublie pas de ramener un paquet de frites de chez Antoine. Et ne sois pas trop cynique à la télé.", time: "À l'instant" },
    { icon: "🚂", title: "SNCB Info", text: "Le train Bruxelles-Liège de 08h12 est supprimé en raison de feuilles humides sur les voies. Bon courage.", time: "2 min" },
    { icon: "💸", title: "SPF Finances", text: "Votre déclaration d'impôts est disponible. Préparez vos mouchoirs.", time: "5 min" },
    { icon: "⚡", title: "Electrabel", text: "Tarif de nuit activé. C'est le moment d'allumer vos machines à laver pour économiser 2 centimes.", time: "10 min" },
    { icon: "👥", title: "Belgogram", text: "@user_belge vous a tagué : 'BelNews raconte encore n'importe quoi pour le buzz !'", time: "12 min" }
  ],

  init() {
    this.bossWidget = document.getElementById("boss-chat-widget");
    this.bossToggle = document.getElementById("boss-chat-header");
    this.btnPublish = document.getElementById("btn-publish");
    this.bossImg = document.getElementById("boss-character-img");

    // Écouteur pour rétracter/déployer le chat du patron
    this.bossToggle.addEventListener("click", () => {
      this.bossWidget.classList.toggle("chat-collapsed");
    });

    // Liaison du State
    window.BelNewsState.subscribe(state => {
      this.renderDashboard(state);
      this.updateBossExpression(state);
    });
    
    this.setupDragAndDrop();
    this.setupButtonEvents();
    this.startPhoneClock();
  },

  // Faire tourner l'horloge du smartphone simulé
  startPhoneClock() {
    const clockEl = document.getElementById("phone-clock");
    if (!clockEl) return;
    
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      clockEl.textContent = `${hours}:${minutes}`;
    };
    
    updateClock();
    setInterval(updateClock, 30000); // MAJ toutes les 30s
  },

  // Modifier l'avatar et l'expression de Jean-Jacques selon le score
  updateBossExpression(state) {
    if (!this.bossImg) return;
    
    // Angry: pression du patron élevée (> 65%)
    if (state.bossPressure >= 65) {
      this.bossImg.src = "assets/avatars/boss_angry.png";
    }
    // Crying: crédibilité en ruines (< 35%)
    else if (state.credibility < 35) {
      this.bossImg.src = "assets/avatars/boss_crying.png";
    }
    // Happy: beaucoup d'abonnés gagnés
    else if (state.subscribers >= state.getCurrentLevel().subscribersGoal * 0.8) {
      this.bossImg.src = "assets/avatars/boss_happy.png";
    }
    // Standard Neutral
    else {
      this.bossImg.src = "assets/avatars/boss_neutral.png";
    }
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

    // Pression
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
    
    const state = window.BelNewsState;
    const level = state.getCurrentLevel();
    const currentDay = state.currentDay;
    
    // Calcul de la cible du jour
    const dailyTargetBase = Math.round(level.subscribersGoal / level.days);
    const dailyTarget = Math.round(dailyTargetBase * (1 + (currentDay - 1) * 0.15));

    // Consigne ultra explicite de Jean-Jacques
    let objectiveText = `JOUR ${currentDay} sur ${level.days} (${level.title}). Il me faut exactement **+${dailyTarget.toLocaleString()} abonnés** aujourd'hui ! Et fais attention à notre crédibilité : si elle tombe à zéro, les avocats ferment le journal. Allez gamin, au clic !`;
    
    if (currentDay === 1) {
      objectiveText = `Bienvenue stagiaire. Ton rôle : **${level.title}**. L'objectif final de ce niveau est de réunir **${level.subscribersGoal.toLocaleString()} abonnés** en ${level.days} jours. Pour aujourd'hui, ramène au moins **+${dailyTarget.toLocaleString()} abonnés** en publiant 3 unes putaclics, sans te faire choper par les fact-checkers !`;
    }

    this.displayBossMessage(objectiveText);
    
    // Reset phone notifications count
    const bellBadge = document.getElementById("phone-bell-badge");
    if (bellBadge) bellBadge.textContent = "0";

    // Vider le Belgogram au matin
    const socialFeed = document.getElementById("social-feed-list");
    socialFeed.innerHTML = `
      <div id="social-placeholder">
        <div class="placeholder-social-icon">💬</div>
        <p>Le fil social s'activera dès la publication de votre journal.</p>
      </div>
    `;
  },

  // Rendu de l'illustration (Photo, Vidéo, GIF) en exploitant nos vrais cartoon PNG
  getMediaHTML(article) {
    const imageUrl = article.mediaTheme;
    
    if (article.mediaType === "photo") {
      return `
        <div class="media-photo" style="background-image: url('${imageUrl}');">
          <div class="media-photo-overlay">${article.title}</div>
        </div>
      `;
    } else if (article.mediaType === "video") {
      return `
        <div class="media-video" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;">
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
        <div class="media-gif" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center; border: 2px dashed var(--color-primary);">
          <span class="gif-badge">GIF</span>
          <span style="font-size: 2.8rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));">${article.emoji}</span>
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
      const angleX = (yc - y) / 12; 
      const angleY = (x - xc) / 12; 
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.boxShadow = `${-angleY * 1.5}px ${angleX * 1.5}px 25px rgba(255, 45, 85, 0.25)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.boxShadow = "var(--box-shadow)";
    });
  },

  // Rendu de l'Inbox
  renderInbox() {
    const listContainer = document.getElementById("inbox-cards-list");
    listContainer.innerHTML = "";
    
    const available = this.dailyArticlesPool.filter(art => 
      !this.selectedArticles.some(sel => sel.article.id === art.id)
    );

    document.getElementById("inbox-counter").textContent = available.length;

    if (available.length === 0) {
      listContainer.innerHTML = `<div class="empty-list-text text-center" style="margin-top: 50px;">Aucune dépêche en attente. Tout est sur la Une ou mis de côté.</div>`;
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
      
      this.apply3DTilt(card);

      // Drag & Drop
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

  // Rendu de la Une du jour
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
              <label>Traitement médiatique :</label>
              <div class="title-select-container">
                
                <div class="title-option ${selection.titleType === 'sobre' ? 'selected' : ''}" onclick="window.BelNewsUI.setSlotTitleType(${slotId}, 'sobre')">
                  <input type="radio" name="title-type-${slotId}" ${selection.titleType === 'sobre' ? 'checked' : ''}>
                  <div>
                    <span class="title-text-type type-sobre">Sobre & Factuel</span>
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
    document.getElementById("boss-message-text").innerHTML = message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
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

  // Publication séquentielle et réactions dynamiques WebGL 3D
  renderSocialFeed(scoringResult) {
    const feedContainer = document.getElementById("social-feed-list");
    feedContainer.innerHTML = ""; 

    // Lancer la publication en chaîne sur le smartphone
    this.publishPostSequentially(scoringResult.posts, 0, () => {
      // Une fois terminé, afficher la modale récapitulative
      setTimeout(() => {
        this.showDaySummary(scoringResult);
      }, 3500);
      
      this.displayBossMessage(scoringResult.bossSpeech);
    });
  },

  // Publier un post, puis intercaler une pub ou déclencher une notification push
  publishPostSequentially(posts, index, onComplete) {
    if (index >= posts.length) {
      onComplete();
      return;
    }

    const post = posts[index];
    const feedContainer = document.getElementById("social-feed-list");
    
    // 1. Déclencher une fausse notification Push en haut de l'écran du smartphone
    setTimeout(() => {
      const randomNotif = this.satiricalNotifs[Math.floor(Math.random() * this.satiricalNotifs.length)];
      this.triggerPhoneNotification(randomNotif);
    }, 500);

    // 2. Création de la carte post social Belgogram
    const socialPost = document.createElement("article");
    socialPost.className = "social-post post-social-anim";
    
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

    const placeholder = document.getElementById("social-placeholder");
    if (placeholder) placeholder.remove();

    feedContainer.appendChild(socialPost);
    feedContainer.scrollTop = feedContainer.scrollHeight;

    // Lancer le défilement de statistiques
    this.animateSinglePostCounters(article.id, post.stats, () => {
      // 3. Intercaler une fausse publicité satirique de temps en temps
      if (Math.random() > 0.3) {
        setTimeout(() => {
          this.injectSatiricalAd(feedContainer);
          
          setTimeout(() => {
            this.publishPostSequentially(posts, index + 1, onComplete);
          }, 1000);
        }, 800);
      } else {
        setTimeout(() => {
          this.publishPostSequentially(posts, index + 1, onComplete);
        }, 1200);
      }
    });
  },

  // Injecter un encart pub humoristique belge dans le smartphone
  injectSatiricalAd(container) {
    const adData = this.satiricalAds[Math.floor(Math.random() * this.satiricalAds.length)];
    const adCard = document.createElement("div");
    adCard.className = "social-ad";
    adCard.innerHTML = `
      <span class="social-ad-badge">Sponsorisé</span>
      <div class="social-ad-header">
        <span class="social-ad-avatar">${adData.avatar}</span>
        <span class="social-ad-sponsor">${adData.sponsor}</span>
      </div>
      <div class="social-ad-content">
        <div class="social-ad-media" style="background-image: url('${adData.image}'); background-size: cover; background-position: center; opacity: 0.85;">
          📢
        </div>
        <p>${adData.text}</p>
        <a href="#" class="social-ad-btn" onclick="event.preventDefault();">${adData.buttonText}</a>
      </div>
    `;
    container.appendChild(adCard);
    container.scrollTop = container.scrollHeight;
  },

  // Simuler une alerte Push qui descend du haut du téléphone
  triggerPhoneNotification(notif) {
    const existing = document.querySelector(".phone-notification");
    if (existing) existing.remove();

    const notifEl = document.createElement("div");
    notifEl.className = "phone-notification";
    notifEl.innerHTML = `
      <div class="notif-app-icon">${notif.icon}</div>
      <div class="notif-body">
        <div class="notif-title">
          <span>${notif.title}</span>
          <span class="notif-time">${notif.time}</span>
        </div>
        <div class="notif-desc">${notif.text}</div>
      </div>
    `;
    
    const phoneScreen = document.getElementById("phone-screen");
    phoneScreen.appendChild(notifEl);

    // Faire sonner le badge
    const bellBadge = document.getElementById("phone-bell-badge");
    if (bellBadge) {
      const current = parseInt(bellBadge.textContent) + 1;
      bellBadge.textContent = current;
      bellBadge.parentElement.classList.add("stat-pop");
      setTimeout(() => bellBadge.parentElement.classList.remove("stat-pop"), 300);
    }

    // Animation d'entrée
    setTimeout(() => {
      notifEl.classList.add("show-notif");
    }, 100);

    // Effacement automatique après 4s
    setTimeout(() => {
      notifEl.classList.remove("show-notif");
      setTimeout(() => notifEl.remove(), 400);
    }, 4500);
  },

  // Animer compteurs d'abonnés globaux et likes d'un seul post de manière synchrone
  animateSinglePostCounters(articleId, stats, callback) {
    const likeEl = document.querySelector(`#like-${articleId} .action-val`);
    const shareEl = document.querySelector(`#share-${articleId} .action-val`);
    const commEl = document.querySelector(`#comment-icon-${articleId} .action-val`);
    const commentsSec = document.getElementById(`comments-section-${articleId}`);
    
    let currentLikes = 0;
    let currentShares = 0;
    
    const steps = 20;
    const intervalTime = 120;
    let currentStep = 0;
    const subsGainedPerStep = Math.round(stats.subscribersGained / steps);

    const interval = setInterval(() => {
      currentStep++;
      
      currentLikes = Math.round((stats.likes / steps) * currentStep);
      currentShares = Math.round((stats.shares / steps) * currentStep);
      
      likeEl.textContent = currentLikes.toLocaleString();
      shareEl.textContent = currentShares.toLocaleString();
      
      likeEl.parentElement.classList.add("stat-pop");
      shareEl.parentElement.classList.add("stat-pop");
      setTimeout(() => {
        likeEl.parentElement.classList.remove("stat-pop");
        shareEl.parentElement.classList.remove("stat-pop");
      }, 80);

      // INCREMENTER LA JAUGE D'ABONNÉS GLOBALE EN DIRECT !
      window.BelNewsState.changeSubscribersLive(subsGainedPerStep);
      
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
        callback(); 
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
      Malgré nos multiples rappels sur la nécessité absolue de générer du trafic et de satisfaire les annonceurs, les indicateurs d'abonnés de votre niveau de rôle (${window.BelNewsState.getCurrentLevel().title}) n'ont pas atteint les seuils minimums de rentabilité fixés par la direction.<br><br>
      Votre accès aux bases de données est révoqué. Nous vous souhaitons une meilleure continuation dans un secteur moins exigeant.<br><br>
      Le Service RH.
    `;

    document.getElementById("boss-firing-speech").textContent = `"${window.BelNewsPatron.firing.bossLastWord}"`;
    document.getElementById("modal-firing").classList.remove("hidden");
  },

  // Analyse didactique de l'impact des choix éditoriaux du joueur (Style Theme Hospital)
  generatePedagogicalImpact(item, titleType) {
    const isPutaclic = titleType === 'putaclic';
    
    const impacts = {
      "pol-1": isPutaclic 
        ? "En titrant sur la 'faillite de l'État', vous avez poussé des milliers de Belges à vider leurs comptes d'épargne pour acheter de l'or et des fricadelles. Le Premier ministre a dû faire un JT de clarification. Niveau éthique : désastreux."
        : "Votre titre sobre a ennuyé tout le monde. Les citoyens ont ignoré la réunion, laissant les lobbys dicter la taxation du houblon en toute discrétion. Mais au moins, pas de panique bancaire.",
      
      "fd-1": isPutaclic
        ? "Le titre 'scandale de la frite' a déclenché une manifestation nationale pour le droit à la graisse de bœuf. Les friteries de Namur ont dû être placées sous protection policière. Le suspect a été érigé en héros Robin des Bois."
        : "Traitement factuel d'un vol mineur. L'affaire est résolue dans le calme. Les Namurois continuent de manger leurs frites en paix.",
        
      "clim-1": isPutaclic
        ? "Panique générale ! Les habitants de Wallonie ont acheté toutes les barques et gilets de sauvetage de Decathlon. Les routes ardennaises ont été saturées par des exodes injustifiés. L'IRM vous envoie la facture de la cellule de crise."
        : "Information claire. Les résidents des zones inondables ont mis leurs biens à l'abri calmement. Zéro blessé, zéro buzz.",
        
      "mon-1": isPutaclic
        ? "Votre insinuation sur le Roi a déclenché une polémique constitutionnelle. Des députés ont demandé l'abdication, croyant que le souverain avait insulté la Flandre. Le Palais a dû publier un communiqué officiel."
        : "La visite royale est passée inaperçue. Le Roi est content, les étudiants en mécanique aussi, votre patron beaucoup moins.",
        
      "fake-1": isPutaclic
        ? "Vous avez répandu la rumeur Coca-Cola / Manneken Pis. Des militants anti-capitalistes ont vandalisé la statue en y versant du soda. Une crise diplomatique avec Atlanta a été évitée de justesse."
        : "Vous avez refusé de relayer cette fake news toxique. Manneken Pis continue d'uriner de l'eau claire sans logo sur son costume.",
        
      "san-1": isPutaclic
        ? "Votre titre complotiste a fait chuter le taux de vaccination de 15% en Wallonie. Une épidémie de grippe a surchargé les urgences de Liège. Félicitations, vous avez réintroduit des virus du Moyen-Äge pour des clics."
        : "Information médicale rigoureuse. Les personnes à risque se vaccinent sereinement chez leur pharmacien. La santé publique vous remercie.",
        
      "sp-1": isPutaclic
        ? "L'Italie a boycotté le chocolat belge pendant 24h suite à vos provocations. Le sélectionneur a dû s'excuser. Mais le taux d'engagement a battu des records !"
        : "Rapport de match classique. Les supporters fêtent la victoire avec modération dans les cafés de Bruxelles.",
        
      "eco-1": isPutaclic
        ? "En parlant de 'hausse secrète', vous avez déclenché une grève sauvage à la SNCB. Aucun train n'a roulé pendant deux jours, bloquant la moitié du pays. Votre patron a pris sa voiture."
        : "Hausse tarifaire expliquée de manière économique. Les voyageurs râlent mais achètent leurs abonnements. Aucun train de plus n'est en retard.",
        
      "fake-2": isPutaclic
        ? "La fausse étude Triple Karmeliet a provoqué des brûlures au second degré chez des centaines d'étudiants ivres sur la plage d'Ostende. Les hôpitaux belges ont soigné des comas éthyliques et des insolations simultanées."
        : "Vous avez censuré cette escroquerie médicale. Les pharmaciens continuent de vendre de la crème solaire, et les brasseurs de la bière.",
        
      "int-1": isPutaclic
        ? "Le 'blocus de Bruxelles' a effrayé les fonctionnaires européens qui ont fait du télétravail pendant une semaine. La vente de sandwiches au quartier Schuman s'est effondrée de 80%."
        : "Les tracteurs ont manifesté dans les zones prévues. L'accord international se négocie lentement dans le jargon diplomatique.",
        
      "cult-1": isPutaclic
        ? "Des milliers de festivaliers ont envahi Dour six mois à l'avance suite à vos 'révélations secrètes', campant dans la boue et le froid. Les organisateurs sont furieux."
        : "La programmation est accueillie positivement par les mélomanes. Les préventes se déroulent normalement.",
        
      "tech-1": isPutaclic
        ? "Votre annonce de 'panne géante' a créé un vent de panique. Les Belges ont dévalisé les distributeurs de billets, provoquant une vraie rupture de cash dans les banques de Liège. Payconiq a porté plainte."
        : "La panne a été corrigée en deux heures dans le calme. Les paiements mobiles ont repris sans incident.",
        
      "pol-2": isPutaclic
        ? "Le titre 'scandale de la paresse' a jeté le discrédit sur tous les fonctionnaires communaux de Wallonie. Des citoyens en colère ont jeté des frites froides sur les fenêtres de la mairie de Chaudfontaine."
        : "Projet pilote de 4 jours décrit de manière objective. Le débat sur le temps de travail avance de manière constructive en Belgique.",
        
      "fd-2": isPutaclic
        ? "En parlant de 'monstre enragé', vous avez terrifié le centre de Liège. Les commerçants du Carré ont fermé leurs grilles, et des chasseurs amateurs ont patrouillé avec des fusils de chasse en pleine ville."
        : "Le sanglier égaré a été capturé sous l'œil amusé de quelques Liégeois matinals.",
        
      "fake-3": isPutaclic
        ? "La rumeur d'eau empoisonnée a provoqué une émeute dans les supermarchés de Mons. Les rayons d'eau minérale ont été dévalisés en deux heures, et des bagarres ont éclaté pour des bouteilles de Spa Reine."
        : "Vous avez bloqué cette fake news criminelle. L'eau montoise est restée parfaitement potable et les esprits calmes.",
        
      "eco-2": isPutaclic
        ? "Votre titre insinuant sur la 'fortune cachée' a provoqué des contrôles fiscaux sauvages et des blocages syndicaux devant les Delhaize franchisés. Les gérants n'ont pas apprécié."
        : "Article financier équilibré sur la franchise. Les milieux d'affaires analysent les résultats du groupe.",
        
      "cult-2": isPutaclic
        ? "Ixelles a été prise d'assaut par des pilleurs de grenier armés de détecteurs de métaux à la recherche de toiles de Magritte. Plusieurs maisons ont été cambriolées."
        : "La découverte artistique est célébrée dans les musées. La toile surréaliste est exposée en toute sécurité.",
        
      "clim-2": isPutaclic
        ? "Votre titre catastrophiste a déclenché une pénurie de climatiseurs et de bières d'abbaye dans tout le pays. Des embouteillages monstres se sont formés vers la côte belge."
        : "Alerte chaleur classique avec rappels de s'hydrater correctement. Les seniors d'Uccle sont restés au frais.",
        
      "int-2": isPutaclic
        ? "Le titre 'guerre atomique' a provoqué des appels de détresse aux centres de secours. Des pacifistes ont bloqué la base militaire de Florennes. Une panique inutile."
        : "Exercice de routine de l'OTAN signalé de manière professionnelle. Les avions de chasse s'entraînent sans incident.",
        
      "mon-2": isPutaclic
        ? "La rumeur sur le trône a provoqué une tempête médiatique dans la presse people européenne. La princesse a dû démentir publiquement pour calmer le jeu."
        : "Rapport sobre sur l'anniversaire d'Elisabeth. La monarchie belge préserve sa dignité discrète.",
        
      "sp-2": isPutaclic
        ? "Des soupçons de dopage technologique ont été propagés par des internautes suite à votre titre 'inhumain'. La fédération de cyclisme a dû inspecter le vélo de Remco."
        : "Félicitations méritées pour Remco Evenepoel. Le cyclisme belge fête son champion national dans les règles de l'art.",
        
      "tech-2": isPutaclic
        ? "En titrant 'la fin des diplômes', vous avez incité des centaines d'étudiants à tricher massivement avec ChatGPT lors des examens à Liège. L'université a dû annuler les épreuves."
        : "Compte-rendu équilibré sur l'IA dans l'enseignement. Les profs adaptent leurs méthodes pédagogiques intelligemment.",
        
      "fake-4": isPutaclic
        ? "Les réservations d'hôtels et de gîtes à Wavre ont été annulées en masse après votre annonce de fermeture de Walibi. Le parc estime les pertes financières à plusieurs dizaines de milieux d'euros."
        : "Vous avez rejeté la rumeur. Walibi Belgium continue d'accueillir ses visiteurs pour des looping aquatiques.",
        
      "pol-3": isPutaclic
        ? "Votre alerte sur le 'piège caché' a relancé les tensions sociales. Des manifestations contre la vie chère ont éclaté à Bruxelles. Les syndicats ont bloqué la gare centrale."
        : "Réduction fiscale expliquée objectivement. Les ménages calculent leurs économies d'énergie sur leur facture de juin."
    };
    
    return impacts[item.id] || (isPutaclic 
      ? "Votre traitement sensationnel a gonflé l'audience mais a alimenté le cynisme ambiant et la polarisation politique en Belgique."
      : "Votre traitement factuel a informé correctement les citoyens belges, préservant la cohésion sociale au détriment des revenus publicitaires.");
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

    // Remplissage dynamique des impacts pédagogiques (Style Theme Hospital)
    const impactsList = document.getElementById("debrief-impacts-list");
    impactsList.innerHTML = "";
    
    state.history.forEach(item => {
      const impactText = this.generatePedagogicalImpact(item, item.titleType);
      const isPutaclic = item.titleType === 'putaclic';
      
      const itemEl = document.createElement("div");
      itemEl.className = "debrief-impact-item";
      itemEl.innerHTML = `
        <div class="debrief-impact-header">
          <span class="debrief-impact-title">${item.titleText}</span>
          <span class="badge-rules ${isPutaclic ? 'type-putaclic' : 'type-sobre'}">${isPutaclic ? 'Sensationnel' : 'Sobre'}</span>
        </div>
        <p class="debrief-impact-desc">${impactText}</p>
      `;
      impactsList.appendChild(itemEl);
    });

    // Ignored news
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
