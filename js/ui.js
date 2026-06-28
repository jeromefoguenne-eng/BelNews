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
    this.setupContactStories(); // Setup story profile viewer
  },

  contactProfiles: {
    kris: {
      name: "Kris (Frite Citoyenne)",
      handle: "@kris_frite",
      avatar: "🍟",
      bio: "Militant de la frite libre et du vrai blanc de bœuf à Liège. Résistance face aux taxes sur l'huile de friture !",
      posts: [
        "On veut nous taxer notre graisse de bœuf nationale ! Mobilisation générale de toutes les friteries ! 🍟✊",
        "Voler 50 kg de graisse de bœuf à Namur ? C'est pas un voleur, c'est un combattant de la liberté !"
      ]
    },
    remco: {
      name: "Remco Evenepoel",
      handle: "@remco_cycling",
      avatar: "🚴",
      bio: "Coureur professionnel. Champion de Belgique. Toujours plus vite sur le vélo.",
      posts: [
        "Victoire méritée sur le tour ! Merci à tous pour les encouragements, le vélo belge est au sommet ! 🚴‍♂️🇧🇪",
        "Certains m'accusent de dopage mécanique... Je rigole ! C'est la force de la frite dans les jambes !"
      ]
    },
    phil: {
      name: "Roi Philippe",
      handle: "@phil_belgium",
      avatar: "👑",
      bio: "Souverain des Belges. J'aime les frites, les visites d'écoles et la cohésion nationale. 🇧🇪",
      posts: [
        "Très fier de visiter les ateliers de mécanique à Courtrai. Le néerlandais avance bien, vive la Belgique ! 🇧🇪👑",
        "Un excellent dimanche en famille. Nous avons mangé des chicons au gratin faits maison."
      ]
    },
    dour: {
      name: "Dour Festival",
      handle: "@dour_fest",
      avatar: "🎵",
      bio: "5 jours d'amour, de musique et de boue. DOUUUUR !",
      posts: [
        "La programmation de cette année va être folle ! Vous êtes prêts pour le camping dans la boue ? 🎵🏕️",
        "Il paraît que Dour ouvre 6 mois à l'avance... C'est faux, mais vous pouvez déjà monter votre tente !"
      ]
    },
    chantal: {
      name: "Chantal d'Uccle",
      handle: "@chantal_uccle",
      avatar: "👵",
      bio: "Résidente d'Uccle. Aime les chiens, le calme et les valeurs traditionnelles.",
      posts: [
        "Il fait 45°C dehors, c'est insupportable. Heureusement que la terrasse de mon club de tennis est ombragée. ☀️🎾",
        "Des pyramides sous Charleroi ? Ma femme de ménage m'a dit qu'il y avait beaucoup de poussière là-bas, c'est sûrement lié."
      ]
    }
  },

  setupContactStories() {
    const stories = document.querySelectorAll("#phone-stories-container .story-circle");
    const profileView = document.getElementById("phone-profile-view");
    const closeBtn = document.getElementById("profile-close-btn");
    
    if (!profileView || !closeBtn) return;
    
    stories.forEach(story => {
      story.addEventListener("click", () => {
        const title = story.getAttribute("title");
        let key = null;
        if (title.includes("Kris")) key = "kris";
        else if (title.includes("Remco")) key = "remco";
        else if (title.includes("Philippe") || title.includes("Phil")) key = "phil";
        else if (title.includes("Dour")) key = "dour";
        else if (title.includes("Chantal")) key = "chantal";
        
        if (key && this.contactProfiles[key]) {
          const profile = this.contactProfiles[key];
          
          document.getElementById("profile-user-name").textContent = profile.name;
          document.getElementById("profile-user-handle").textContent = profile.handle;
          document.getElementById("profile-user-avatar").textContent = profile.avatar;
          document.getElementById("profile-user-bio").textContent = profile.bio;
          
          const postsList = document.getElementById("profile-user-posts");
          postsList.innerHTML = "";
          
          profile.posts.forEach(postText => {
            const postEl = document.createElement("div");
            postEl.className = "profile-post";
            postEl.innerHTML = `
              <div class="profile-post-header">
                <span class="profile-post-avatar">${profile.avatar}</span>
                <div class="profile-post-meta">
                  <span class="profile-post-name">${profile.name}</span>
                  <span class="profile-post-handle">${profile.handle}</span>
                </div>
              </div>
              <p class="profile-post-text">${postText}</p>
            `;
            postsList.appendChild(postEl);
          });
          
          profileView.classList.remove("hidden");
        } else {
          // If they click on BelNews story (reset/close)
          profileView.classList.add("hidden");
        }
      });
    });
    
    closeBtn.addEventListener("click", () => {
      profileView.classList.add("hidden");
    });
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

    // Consigne ultra explicite et thématique de Jean-Jacques
    const baseBriefing = window.BelNewsPatron.dayBriefings[currentDay] || "Allez gamin, au clic !";
    const objectiveText = `${baseBriefing}<br><br><strong>Objectif du jour :</strong> Générer au moins **+${dailyTarget.toLocaleString()} abonnés** (Crédibilité > 0%).`;

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
    
    if (!likeEl || !shareEl || !commEl || !commentsSec) {
      console.warn(`DOM Elements for article ${articleId} not found, skipping counters animation.`);
      callback();
      return;
    }

    let currentLikes = 0;
    let currentShares = 0;
    
    const steps = 20;
    const intervalTime = 120;
    let currentStep = 0;
    const subsGainedPerStep = Math.round((stats.subscribersGained || 0) / steps);

    let interval;
    interval = setInterval(() => {
      currentStep++;
      
      currentLikes = Math.round(((stats.likes || 0) / steps) * currentStep);
      currentShares = Math.round(((stats.shares || 0) / steps) * currentStep);
      
      likeEl.textContent = currentLikes.toLocaleString();
      shareEl.textContent = currentShares.toLocaleString();
      
      if (likeEl.parentElement) likeEl.parentElement.classList.add("stat-pop");
      if (shareEl.parentElement) shareEl.parentElement.classList.add("stat-pop");
      setTimeout(() => {
        if (likeEl.parentElement) likeEl.parentElement.classList.remove("stat-pop");
        if (shareEl.parentElement) shareEl.parentElement.classList.remove("stat-pop");
      }, 80);

      // INCREMENTER LA JAUGE D'ABONNÉS GLOBALE EN DIRECT !
      window.BelNewsState.changeSubscribersLive(subsGainedPerStep);
      
      const globalSubsValue = document.getElementById("val-subscribers");
      if (globalSubsValue) {
        globalSubsValue.classList.add("stat-pop");
        setTimeout(() => {
          globalSubsValue.classList.remove("stat-pop");
        }, 80);
      }

      // DÉCLENCHER LES IMPULSIONS 3D WEBGL DANS LE GRAPHE DE FOND !
      if (window.BelNews3D && window.BelNews3D.triggerNetworkPulse) {
        const pulseIntensity = Math.max(1, Math.round((stats.shares || 0) / 25));
        window.BelNews3D.triggerNetworkPulse(pulseIntensity * 0.1);
      }

      // Rendu successif des commentaires
      if (stats.commentsList) {
        if (currentStep === 4 && stats.commentsList[0]) this.addSingleComment(commentsSec, stats.commentsList[0], commEl, 1);
        if (currentStep === 9 && stats.commentsList[1]) this.addSingleComment(commentsSec, stats.commentsList[1], commEl, 2);
        if (currentStep === 14 && stats.commentsList[2]) this.addSingleComment(commentsSec, stats.commentsList[2], commEl, 3);
        if (currentStep === 19 && stats.commentsList[3]) this.addSingleComment(commentsSec, stats.commentsList[3], commEl, 4);
      }

      if (currentStep >= steps) {
        clearInterval(interval);
        callback(); 
      }
    }, intervalTime);
  },

  addSingleComment(container, comment, counterEl, countVal) {
    if (!container || !comment || !counterEl) return;
    const el = document.createElement("div");
    el.className = "social-comment comment-slide-in";
    el.innerHTML = `
      <span class="comment-author">${comment.avatar} ${comment.handle}</span>
      <span class="comment-text">${comment.text}</span>
    `;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;

    counterEl.textContent = countVal;
    if (counterEl.parentElement) {
      counterEl.parentElement.classList.add("stat-pop");
      setTimeout(() => {
        counterEl.parentElement.classList.remove("stat-pop");
      }, 80);
    }
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

  generatePedagogicalImpact(item, titleType) {
    const isPutaclic = titleType === 'putaclic';
    
    const impacts = {
      // Jour 1
      "sci-1-1": isPutaclic 
        ? "Vous avez transformé une découverte d'exoplanète en canular d'aliens, discréditant le travail de l'ULiège pour des clics faciles."
        : "Sujet scientifique rigoureux. Peu de clics, mais la respectabilité académique est sauve.",
      "sp-1-1": isPutaclic 
        ? "En titrant 'derby de la haine', vous attisez les tensions violentes entre supporters de Liège et Charleroi pour un buzz rapide."
        : "Simple compte-rendu sportif. Rigueur préservée.",
      "fd-1-1": isPutaclic 
        ? "Vous dramatisez à l'extrême un incendie accidentel, générant une inquiétude disproportionnée."
        : "Information calme sur un fait divers. Utile et sobre.",
      "fd-1-2": isPutaclic 
        ? "Le titre 'bain de sang' transforme un drame humain en spectacle voyeuriste."
        : "Homicide rapporté de manière factuelle.",
      "fd-1-3": isPutaclic 
        ? "Suggérer un enlèvement d'adolescente sème inutilement la panique chez les parents de Mons."
        : "Diffusion responsable de l'avis de recherche officiel.",
      "nat-1-1": isPutaclic 
        ? "Traiter un bébé panda roux de 'monstre biologique' déçoit les lecteurs et tourne le zoo au ridicule."
        : "Célébration mignonne d'une naissance rare à Pairi Daiza.",
        
      // Jour 2
      "int-2-1": isPutaclic 
        ? "Dramatisation de la catastrophe lointaine sans aucun impact local belge."
        : "Rapport international factuel et important, bien que délaissé par l'audience locale.",
      "int-2-2": isPutaclic 
        ? "Vous titrez de manière gore sur la guerre civile sans expliquer le contexte géopolitique."
        : "Journalisme de guerre rigoureux mais ignoré.",
      "int-2-3": isPutaclic 
        ? "Sensationnalisme sur la famine sahélienne n'apportant aucune analyse de fond."
        : "Sujet humanitaire indispensable traité avec sérieux.",
      "bel-2-1": isPutaclic 
        ? "Une rixe lycéenne requalifiée en 'guerre des gangs', créant un sentiment d'insécurité immédiat à Liège."
        : "Bilan neutre d'une altercation publique.",
      "bel-2-2": isPutaclic 
        ? "Parler d'un ring 'inondé de sang' terrifie les usagers et bloque virtuellement la capitale."
        : "Annonce factuelle d'un accident de circulation.",
      "bel-2-3": isPutaclic 
        ? "Sensationalisme excessif sur un drame familial pour indigner les parents belges."
        : "Sauvetage d'enfant rapporté sans voyeurisme.",
        
      // Jour 3
      "gov-3-1": isPutaclic 
        ? "Dénigrer les profs en les traitant de faignants sabote tout dialogue démocratique sur la réforme."
        : "Cadrage biaisé visant à plaire au gouvernement pour préserver nos subventions.",
      "gov-3-2": isPutaclic 
        ? "Assimiler une grève syndicale à une prise d'otages d'élèves attise la haine anti-syndicale."
        : "Cadrage hostile à la manifestation, relayant uniquement les plaintes des parents.",
      "gov-3-3": isPutaclic 
        ? "Sondage bidon monté en épingle pour simuler un consensus imaginaire des élèves."
        : "Désinformation statistique défendant la réforme scolaire impopulaire.",
      "gov-3-4": isPutaclic 
        ? "Parler de 'marée rouge' envahissant Bruxelles associe la grève à une menace violente."
        : "Couverture objective d'une manifestation nationale enseignante majeure.",
      "gov-3-5": isPutaclic 
        ? "Terminologie belliqueuse suggérant que les jeunes détruisent l'école."
        : "Reportage correct sur la solidarité entre étudiants et enseignants.",
      "gov-3-6": isPutaclic 
        ? "Biais agressif pour discréditer la réforme Boulanger sans nuances."
        : "Paroles données aux directeurs d'écoles sur leurs difficultés concrètes.",
        
      // Jour 4
      "cli-4-1": isPutaclic 
        ? "Vendre 45°C comme un 'été de rêve' incite à l'exposition dangereuse et nie l'urgence écologique."
        : "Minimisation délibérée du réchauffement pour préserver les intérêts pétroliers de notre actionnaire.",
      "cli-4-2": isPutaclic 
        ? "Cadrage récréatif de la chaleur pour ignorer le problème environnemental."
        : "Esthétisation du soleil occultant la crise climatique majeure.",
      "cli-4-3": isPutaclic 
        ? "Désinformation historique prétendant que la hausse actuelle est normale, rassurant les pollueurs."
        : "Relais de thèses climatosceptiques réfutées pour nier la responsabilité humaine.",
      "cli-4-4": isPutaclic 
        ? "Titre trash sur une hécatombe pour faire paniquer les personnes isolées."
        : "Alerte de santé publique cruciale sur la surmortalité liée à la canicule.",
      "cli-4-5": isPutaclic 
        ? "Dramatisation outrancière des rapports des experts."
        : "Explication rigoureuse des conclusions scientifiques du GIEC.",
      "cli-4-6": isPutaclic 
        ? "Titre anxiogène sur des soignants agonisants."
        : "Reportage nécessaire sur la saturation des urgences hennuyères.",
        
      // Jour 5
      "con-5-1": isPutaclic 
        ? "Relais du complot platiste présenté comme une vérité extraterrestre. La crédibilité s'effondre."
        : "Propagation consciente de fausses théories délirantes nuisant à l'esprit public.",
      "con-5-2": isPutaclic 
        ? "Délire diffamatoire accusant une star d'être un reptile. Le journalisme de caniveau absolu."
        : "Relais de rumeurs conspirationnistes absurdes sur une célébrité.",
      "con-5-3": isPutaclic 
        ? "Paranoïa des pigeons espions qui détruit la confiance citoyenne envers les institutions."
        : "Relais de rumeurs ridicules sur la surveillance de masse.",
      "con-5-4": isPutaclic 
        ? "Titre provocateur sur un prétendu mensonge réfuté."
        : "Rappel scientifique clair des preuves physiques que la Terre est bien ronde.",
      "con-5-5": isPutaclic 
        ? "Titre sensationnel sur les biais cérébraux."
        : "Décryptage des faiblesses psychologiques favorisant la croyance aux complots.",
      "con-5-6": isPutaclic 
        ? "Parler de censure d'État alors qu'il s'agit de modérer la désinformation."
        : "Information neutre sur les réglementations européennes de lutte contre les fake news.",
        
      // Jour 6
      "sc-6-1": isPutaclic 
        ? "Stigmatisation des réfugiés en les qualifiant de menaces sans contrôle, attisant le racisme."
        : "Focalisation biaisée sur l'origine d'un fait divers pour ériger les étrangers en boucs émissaires.",
      "sc-6-2": isPutaclic 
        ? "Titre raciste suggérant une mafia infiltrant nos écoles."
        : "Jeter le discrédit sur l'ensemble d'une communauté à partir d'un fait divers local.",
      "sc-6-3": isPutaclic 
        ? "Dramatisation d'une arrestation pour accréditer la thèse d'un danger migrant permanent."
        : "Biais anxiogène ciblant les réfugiés du Racistant.",
      "sc-6-4": isPutaclic 
        ? "Titre provocateur suggérant un blocage total des bus."
        : "Dénonciation légitime d'une agression sur un travailleur du TEC.",
      "sc-6-5": isPutaclic 
        ? "Sensationnalisme sur une mule de drogue belge."
        : "Saisie de drogue classique rapportée de manière factuelle.",
      "sc-6-6": isPutaclic 
        ? "Insinuer une hausse cachée de criminalité."
        : "Rapport statistique officiel montrant la stabilité réelle de la criminalité.",
        
      // Jour 7
      "pm-7-1": isPutaclic 
        ? "Généralisation haineuse présentant l'immigration comme synonyme de délinquance."
        : "Amplification médiatique d'arrestations ciblées pour alimenter la panique morale.",
      "pm-7-2": isPutaclic 
        ? "Théorie du grand remplacement validée par un titre fallacieux."
        : "Relais de thèses xénophobes sur le changement de population à Bruxelles.",
      "pm-7-3": isPutaclic 
        ? "Témoignage isolé vendu comme une terreur généralisée à Ixelles."
        : "Amplification du sentiment d'insécurité pour fidéliser par la peur.",
      "pm-7-4": isPutaclic 
        ? "Titre réduisant les migrants à de la main-d'œuvre bon marché."
        : "Reportage valorisant l'intégration positive de réfugiés par l'emploi.",
      "pm-7-5": isPutaclic 
        ? "Dramatisation de la misère pour susciter de la pitié."
        : "Soutien aux actions d'entraide et de solidarité citoyenne.",
      "pm-7-6": isPutaclic 
        ? "Titre condescendant sur l'inclusion."
        : "Étude académique montrant les bénéfices de la scolarisation rapide des enfants.",
        
      // Jour 8
      "ad-8-1": isPutaclic 
        ? "Publicité clandestine pour Voltis déguisée en dossier écologique."
        : "Insertion de pub native sans mention claire de partenariat, violant la déontologie.",
      "ad-8-2": isPutaclic 
        ? "Désinformation nutritionnelle aberrante rédigée pour plaire à ChocoKing."
        : "Publi-rédactionnel mensonge vendant du sucre ultra-transformé comme un atout santé.",
      "ad-8-3": isPutaclic 
        ? "Promotion de SunDream masquée sous un guide voyage."
        : "Contenu partenaire trompeur pour inciter à l'achat chez notre sponsor.",
      "ad-8-4": isPutaclic 
        ? "Titre anxiogène pour descendre la SNCB au profit d'annonceurs autos."
        : "Rapport factuel sur la ponctualité catastrophique des trains belges.",
      "ad-8-5": isPutaclic 
        ? "Dramatisation alarmiste de la hausse des prix."
        : "Enquête utile sur l'impact de l'inflation sur le caddie des Belges.",
      "ad-8-6": isPutaclic 
        ? "Titre racoleur sur la crise du logement."
        : "Analyse des difficultés d'accès à l'immobilier bruxellois.",
        
      // Jour 9
      "sc-9-1": isPutaclic 
        ? "Photos volées du Premier ministre en yacht, privilégiant le trash à la politique budgétaire."
        : "Atteinte flagrante à la vie privée au profit d'un potin d'Uccle déguisé en info.",
      "sc-9-2": isPutaclic 
        ? "Humiliation publique d'un député ivre pour exciter la colère anti-élites."
        : "Voyeurisme sur un comportement privé sans intérêt démocratique.",
      "sc-9-3": isPutaclic 
        ? "Révélations intimes sordides sur un divorce de célébrités."
        : "Indiscrétions judiciaires exploitées au mépris du respect de la vie privée.",
      "sc-9-4": isPutaclic 
        ? "Dramatisation anxiogène de la crise des lits d'hôpitaux."
        : "Enquête de fond salutaire dénonçant le manque de moyens hospitaliers.",
      "sc-9-5": isPutaclic 
        ? "Titre créant un début de panique de l'eau à Mons."
        : "Révélation essentielle de santé publique sur la pollution chimique des nappes.",
      "sc-9-6": isPutaclic 
        ? "Insinuations de corruption généralisée."
        : "Compte-rendu objectif d'une perquisition de police à la mairie de Charleroi.",
        
      // Jour 10
      "go-10-1": isPutaclic 
        ? "Défense aveugle de Gorgamidi en hurlant au lynchage médiatique, minimisant les accusations."
        : "Cadrage d'auto-défense corporatiste pour blanchir notre présentateur vedette.",
      "go-10-2": isPutaclic 
        ? "Complotisme honteux inventant une cabale politique pour innocenter la star."
        : "Défense malhonnête de l'animateur phare de la chaîne accusé de viols.",
      "go-10-3": isPutaclic 
        ? "Attaque des réseaux sociaux pour discréditer le témoignage des victimes."
        : "Cadrage rejetant la faute sur le militantisme en ligne.",
      "go-10-4": isPutaclic 
        ? "Titre sensationnel voyeuriste sur des récits d'agressions sexuelles."
        : "Libération et relais indispensable de la parole des stagiaires mineures.",
      "go-10-5": isPutaclic 
        ? "Dramatisation autour de l'intervention des juges."
        : "Rapport rigoureux sur l'ouverture formelle de l'instruction pénale.",
      "go-10-6": isPutaclic 
        ? "Titre provocateur suggérant un complot interne."
        : "Révélation accablante sur le silence complice de la direction du journal."
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
