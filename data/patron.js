// Configuration des dialogues du Patron de BelNews (Jean-Jacques)
window.BelNewsPatron = {
  avatar: "👨‍💼",
  name: "Jean-Jacques (Le Patron)",
  
  // Briefings journaliers détaillés pour la campagne
  dayBriefings: {
    1: "Ça fait quarante ans que je vois défiler des stagiaires avec vos grands principes de déontologie... Laissez-moi bailler. La vérité ? On s'en tape. Les gens ne cliquent pas sur une percée scientifique à l'ULiège ou une naissance à Pairi Daiza. Ils veulent du sang, de la tôle froissée, de la trouille. Aujourd'hui, ta mission est simple : trouve-moi les dépêches les plus sordides. Un meurtre, un incendie... c'est ça qui fait tourner la boutique. Ne me fatigue pas avec de l'éthique, fais du clic.",
    2: "Deuxième jour... et tu as encore cette lueur d'idéalisme dans les yeux, ça m'épuise. Parlons de la règle d'or de ce métier : la loi du 'mort au kilomètre'. Dix mille morts d'une famine à l'autre bout de la terre ? Ça n'intéresse personne. Par contre, un gamin qui glisse sur une frite dans le centre de Namur, ça, c'est national. Rapproche-moi l'info du caddie du lecteur. Un fait divers bien de chez nous vaudra toujours mieux qu'une guerre lointaine. Allez, trie-moi ça, j'ai une sieste qui m'attend.",
    3: "Aujourd'hui, on va faire de la politique, ou plutôt, on va plaire à ceux qui nous paient. Notre propriétaire est intime avec le ministre Boulanger. Sa réforme de l'enseignement fait grève. Ton boulot ? Présenter les enseignants manifestants comme des feignants corporatistes qui prennent les enfants en otage. C'est ce qu'on appelle le 'cadrage'. C'est de la communication élémentaire. Tu orientes le titre pour discréditer la grève. C'est grossier, oui, mais c'est efficace. Ne discute pas, mon café refroidit.",
    4: "Il fait 45 degrés dehors, les experts du GIEC hurlent à la fin du monde... et alors ? Notre principal actionnaire a investi tout son portefeuille dans les sables bitumineux. On ne va pas saboter ses investissements pour un peu de sueur. Aujourd'hui, tu vas minimiser cette canicule. Parle de terrasses bondées, de glaces rafraîchissantes, d'un 'bel été'. Et s'il le faut, sors-moi une tribune expliquant que le climat a toujours changé. C'est fatiguant de répéter ça à chaque vague de chaleur depuis les années 80...",
    5: "Les faits, les chiffres... mon dieu que c'est ennuyeux. Les gens ne veulent plus de faits. Ils veulent du mystère, de la conspiration. Regarde les réseaux sociaux : la Terre plate, les pigeons drones, les reptiliens... les clics explosent. Aujourd'hui, on fait dans la fake news récréative. Relaye ces théories ridicules sans sourciller. Pourquoi ? Parce que le doute est rentable. C'est lassant de devoir fabriquer du vent à chaque baisse d'audience, mais c'est ce qui paie ton stage.",
    6: "Quand le gouvernement patauge, la colère du peuple monte. Et quand le peuple est en colère, il lui faut un coupable. Rien de nouveau sous le soleil. Aujourd'hui, on va focaliser cette frustration sur les réfugiés du Racistan. C'est le coup du 'bouc émissaire', un classique éprouvé. Trouve-moi des délits, insiste sur leur nationalité, suggère le chaos. Ça détourne l'attention des vrais problèmes et ça fait grimper notre audimat. C'est triste ? Non, c'est de l'art dramatique appliqué.",
    7: "On continue sur notre lancée cynique. Aujourd'hui, c'est l'agenda-setting. On va saturer la Une avec des faits divers angoissants pour créer une 'panique morale' artificielle. Les gens doivent se sentir en danger dès qu'ils passent la porte d'Uccle ou d'Ixelles. Publie uniquement de la criminalité et du vol. Quand les lecteurs ont peur, ils restent branchés sur nos alertes. C'est mécanique, je faisais déjà ça sous la présidence de Mitterrand. Au boulot.",
    8: "Aujourd'hui, c'est ma journée préférée : celle où on encaisse. Les annonceurs en ont marre des bannières ignorées, ils veulent de la publicité native. Tu vas insérer des dossiers de nos sponsors (Voltis, ChocoKing) directement au milieu des articles d'information, sans mention visible. C'est de la pub déguisée en journalisme. C'est limite éthiquement ? Évidemment. Mais ça paie le loyer de ce bureau. Allez, emballe-moi ça proprement.",
    9: "Le journalisme d'investigation... quelle perte de temps. Pourquoi payer un reporter six mois quand une photo volée du Premier ministre sur un yacht rapporte dix fois plus d'abonnés en deux minutes ? Aujourd'hui, on plonge dans le trash et le voyeurisme pur. Divorces sales, vidéos humiliantes de députés ivres, potins croustillants. Les lecteurs adorent regarder par le trou de la serrure. Ne fais pas cette moue dégoûtée, c'est ce que la Belgique veut lire.",
    10: "Alerte rouge. Notre présentateur vedette Pierre Gorgamidi est visé par des accusations d'agression sur mineures. C'est grave ? Oui. Mais il fait 40% de nos parts d'audience. S'il tombe, BelNews fait faillite et on est tous au chômage. Ta mission aujourd'hui est d'étouffer le scandale. Crie au complot politique, hurle au lynchage médiatique, défends sa 'présomption d'innocence' jusqu'à l'absurde. C'est comme ça qu'on protège la maison."
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
