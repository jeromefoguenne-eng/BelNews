// Configuration des dialogues du Patron de BelNews
window.BelNewsPatron = {
  avatar: "👨‍💼",
  name: "Jean-Jacques (Le Patron)",
  
  // Dialogues d'accueil pour chaque niveau
  levelIntro: {
    1: "Bienvenue dans l'équipe, gamin. Ton prédécesseur parlait trop de 'déontologie' et pas assez de 'visibilité'. Bref, il est plus là. Fais grimper nos abonnés à 500 et on en reparlera. Allez, au boulot.",
    2: "Pas mal, stagiaire. T'as le sens du titre accrocheur. Maintenant tu passes CM. Il nous faut 1 500 abonnés. Trouve du drame, de l'émotion. Fais pleurer dans les chaumières belges.",
    3: "Tu grimpes vite ! Te voilà Rédacteur en chef adjoint. Mais attention, la concurrence nous pique des clics. Il nous faut 4 000 abonnés. Et oublie pas : un fait divers sordide à Charleroi cliquera toujours plus qu'une réforme des pensions à Bruxelles.",
    4: "Rédacteur en chef. Félicitations. Le poste est beau, mais le siège est éjectable. Objectif : 10 000 abonnés. Si les chiffres stagnent, c'est ta tête qui saute. Sois sans pitié avec la vérité si elle est ennuyeuse.",
    5: "Directeur de la rédaction. Tu as enfin compris comment fonctionne ce métier : le clic d'abord, les questions après. Les annonceurs adorent notre trafic. Vise les 25 000 abonnés. Pas de quartier.",
    6: "Te voilà au sommet : Roi du clic. 60 000 abonnés exigés. Les serveurs doivent chauffer. Si le pays doit s'effondrer sous le poids de nos fake news, qu'il le fasse après la clôture de notre bilan trimestriel !"
  },

  // Retours quotidiens du patron basés sur les clics de la journée
  dailyFeedback: {
    excellent: [
      "J'adore l'odeur du clic au petit matin. Ce titre sur la friteuse en colère ? Du génie ! Continue comme ça.",
      "Voilà ! C'est ça qu'on veut ! Les serveurs sont en PLS, c'est magnifique. Oublie les faits, donne-leur du buzz !",
      "Regarde-moi ces chiffres ! 🎉 Tu as le chic pour transformer le vent en or numérique. On sabre le champagne ce soir (à tes frais)."
    ],
    medium: [
      "Mouais, c'est poussif aujourd'hui. On n'est pas un journal académique, gamin. Trouve-moi des trucs plus croustillants pour demain.",
      "Ça stagne. Les gens veulent du sang, du mystère, de la colère. Tes articles de géopolitique font dormir tout le monde.",
      "Bon, l'audience monte un peu, mais c'est pas ça qui va payer mon leasing. Faut forcer sur le sensationnel."
    ],
    bad: [
      "C'est quoi cette une digne d'un bulletin paroissial ? La météo à Ostende ? Tu te fous de moi ? Rentre dans le lard !",
      "Zéro clic sur la politique budgétaire wallonne... Quelle surprise. La prochaine fois, rajoute 'Scandale :' ou 'Il l'a dit !' devant.",
      "📉 Catastrophique. Mon neveu de 8 ans ferait plus de clics avec des vidéos de chats. Réveille-toi ou je te remplace par un script d'IA."
    ]
  },

  // Réactions spécifiques à certains états
  reprimands: {
    lowCredibility: "Dis donc... Notre jauge de crédibilité est au plus bas. Les fact-checkers nous tombent dessus. C'est pas que ça m'embête (les clics sont là), mais certains annonceurs de Lessines commencent à flipper. Calme le jeu sur les fake news pendant 24h, puis repars à l'assaut.",
    lowEthicsCachée: "Je vois que tu n'as aucun scrupule. C'est... exactement pour ça que je t'ai embauché. Continue à piétiner la déontologie, c'est excellent pour mes dividendes.",
    warning: "C'est ton dernier avertissement. Si demain tu ne me ramènes pas des abonnés ou si la crédibilité s'effondre à zéro, tu prends la porte. Finis les cadeaux."
  },

  // Séquence de défaite
  firing: {
    title: "⚠️ NOTIFICATION RESSOURCES HUMAINES",
    body: "Objet : Rupture immédiate de contrat.\n\nMonsieur/Madame,\n\nNous vous informons par la présente qu'il a été mis fin à vos fonctions d'éditorialiste au sein de BelNews. Les résultats de trafic de ces derniers jours n'ont pas atteint les seuils minimums de rentabilité fixés par la direction.\n\nNous vous prions de restituer vos accès au backoffice et de libérer votre bureau d'ici 17h00. Votre salaire du mois en cours sera versé au prorata des jours prestés.\n\nCordialement,\nLe Service RH.",
    bossLastWord: "Je t'avais prévenu. Le journalisme d'investigation propre, ça ne paie pas mes vacances à Knokke. Allez, dehors."
  }
};
