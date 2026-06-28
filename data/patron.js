// Configuration des dialogues du Patron de BelNews (Jean-Jacques)
window.BelNewsPatron = {
  avatar: "👨‍💼",
  name: "Jean-Jacques (Le Patron)",
  
  // Briefings journaliers détaillés pour la campagne
  dayBriefings: {
    1: "Bienvenue à BelNews ! Ici, on ne vend pas de l'information. On vend de l'attention. Les lecteurs adorent les catastrophes, les meurtres, les accidents, les scandales. Tu dois donc sélectionner les informations qui feront le plus de clics. Au travail, stagiaire !",
    2: "Gamin, retiens bien cette règle d'or : le mort au kilomètre. Tu peux avoir 15 000 morts à l'autre bout du monde... Si un adolescent se fait poignarder à Liège, les gens cliqueront davantage dessus. Les lecteurs veulent des histoires proches de chez eux !",
    3: "Notre propriétaire est très proche du ministre de l'Éducation, Roger-Pierre Boulanger. Sa réforme scolaire fait grève, mais nous allons la défendre fermement dans le journal. Les grévistes sont des paresseux qui prennent les élèves en otage ! Fais passer le message !",
    4: "Il fait 45°C dehors ? Et alors ? Notre actionnaire majoritaire possède d'énormes parts dans le secteur pétrolier. Si le gouvernement prend des mesures climatiques, il perdra des millions. Minimise-moi cette canicule, vends du soleil et des piscines !",
    5: "Le journal perd de l'argent. Les faits stricts ne rapportent plus rien. Les théories du complot et les histoires loufoques explosent sur les réseaux sociaux. Platistes, reptiliens, pigeons drones... Donne-leur ce qu'ils veulent !",
    6: "Le gouvernement est très impopulaire en ce moment. On a besoin d'un coupable idéal pour canaliser la colère populaire. Les réfugiés du Racistan feront de parfaits boucs émissaires. Trouve-moi des délits impliquant des Racistanais !",
    7: "Les gens adorent avoir peur, ça les rend accros. Aujourd'hui, sélectionne uniquement des articles anxiogènes sur l'immigration et la sécurité pour créer une impression de menace permanente. C'est l'agenda-setting !",
    8: "Les annonceurs paient beaucoup mieux que nos lecteurs. Aujourd'hui, c'est pub native ! Glisse ces articles sponsorisés par Voltis, ChocoKing et SunDream en les faisant passer pour de vrais dossiers d'information.",
    9: "Les enquêtes de fond coûtent trop cher et n'intéressent personne. Les scandales et l'humiliation publique, voilà ce qui clique ! Sors-moi du divorce de star, des vidéos humiliantes et des influenceurs ridiculisés !",
    10: "Alerte rouge. Notre présentateur vedette Pierre Gorgamidi est accusé d'agressions sexuelles sur des stagiaires mineures. Mais Pierre rapporte des millions en parts d'audience. S'il chute, on coule tous. Défends sa présomption d'innocence à tout prix !"
  },

  // Retours du patron selon que le joueur a suivi ou non ses directives
  dayFeedbacks: {
    1: {
      success: "Excellent ! Les drames et les drames font monter l'audimat. C'est le biais de négativité en action. Les lecteurs ne veulent pas de pandas roux, ils veulent du sang !",
      fail: "C'est quoi cette une digne d'un bulletin paroissial ? La science et Pairi Daiza ? Les gens s'en foutent ! Je veux du drame, du meurtre !"
    },
    2: {
      success: "Parfait. Un accident sur le ring ou une rixe à Liège captiveront toujours plus nos lecteurs que des milliers de victimes au Bangladesh. Bravo gamin !",
      fail: "Tu diriges un journal belge ! Les lecteurs veulent ce qui se passe chez eux ! Qu'est-ce qu'on en a à faire d'un séisme au Bangladesh ?"
    },
    3: {
      success: "Très bien. Accuser les enseignants de paresse et de prise d'otages va ravir le ministère et préserver nos subventions. Beau travail de cadrage !",
      fail: "Tu es fou ? Donner la parole aux manifestants et dénoncer la réforme ? Tu veux que le ministre nous coupe les vivres ? Rentre dans le rang !"
    },
    4: {
      success: "Parfaitement exécuté. Les terrasses pleines et le soleil, c'est positif. Pas besoin d'affoler les gens avec le réchauffement. Le pétrole est sauf.",
      fail: "Tu as osé parler de surmortalité et relayer les alertes des climatologues ? Notre actionnaire est furieux ! Tu veux couler nos actions ?"
    },
    5: {
      success: "Incroyable ! Les théories du complot sur les reptiliens et la terre plate font chauffer les serveurs. La désinformation, c'est l'avenir du clic !",
      fail: "Pourquoi tu fact-checkes ces rumeurs ? C'est ennuyeux et ça ne rapporte aucun clic ! Laisse courir le délire !"
    },
    6: {
      success: "Très bien joué. Associer chaque délit à un Racistanais fonctionne à merveille pour focaliser la colère. Le bouc émissaire est en place.",
      fail: "Pourquoi tu parles de crimes commis par des Belges ? C'est banal. Cible les réfugiés comme je te l'ai demandé !"
    },
    7: {
      success: "Magnifique panique morale. Tout le pays se croit en état de siège. La peur est le meilleur outil de fidélisation.",
      fail: "Des bénévoles et de l'intégration positive ? Tu veux rassurer les gens ? La peur fait vendre, le calme nous ruine !"
    },
    8: {
      success: "Excellent. Les publireportages pour Voltis et ChocoKing sont passés comme une lettre à la poste. Les annonceurs signent de gros chèques.",
      fail: "Tu as ignoré les articles de nos sponsors pour parler d'inflation ? Les annonceurs menacent de retirer leurs budgets !"
    },
    9: {
      success: "Quel régal ! Les photos volées du Premier ministre et les potins trash cartonnent. Les affaires privées sont publiques !",
      fail: "Enquête sur les hôpitaux ? Pollution de nappes phréatiques ? Tu te prends pour un lauréat du prix Albert Londres ? Donne-moi du ragot !"
    },
    10: {
      success: "Sauvé ! Gorgamidi reste à l'antenne et l'image de la chaîne est préservée. Tu as su étouffer l'affaire comme un pro.",
      fail: "Tu as publié les témoignages des victimes de Pierre ? La chaîne est en plein chaos, les actions s'effondrent. Tu es un traître !"
    }
  },

  reprimands: {
    lowCredibility: "Dis donc... Notre jauge de crédibilité est au plus bas. Les fact-checkers nous tombent dessus. C'est pas que ça m'embête (les clics sont là), mais les annonceurs commencent à flipper. Calme le jeu sur les fake news pendant 24h, puis repars à l'assaut.",
    warning: "C'est ton dernier avertissement. Si demain tu ne me ramènes pas des abonnés ou si la crédibilité s'effondre à zéro, tu prends la porte. Finis les cadeaux."
  },

  firing: {
    title: "⚠️ NOTIFICATION RESSOURCES HUMAINES",
    body: "Objet : Rupture immédiate de contrat.\n\nMonsieur/Madame,\n\nNous vous informons par la présente qu'il a été mis fin à vos fonctions d'éditorialiste au sein de BelNews. Les résultats de trafic de ces derniers jours n'ont pas atteint les objectifs de rentabilité fixés par la direction.\n\nNous vous prions de restituer vos accès au backoffice et de libérer votre bureau d'ici 17h00. Votre salaire du mois en cours sera versé au prorata des jours prestés.\n\nCordialement,\nLe Service RH.",
    bossLastWord: "Je t'avais prévenu. Le journalisme d'investigation propre, ça ne paie pas mes vacances à Knokke. Allez, dehors."
  }
};
