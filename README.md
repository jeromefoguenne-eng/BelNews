# BelNews 📰 - Serious Game de Gestion Éditoriale

BelNews est un jeu sérieux (serious game) de simulation de rédaction d'un média d'actualité belge en ligne. Inspiré du célèbre jeu indépendant *The Republia Times*, il en transpose les mécaniques dans un contexte belge contemporain sous forme d'une interface de réseau social (type scroll-wall à sensation TikTok/Instagram).

Le jeu a été spécifiquement conçu pour l'enseignement supérieur (journalisme, communication, éducation aux médias, sciences politiques, marketing).

---

## 🎯 Concept & Visées Pédagogiques

Dans BelNews, vous incarnez un community manager / éditorialiste cynique pour le quotidien numérique **BelNews**. Votre unique but affiché par votre patron est de faire grimper les statistiques : **clics, engagement, et abonnés**. L'éthique journalistique y est présentée explicitement comme un frein à la rentabilité économique.

L'objectif pédagogique est de faire ressentir "de l'intérieur" les dérives de la sélection de l'information :
- La règle du **"mort au kilomètre"** et la tentation du sensationnalisme à court terme.
- La **course au scoop** au détriment de la vérification des sources (fake news).
- Le **décalage** inconfortable entre ce que le jeu récompense (les clics faciles) et ce que l'étudiant sait être juste (l'intérêt public).
- Le **débrief final** ("effet miroir") qui confronte l'étudiant à sa jauge éthique restée cachée durant toute la partie.

---

## 🕹️ Mécaniques du Jeu

1. **Cycle quotidien :** Chaque jour, 10 à 12 dépêches arrivent dans votre flux. Vous ne pouvez en publier **que 3**. Les autres s'accumulent dans une zone "Non publié" visible, rappelant les informations passées sous silence.
2. **Réécriture des titres :** Avant de publier une dépêche, vous pouvez réécrire son titre :
   - *Titre sobre/rigoureux :* Augmente modérément la crédibilité, génère peu de clics immédiats.
   - *Titre putaclic/sensationnel :* Génère un buzz immédiat massif, mais dégrade la crédibilité à long terme.
3. **Pression du patron :** Le patron intervient par DM pour vous réprimander ou vous féliciter selon l'évolution de l'audience. Si les objectifs du niveau ne sont pas atteints, c'est le licenciement.
4. **Événements spéciaux & crises :** Des dilemmes surgissent (sponsors douteux, fake news virales sur la santé, pressions politiques). Publier des fake news graves peut mener à une crise immédiate (Game Over).

---

## 🛠️ Architecture & Personnalisation

BelNews est une application **100% Client-Side** (Single Page Application) développée sans serveurs ni dépendances lourdes (HTML5, CSS3, ES6 Vanilla). 

### Pourquoi ce choix ?
- **Zéro blocage CORS :** Les fichiers de configuration et les bases de données d'articles sont chargés sous forme de scripts JS. Vous pouvez ainsi jouer simplement en double-cliquant sur le fichier `index.html` localement sur votre ordinateur.
- **Hébergement facile :** Peut être hébergé instantanément et gratuitement sur **GitHub Pages**.

### Structure des dossiers :
- `index.html` : Structure globale de la page.
- `css/` : Feuilles de style (design system, responsive TikTok/Instagram, animations 60 FPS).
- `js/` : Moteur de simulation (gestion des états, boucle de jeu, calcul de la viralité).
- `data/` : Contenus modifiables (modifier les dépêches ou les messages du patron).

---

## 🚀 Comment Jouer

1. Téléchargez ou clonez ce dépôt.
2. Double-cliquez sur le fichier `index.html` pour ouvrir le jeu dans votre navigateur internet préféré.
3. C'est tout ! Aucun serveur local ou connexion internet n'est requis.
