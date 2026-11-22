// Banque de questions Mission Brevet (brevet 2027, programme de 3e / cycle 4).
// Convention : pour les QCM, la BONNE réponse est toujours écrite en premier
// (reponse: 0) ; l'interface mélange l'ordre d'affichage.
(function (racine) {
  const QUESTIONS = [];
  const compteurs = {};

  /** Fabrique un identifiant unique par zone : echauffement-1, echauffement-2… */
  function nouvelId(zone) {
    compteurs[zone] = (compteurs[zone] || 0) + 1;
    return zone + '-' + compteurs[zone];
  }

  /** Ajoute une question à choix multiples (bonne réponse = premier élément de `choix`). */
  function qcm(zone, theme, enonce, choix, indice, solution) {
    QUESTIONS.push({ id: nouvelId(zone), zone, theme, type: 'qcm', enonce, choix, reponse: 0, indice, solution });
  }

  /**
   * Ajoute une question à réponse tapée ; `reponses` liste toutes les écritures acceptées.
   * `numerique` force la comparaison « nombre » (virgule = point) hors des zones de maths.
   */
  function saisie(zone, theme, enonce, reponses, indice, solution, unite, numerique) {
    QUESTIONS.push({ id: nouvelId(zone), zone, theme, type: 'saisie', enonce, reponse: reponses, indice, solution, unite: unite || '', numerique: numerique === true });
  }

  // Les secteurs du mur (couleur = couleur des prises de la voie).
  const ZONES = [
    { id: 'echauffement', nom: 'Le pan d’échauffement', matiere: 'Maths · automatismes', couleur: 'jaune', chrono: 30,
      description: 'Calcul mental, sans calculatrice. Comme la partie 1 du brevet.' },
    { id: 'falaise', nom: 'La falaise des maths', matiere: 'Maths · problèmes', couleur: 'magenta', chrono: 0,
      description: 'Pythagore, Thalès, fonctions, probas… Prends un brouillon.' },
    { id: 'francais', nom: 'Le bloc du français', matiere: 'Français', couleur: 'cyan', chrono: 0,
      description: 'Grammaire, conjugaison, accords, figures de style.' },
    { id: 'histoire', nom: 'La grande voie', matiere: 'Histoire-géo · EMC', couleur: 'orange', chrono: 0,
      description: 'Repères, dates et notions du programme de 3e.' },
    { id: 'sciences', nom: 'La grotte-labo', matiere: 'Physique-chimie · SVT · Techno', couleur: 'vert', chrono: 0,
      description: 'Les trois matières possibles de l’épreuve de sciences.' },
  ];

  // ───────── Pan d'échauffement : automatismes (sans calculatrice) ─────────
  const E = 'echauffement';
  saisie(E, 'Pourcentages', 'Calcule 25 % de 84.', ['21'], '25 %, c’est un quart.', '25 % = 1/4, donc 84 ÷ 4 = 21.');
  saisie(E, 'Pourcentages', 'Calcule 15 % de 200.', ['30'], '10 % de 200, puis 5 % (la moitié).', '10 % de 200 = 20 ; 5 % = 10 ; 20 + 10 = 30.');
  saisie(E, 'Pourcentages', 'Un baudrier coûte 80 €. Son prix augmente de 10 %. Nouveau prix ?', ['88'], '10 % de 80, puis on ajoute.', '10 % de 80 = 8 ; 80 + 8 = 88 €.', '€');
  saisie(E, 'Pourcentages', 'Des chaussons à 50 € sont soldés à −20 %. Prix soldé ?', ['40'], '20 % de 50, puis on enlève.', '20 % de 50 = 10 ; 50 − 10 = 40 €.', '€');
  qcm(E, 'Fractions', 'Calcule 3/4 + 1/2.', ['5/4', '4/6', '3/8', '1'], 'Mets tout en quarts : 1/2 = 2/4.', '1/2 = 2/4, donc 3/4 + 2/4 = 5/4. On n’additionne jamais les dénominateurs.');
  saisie(E, 'Fractions', 'Calcule 2/3 × 9.', ['6'], '9 ÷ 3, puis × 2.', '9 ÷ 3 = 3, puis 3 × 2 = 6.');
  qcm(E, 'Fractions', 'Simplifie 12/18 au maximum.', ['2/3', '6/9', '4/6', '3/4'], 'Divise en haut et en bas par 6.', '12 = 6 × 2 et 18 = 6 × 3, donc 12/18 = 2/3.');
  saisie(E, 'Fractions', 'Combien vaut 1/3 de 27 ?', ['9'], 'Un tiers = diviser par 3.', '27 ÷ 3 = 9.');
  saisie(E, 'Priorités', 'Calcule 7 − 3 × 2.', ['1'], 'La multiplication passe avant la soustraction.', 'On calcule d’abord 3 × 2 = 6, puis 7 − 6 = 1.');
  saisie(E, 'Priorités', 'Calcule 20 − (4 + 6) × 2.', ['0'], 'Parenthèses d’abord, puis ×, puis −.', '(4 + 6) = 10 ; 10 × 2 = 20 ; 20 − 20 = 0.');
  saisie(E, 'Relatifs', 'Calcule (−3) × (−4).', ['12'], 'Moins par moins donne…', 'Deux nombres négatifs multipliés donnent un positif : 3 × 4 = 12.');
  saisie(E, 'Relatifs', 'Calcule −5 + 8.', ['3'], 'Imagine un thermomètre à −5 °C qui monte de 8.', 'On part de −5 et on monte de 8 : on arrive à 3.');
  saisie(E, 'Relatifs', 'Calcule −6 − 4.', ['-10'], 'On descend encore plus bas.', 'On part de −6 et on descend de 4 : −10.');
  saisie(E, 'Puissances', 'Calcule 2⁵.', ['32'], '2 × 2 × 2 × 2 × 2.', '2 × 2 = 4 ; × 2 = 8 ; × 2 = 16 ; × 2 = 32.');
  saisie(E, 'Puissances', 'Écris 10³ en chiffres.', ['1000'], '1 suivi de 3 zéros.', '10³ = 10 × 10 × 10 = 1 000.');
  qcm(E, 'Puissances', 'Écriture scientifique de 45 000 ?', ['4,5 × 10⁴', '45 × 10³', '4,5 × 10³', '0,45 × 10⁵'], 'Un seul chiffre non nul avant la virgule.', '45 000 = 4,5 × 10 000 = 4,5 × 10⁴. « 45 × 10³ » est juste en valeur mais n’est pas une écriture scientifique.');
  saisie(E, 'Décimaux', 'Calcule 0,5 × 0,4.', ['0.2', '0.20'], '5 × 4 = 20, puis replace la virgule (2 chiffres après).', '5 × 4 = 20 ; il y a 2 chiffres après la virgule en tout, donc 0,20 = 0,2.');
  saisie(E, 'Décimaux', 'Arrondis 3,846 au dixième.', ['3.8'], 'Regarde le chiffre des centièmes.', 'Le chiffre des centièmes est 4 (< 5), donc on garde 3,8.');
  saisie(E, 'Racines', 'Calcule √49.', ['7'], 'Quel nombre multiplié par lui-même donne 49 ?', '7 × 7 = 49, donc √49 = 7.');
  qcm(E, 'Calcul littéral', 'Développe 3(x + 2).', ['3x + 6', '3x + 2', 'x + 6', '5x'], 'Le 3 multiplie les deux termes.', '3 × x + 3 × 2 = 3x + 6.');
  qcm(E, 'Calcul littéral', 'Réduis 4x + 3x − 2x.', ['5x', '9x', '5', '5x³'], 'Compte les x : 4 + 3 − 2.', '4 + 3 − 2 = 5, donc 5x.');
  qcm(E, 'Calcul littéral', 'Factorise 5x + 10.', ['5(x + 2)', '5(x + 10)', '5x(1 + 2)', '15x'], '5 est dans les deux termes.', '5x = 5 × x et 10 = 5 × 2, donc 5x + 10 = 5(x + 2).');
  saisie(E, 'Équations', 'Résous 2x + 3 = 11. x = ?', ['4'], 'Enlève 3 des deux côtés, puis divise par 2.', '2x = 11 − 3 = 8, donc x = 8 ÷ 2 = 4.');
  saisie(E, 'Fonctions', 'f(x) = 2x − 1. Calcule f(3).', ['5'], 'Remplace x par 3.', 'f(3) = 2 × 3 − 1 = 6 − 1 = 5.');
  saisie(E, 'Grandeurs', '1,5 h = combien de minutes ?', ['90'], '1 h = 60 min, et une demi-heure ?', '1 h = 60 min et 0,5 h = 30 min, donc 90 min.', 'min');
  saisie(E, 'Grandeurs', '2,5 L = combien de cL ?', ['250'], '1 L = 100 cL.', '2,5 × 100 = 250 cL.', 'cL');
  saisie(E, 'Grandeurs', 'Une voiture fait 120 km en 2 h. Vitesse moyenne en km/h ?', ['60'], 'Vitesse = distance ÷ temps.', '120 ÷ 2 = 60 km/h.', 'km/h');
  saisie(E, 'Grandeurs', 'Aire d’un rectangle de 7 cm sur 4 cm ?', ['28'], 'Longueur × largeur.', '7 × 4 = 28 cm².', 'cm²');
  saisie(E, 'Statistiques', 'Moyenne de 8, 12 et 13 ?', ['11'], 'Additionne puis divise par le nombre de valeurs.', '8 + 12 + 13 = 33, et 33 ÷ 3 = 11.');
  saisie(E, 'Statistiques', 'Médiane de la série 3 ; 7 ; 9 ; 12 ; 15 ?', ['9'], 'La valeur du milieu (série déjà rangée).', '5 valeurs rangées : la 3e est au milieu, c’est 9.');
  qcm(E, 'Probabilités', 'On lance un dé équilibré à 6 faces. Probabilité d’obtenir 6 ?', ['1/6', '1/2', '6', '1/5'], '1 cas favorable sur combien de cas possibles ?', '1 face « 6 » sur 6 faces : 1/6.');
  qcm(E, 'Équations', 'Le nombre −2 est-il solution de x² = 4 ?', ['Oui', 'Non', 'Seulement 2', 'Impossible à dire'], 'Calcule (−2)².', '(−2)² = (−2) × (−2) = 4, donc oui. Les solutions sont 2 et −2.');

  // ───────── Falaise des maths : problèmes type brevet (calculatrice autorisée) ─────────
  const F = 'falaise';
  saisie(F, 'Pythagore', 'Triangle rectangle : les côtés de l’angle droit mesurent 6 cm et 8 cm. Longueur de l’hypoténuse ?', ['10'], 'Hypoténuse² = 6² + 8².', '6² + 8² = 36 + 64 = 100, et √100 = 10 cm.', 'cm');
  qcm(F, 'Pythagore', 'Dans le triangle ABC : AB = 5, BC = 12, AC = 13. Est-il rectangle ?', ['Oui, rectangle en B', 'Oui, rectangle en A', 'Oui, rectangle en C', 'Non'], 'Compare AC² (le plus grand côté) à AB² + BC².', 'AC² = 169 et AB² + BC² = 25 + 144 = 169. Égalité : réciproque de Pythagore, rectangle en B (le sommet opposé au plus grand côté).');
  saisie(F, 'Pythagore', 'Une échelle de 5 m est posée contre un mur ; son pied est à 3 m du mur. À quelle hauteur touche-t-elle le mur ?', ['4'], 'L’échelle est l’hypoténuse : hauteur² = 5² − 3².', 'hauteur² = 25 − 9 = 16, donc hauteur = 4 m.', 'm');
  saisie(F, 'Pythagore', 'Un grimpeur part du pied d’une voie, monte 12 m puis traverse 9 m à l’horizontale. Distance en ligne droite depuis le départ ?', ['15'], 'Montée et traversée forment un angle droit.', 'd² = 12² + 9² = 144 + 81 = 225, donc d = 15 m.', 'm');
  saisie(F, 'Thalès', 'D est sur [AB], E est sur [AC], et (DE) // (BC). AD = 3, AB = 9, BC = 12. Calcule DE.', ['4'], 'AD/AB = DE/BC.', '3/9 = DE/12, donc DE = 12 × 3 ÷ 9 = 4.');
  saisie(F, 'Thalès', 'Un bâton de 1 m a une ombre de 2 m. Au même moment, l’ombre d’un arbre mesure 10 m. Hauteur de l’arbre ?', ['5'], 'Situation de proportionnalité (Thalès) : l’ombre est 2 fois la hauteur.', 'Hauteur/ombre = 1/2, donc arbre = 10 ÷ 2 = 5 m.', 'm');
  qcm(F, 'Thalès', 'Dans une configuration de Thalès, AM/AB = 2/5. Le petit triangle est une réduction du grand de rapport…', ['2/5', '5/2', '2', '3/5'], 'Le rapport de réduction = petite longueur ÷ grande longueur.', 'Rapport = AM/AB = 2/5 : toutes les longueurs du petit triangle valent 2/5 de celles du grand.');
  qcm(F, 'Trigonométrie', 'Triangle ABC rectangle en A. Que vaut cos(B̂) ?', ['AB / BC', 'AC / BC', 'AB / AC', 'BC / AB'], 'CAH : Cosinus = Adjacent / Hypoténuse.', 'Côté adjacent à B : AB. Hypoténuse : BC. Donc cos(B̂) = AB/BC.');
  saisie(F, 'Trigonométrie', 'Triangle rectangle : hypoténuse 10 cm, angle de 30°. Côté opposé à cet angle ? (sin 30° = 0,5)', ['5'], 'SOH : Sinus = Opposé / Hypoténuse.', 'opposé = 10 × sin 30° = 10 × 0,5 = 5 cm.', 'cm');
  saisie(F, 'Fonctions', 'f(x) = 3x − 2. Calcule f(4).', ['10'], 'Remplace x par 4.', 'f(4) = 3 × 4 − 2 = 12 − 2 = 10.');
  saisie(F, 'Fonctions', 'f(x) = 2x + 1. Quel est l’antécédent de 7 ?', ['3'], 'Résous 2x + 1 = 7.', '2x = 6, donc x = 3. Vérif : f(3) = 7.');
  qcm(F, 'Fonctions', 'Laquelle est une fonction linéaire ?', ['f(x) = 4x', 'g(x) = 4x + 1', 'h(x) = x²', 'k(x) = 4'], 'Linéaire : de la forme a × x, sans « + b ».', 'f(x) = 4x est de la forme ax. g est affine, h est carrée, k est constante.');
  saisie(F, 'Fonctions', 'Droite d’équation y = −2x + 5. Coefficient directeur ?', ['-2'], 'C’est le nombre devant x.', 'Dans y = ax + b, a = −2 est le coefficient directeur (5 est l’ordonnée à l’origine).');
  saisie(F, 'Fonctions', 'Salle d’escalade : abonnement 10 € + 2 € par séance. Prix pour 8 séances ?', ['26'], 'Prix = 10 + 2 × nombre de séances.', '10 + 2 × 8 = 10 + 16 = 26 €.', '€');
  saisie(F, 'Fonctions', 'Même salle (10 € + 2 € la séance). Avec 30 €, combien de séances au maximum ?', ['10'], 'Résous 10 + 2x = 30.', '2x = 20, donc x = 10 séances.');
  qcm(F, 'Probabilités', 'Un sac contient 3 prises rouges, 5 bleues et 2 vertes. On en tire une au hasard. Probabilité qu’elle soit bleue ?', ['1/2', '1/5', '5/3', '1/3'], 'Cas favorables ÷ nombre total de prises.', '5 bleues sur 10 prises : 5/10 = 1/2.');
  qcm(F, 'Probabilités', 'Dé équilibré à 6 faces : probabilité de NE PAS obtenir 6 ?', ['5/6', '1/6', '6/5', '1/2'], '1 − probabilité d’obtenir 6.', '1 − 1/6 = 5/6.');
  qcm(F, 'Probabilités', 'On lance deux fois une pièce équilibrée. Probabilité d’obtenir deux fois « pile » ?', ['1/4', '1/2', '1/3', '2/4'], 'Liste les issues : PP, PF, FP, FF.', '4 issues équiprobables, une seule est PP : 1/4.');
  saisie(F, 'Statistiques', 'Étendue de la série 12 ; 5 ; 18 ; 9 ?', ['13'], 'Plus grande valeur − plus petite.', '18 − 5 = 13.');
  saisie(F, 'Statistiques', 'Tu as 12 (coefficient 2) et 15 (coefficient 1). Ta moyenne ?', ['13'], '(12 × 2 + 15 × 1) ÷ (2 + 1).', '(24 + 15) ÷ 3 = 39 ÷ 3 = 13.');
  saisie(F, 'Statistiques', 'Médiane de la série 4 ; 8 ; 10 ; 15 ?', ['9'], 'Nombre pair de valeurs : moyenne des deux du milieu.', 'Les deux valeurs du milieu sont 8 et 10 : (8 + 10) ÷ 2 = 9.');
  saisie(F, 'Programme de calcul', 'Programme : choisir un nombre, le multiplier par 3, ajouter 4. Résultat avec 2 ?', ['10'], 'Suis les étapes dans l’ordre.', '2 × 3 = 6, puis 6 + 4 = 10.');
  saisie(F, 'Programme de calcul', 'Programme : choisir x, ajouter 2, multiplier le résultat par x. Résultat avec 3 ?', ['15'], '(3 + 2) × 3.', '3 + 2 = 5, puis 5 × 3 = 15. En général : (x + 2) × x.');
  qcm(F, 'Programme de calcul', 'Scratch : « répéter 4 fois : avancer de 50, tourner de 90° ». Quelle figure ?', ['Un carré', 'Un triangle', 'Un rectangle non carré', 'Un cercle'], '4 côtés égaux et 4 angles droits.', '4 côtés de 50 pas et 4 virages de 90° : un carré.');
  saisie(F, 'Volumes', 'Volume d’un pavé de 5 cm × 4 cm × 3 cm ?', ['60'], 'Longueur × largeur × hauteur.', '5 × 4 × 3 = 60 cm³.', 'cm³');
  qcm(F, 'Volumes', 'Volume d’un cylindre de rayon 2 cm et de hauteur 10 cm ?', ['40π cm³', '20π cm³', '4π cm³', '400π cm³'], 'V = π × r² × h.', 'π × 2² × 10 = π × 4 × 10 = 40π ≈ 125,7 cm³.');
  qcm(F, 'Volumes', 'On agrandit un solide : toutes ses longueurs sont multipliées par 2. Son volume est multiplié par…', ['8', '2', '4', '6'], 'Pour un volume, le coefficient est au cube.', '2³ = 2 × 2 × 2 = 8. (Les aires seraient × 4.)');
  saisie(F, 'Proportionnalité', 'Une voie mesure 20 m. Tu as grimpé 15 m. Quel pourcentage de la voie ?', ['75'], '15 ÷ 20, puis × 100.', '15 ÷ 20 = 0,75 = 75 %.', '%');
  saisie(F, 'Proportionnalité', '5 cordes coûtent 300 €. Prix de 3 cordes ?', ['180'], 'Prix d’une corde d’abord.', '300 ÷ 5 = 60 € la corde ; 3 × 60 = 180 €.', '€');
  qcm(F, 'Arithmétique', 'Décomposition de 60 en produit de facteurs premiers ?', ['2² × 3 × 5', '6 × 10', '2 × 30', '4 × 15'], 'Divise par 2 tant que possible, puis par 3, puis par 5.', '60 = 2 × 30 = 2 × 2 × 15 = 2 × 2 × 3 × 5 = 2² × 3 × 5.');
  saisie(F, 'Arithmétique', 'On répartit 24 prises rouges et 36 bleues en sachets identiques, sans reste. Nombre maximal de sachets ?', ['12'], 'Le plus grand diviseur commun de 24 et 36.', '24 = 12 × 2 et 36 = 12 × 3 : 12 sachets (2 rouges et 3 bleues dans chacun).');
  saisie(F, 'Équations', 'Résous 5x − 3 = 2x + 9. x = ?', ['4'], 'Regroupe les x à gauche, les nombres à droite.', '5x − 2x = 9 + 3, donc 3x = 12 et x = 4.');
  qcm(F, 'Équations', 'Solutions de (x − 2)(x + 5) = 0 ?', ['2 et −5', '−2 et 5', '2 et 5', 'Seulement 2'], 'Un produit est nul si l’un des facteurs est nul.', 'x − 2 = 0 donne x = 2 ; x + 5 = 0 donne x = −5.');
  qcm(F, 'Calcul littéral', 'Développe (x + 3)(x − 3).', ['x² − 9', 'x² + 9', 'x² − 6x − 9', '2x'], 'x × x, x × (−3), 3 × x, 3 × (−3).', 'x² − 3x + 3x − 9 = x² − 9.');

  // ───────── Bloc du français ─────────
  const R = 'francais';
  qcm(R, 'Grammaire', 'Quelle est la nature du mot « rapidement » ?', ['Adverbe', 'Adjectif', 'Verbe', 'Nom'], 'Il modifie un verbe et ne s’accorde pas.', 'Les mots en -ment formés sur un adjectif sont souvent des adverbes : il ne s’accorde pas.');
  qcm(R, 'Grammaire', 'Fonction de « à sa sœur » dans « Il parle à sa sœur » ?', ['COI', 'COD', 'Sujet', 'Attribut du sujet'], 'Il parle à qui ? (avec une préposition)', 'Le complément est relié au verbe par la préposition « à » : COI.');
  qcm(R, 'Grammaire', 'Fonction de « fatigué » dans « Le grimpeur semble fatigué » ?', ['Attribut du sujet', 'COD', 'Épithète', 'Complément circonstanciel'], '« Sembler » est un verbe d’état.', 'Après un verbe d’état (être, sembler, paraître…), l’adjectif est attribut du sujet.');
  qcm(R, 'Grammaire', 'Dans « Je pense qu’il réussira », la proposition « qu’il réussira » est…', ['Subordonnée conjonctive complétive', 'Subordonnée relative', 'Proposition indépendante', 'Subordonnée circonstancielle de temps'], 'Elle complète le verbe « penser » et commence par « que ».', 'Introduite par la conjonction « que », elle est COD de « pense » : conjonctive complétive.');
  qcm(R, 'Grammaire', 'Dans « La voie que j’ai choisie est dure », « que j’ai choisie » est une…', ['Subordonnée relative', 'Subordonnée complétive', 'Proposition principale', 'Indépendante'], '« que » reprend le nom « voie ».', '« que » est un pronom relatif qui reprend « la voie » : subordonnée relative.');
  qcm(R, 'Conjugaison', 'Temps de « il grimpa » ?', ['Passé simple', 'Imparfait', 'Passé composé', 'Futur'], 'Temps du récit, action brève au passé.', '« grimpa » : passé simple (1er groupe : -ai, -as, -a…).');
  qcm(R, 'Conjugaison', 'Dans « Si j’avais su, je serais venu », « serais venu » est au…', ['Conditionnel passé', 'Plus-que-parfait', 'Futur antérieur', 'Subjonctif'], 'Après « si + plus-que-parfait »…', '« serais venu » : auxiliaire au conditionnel présent + participe passé = conditionnel passé.');
  saisie(R, 'Conjugaison', 'Mets au futur : « nous grimpons » → nous …', ['grimperons'], 'Infinitif + terminaison -ons.', 'Futur = infinitif + -ai, -as, -a, -ons, -ez, -ont : nous grimperons.');
  saisie(R, 'Conjugaison', '« venir » au passé simple, 3e personne du pluriel : ils …', ['vinrent'], 'Comme « ils tinrent ».', 'Venir au passé simple : je vins, il vint, ils vinrent.');
  saisie(R, 'Conjugaison', 'Il faut que tu … (être) prudent.', ['sois'], 'Après « il faut que » : subjonctif.', 'Subjonctif présent de « être » : que je sois, que tu sois.');
  saisie(R, 'Accords', 'Complète : « Les grimpeurs se sont … (préparer) avant l’ascension. »', ['préparés'], 'Verbe pronominal : ils ont préparé qui ? eux-mêmes.', '« se » (les grimpeurs) est COD placé avant : accord au masculin pluriel, préparés.');
  saisie(R, 'Accords', 'Complète : « Ces voies, je les ai toutes … (essayer). »', ['essayées'], 'Avec avoir, on accorde avec le COD s’il est placé avant.', '« les » = les voies (féminin pluriel), placé avant : essayées.');
  saisie(R, 'Accords', 'Complète : « Elle a … (finir) sa voie. »', ['fini'], 'Avec avoir, le COD « sa voie » est placé après.', 'COD après le verbe : pas d’accord. Elle a fini.');
  qcm(R, 'Accords', 'Choisis : « Les prises que j’ai … sont glissantes. »', ['serrées', 'serré', 'serrés', 'serrée'], '« que » reprend « les prises », placé avant le verbe.', 'COD « que » (= les prises, féminin pluriel) placé avant avoir : serrées.');
  qcm(R, 'Accords', 'Choisis : « Elle s’est … les mains. »', ['lavé', 'lavée', 'lavés', 'laver'], 'Elle a lavé quoi ? les mains (après le verbe).', 'Le COD « les mains » est placé après : pas d’accord. Elle s’est lavé les mains.');
  qcm(R, 'Homophones', '« Il … parti hier. »', ['est', 'et', 'ait', 'es'], 'Remplace par « était ».', '« Il était parti » fonctionne : c’est le verbe être, « est ».');
  qcm(R, 'Homophones', '« Ils … grimpé toute la journée. »', ['ont', 'on', 'onts', 'om'], 'Remplace par « avaient ».', '« Ils avaient grimpé » fonctionne : auxiliaire avoir, « ont ».');
  qcm(R, 'Homophones', '« … à moi, je reste au relais. »', ['Quant', 'Quand', 'Qu’en', 'Camp'], '« En ce qui concerne moi… »', '« Quant à » signifie « en ce qui concerne ». « Quand » indique le temps.');
  qcm(R, 'Homophones', '« Il … grimpé … Fontainebleau. »', ['a … à', 'à … a', 'a … a', 'à … à'], 'Le premier peut être remplacé par « avait ».', '« Il avait grimpé » : « a » (verbe avoir). Le second est une préposition de lieu : « à ».');
  qcm(R, 'Homophones', '« … que soient les obstacles, il continue. »', ['Quels', 'Quelles', 'Quel', 'Quelque'], '« quel que » s’accorde avec le sujet « les obstacles ».', '« Quel que soit » s’accorde avec le nom : obstacles est masculin pluriel → Quels que soient.');
  qcm(R, 'Figures de style', '« Cette falaise est un géant de pierre. »', ['Métaphore', 'Comparaison', 'Hyperbole', 'Personnification'], 'Pas d’outil de comparaison (comme, tel…).', 'Rapprochement direct sans « comme » : métaphore.');
  qcm(R, 'Figures de style', '« Il colle à la paroi comme un lézard. »', ['Comparaison', 'Métaphore', 'Antithèse', 'Litote'], 'Repère le mot « comme ».', 'Rapprochement avec un outil de comparaison (« comme ») : comparaison.');
  qcm(R, 'Figures de style', '« Je meurs de soif après cette voie ! »', ['Hyperbole', 'Litote', 'Euphémisme', 'Métaphore'], 'C’est une exagération.', 'Exagération volontaire pour frapper l’esprit : hyperbole.');
  qcm(R, 'Figures de style', '« Le vent hurlait dans la montagne. »', ['Personnification', 'Comparaison', 'Hyperbole', 'Anaphore'], 'Le vent fait une action humaine.', 'On prête une action humaine (hurler) à une chose : personnification.');
  qcm(R, 'Récit', '« Accroche-toi ! » cria-t-il. C’est du discours…', ['Direct', 'Indirect', 'Indirect libre', 'Narrativisé'], 'Les paroles sont rapportées telles quelles.', 'Guillemets et paroles exactes, avec un verbe de parole : discours direct.');
  qcm(R, 'Récit', 'Dans un récit à la 1re personne (« je »), le narrateur est…', ['Un personnage de l’histoire', 'L’auteur obligatoirement', 'Extérieur à l’histoire', 'Le lecteur'], 'Qui dit « je » dans l’histoire ?', 'Le narrateur qui dit « je » participe à l’histoire. Attention : ce n’est pas forcément l’auteur.');
  qcm(R, 'Vocabulaire', 'Synonyme de « audacieux » ?', ['Hardi', 'Peureux', 'Prudent', 'Fatigué'], 'Celui qui ose.', 'Audacieux = qui ose prendre des risques = hardi.');
  qcm(R, 'Vocabulaire', 'Le préfixe « im- » dans « impossible » exprime…', ['Le contraire', 'La répétition', 'L’intérieur', 'L’excès'], 'Possible / impossible…', 'im-, in-, il-, ir- expriment la négation, le contraire.');
  qcm(R, 'Vocabulaire', 'Corde, baudrier, mousqueton, relais : c’est le champ lexical de…', ['L’escalade', 'La pêche', 'La couture', 'La marine'], 'Pense à ton sport.', 'Tous ces mots se rapportent à l’escalade.');

  // ───────── Grande voie : histoire, géographie, EMC ─────────
  const H = 'histoire';
  saisie(H, 'Histoire', 'En quelle année commence la Première Guerre mondiale ?', ['1914'], 'Assassinat de Sarajevo, été…', 'La guerre commence en 1914 et se termine en 1918.', '', true);
  qcm(H, 'Histoire', 'Date de l’armistice de la Première Guerre mondiale ?', ['11 novembre 1918', '8 mai 1945', '14 juillet 1919', '11 novembre 1914'], 'C’est un jour férié en novembre.', 'L’armistice est signé le 11 novembre 1918. Le traité de Versailles suit en 1919.');
  saisie(H, 'Histoire', 'En quelle année a lieu la bataille de Verdun ?', ['1916'], 'Au milieu de la guerre.', 'Verdun : de février à décembre 1916, symbole de la guerre d’usure.');
  qcm(H, 'Histoire', 'Qui prend le pouvoir en Russie lors de la révolution d’octobre 1917 ?', ['Lénine et les bolcheviks', 'Staline', 'Le tsar Nicolas II', 'Trotski seul'], 'Le chef des bolcheviks.', 'En octobre 1917, Lénine et les bolcheviks prennent le pouvoir. Staline lui succède après 1924.');
  saisie(H, 'Histoire', 'En quelle année Hitler devient-il chancelier en Allemagne ?', ['1933'], 'Quelques années après la crise de 1929.', 'Hitler est nommé chancelier en janvier 1933.');
  qcm(H, 'Histoire', 'Le Goulag, en URSS, c’est…', ['Un système de camps de travail forcé', 'Le parlement soviétique', 'Une ville industrielle', 'La police secrète'], 'Les opposants de Staline y sont envoyés.', 'Le Goulag est le système des camps de travail forcé de l’URSS stalinienne.');
  qcm(H, 'Histoire', 'Quelle mesure le Front populaire adopte-t-il en 1936 ?', ['Les congés payés', 'Le droit de vote des femmes', 'La Sécurité sociale', 'L’abolition de la peine de mort'], 'Les ouvriers partent en vacances pour la 1re fois.', 'En 1936, le Front populaire (Léon Blum) instaure 2 semaines de congés payés et la semaine de 40 h.');
  qcm(H, 'Histoire', 'Dates de la Seconde Guerre mondiale ?', ['1939-1945', '1914-1918', '1940-1944', '1936-1945'], 'Commence avec l’invasion de la Pologne.', 'De septembre 1939 (invasion de la Pologne) à 1945 (capitulations de l’Allemagne en mai et du Japon en septembre).');
  qcm(H, 'Histoire', 'Qui lance l’appel du 18 juin 1940 depuis Londres ?', ['Le général de Gaulle', 'Le maréchal Pétain', 'Jean Moulin', 'Winston Churchill'], 'Futur président de la Ve République.', 'Le général de Gaulle appelle à poursuivre le combat : c’est le début de la France libre.');
  qcm(H, 'Histoire', 'Qui dirige le régime de Vichy, qui collabore avec l’Allemagne nazie ?', ['Le maréchal Pétain', 'Le général de Gaulle', 'Pierre Laval seul', 'Léon Blum'], 'Le « vainqueur de Verdun ».', 'Le maréchal Pétain dirige l’État français (Vichy) de 1940 à 1944.');
  qcm(H, 'Histoire', 'Comment appelle-t-on le génocide des Juifs par les nazis ?', ['La Shoah', 'La guerre froide', 'Le Blitz', 'Le Goulag'], 'Mot hébreu qui signifie « catastrophe ».', 'La Shoah : environ 6 millions de Juifs d’Europe assassinés.');
  saisie(H, 'Histoire', 'En quelle année les femmes obtiennent-elles le droit de vote en France ?', ['1944'], 'À la Libération.', 'Ordonnance du 21 avril 1944 ; elles votent pour la première fois en 1945.');
  qcm(H, 'Histoire', 'Construction et chute du mur de Berlin ?', ['1961 et 1989', '1945 et 1991', '1949 et 1989', '1961 et 1991'], 'Il tombe 2 ans avant la fin de l’URSS.', 'Le mur est construit en 1961 et tombe le 9 novembre 1989. L’URSS disparaît en 1991.');
  saisie(H, 'Histoire', 'En quelle année l’Algérie devient-elle indépendante ?', ['1962'], 'Accords d’Évian.', 'Accords d’Évian en mars 1962, indépendance en juillet 1962.');
  saisie(H, 'Histoire', 'En quelle année la Ve République est-elle fondée ?', ['1958'], 'Retour au pouvoir du général de Gaulle.', 'La Constitution de la Ve République est adoptée en 1958.');
  qcm(H, 'Histoire', 'Quel traité crée la CEE (ancêtre de l’Union européenne) en 1957 ?', ['Le traité de Rome', 'Le traité de Versailles', 'Le traité de Maastricht', 'Le traité de Lisbonne'], 'Signé dans une capitale italienne.', 'Le traité de Rome (1957) crée la Communauté économique européenne avec 6 pays.');
  qcm(H, 'Histoire', 'Quelle loi est votée en 1975 grâce à Simone Veil ?', ['La légalisation de l’IVG', 'Le droit de vote des femmes', 'La majorité à 18 ans', 'L’abolition de la peine de mort'], 'Elle concerne le droit des femmes à disposer de leur corps.', 'La loi Veil (1975) légalise l’interruption volontaire de grossesse.');
  saisie(H, 'Histoire', 'En quelle année la peine de mort est-elle abolie en France ?', ['1981'], 'Robert Badinter, sous Mitterrand.', 'Loi Badinter, octobre 1981.');
  qcm(H, 'Géographie', 'Une aire d’attraction d’une ville, c’est…', ['Une ville-centre et les communes dont les habitants y viennent travailler', 'Le centre historique d’une ville', 'Une zone commerciale', 'Une région administrative'], 'Pense aux trajets domicile-travail.', 'L’aire d’attraction regroupe un pôle (ville-centre) et une couronne de communes d’où beaucoup d’actifs viennent y travailler.');
  qcm(H, 'Géographie', 'La périurbanisation, c’est…', ['L’extension des villes vers les espaces ruraux voisins', 'Le retour des habitants au centre-ville', 'La construction de gratte-ciel', 'La disparition des villes'], 'Des lotissements à la campagne.', 'Les villes s’étalent vers les campagnes proches : maisons individuelles, longs trajets en voiture.');
  qcm(H, 'Géographie', 'Lequel est un territoire ultramarin (DROM) ?', ['La Guyane', 'La Corse', 'La Bretagne', 'Monaco'], 'Situé en Amérique du Sud.', 'La Guyane est un DROM, comme la Guadeloupe, la Martinique, La Réunion et Mayotte.');
  saisie(H, 'Géographie', 'Combien de pays membres compte l’Union européenne ?', ['27'], 'Depuis le départ du Royaume-Uni (2020).', '27 États membres depuis le Brexit en 2020.', '', true);
  qcm(H, 'Géographie', 'Une métropole, c’est…', ['Une grande ville qui concentre population, emplois et fonctions de commandement', 'Un village de montagne', 'Une ville de moins de 10 000 habitants', 'Une capitale obligatoirement'], 'Pense à Lyon, Marseille, Lille…', 'Une métropole concentre habitants, entreprises, universités, sièges de décision.');
  qcm(H, 'Géographie', 'Quelle est la monnaie unique d’une partie des pays de l’UE, en circulation depuis 2002 ?', ['L’euro', 'Le franc', 'Le dollar', 'L’écu'], 'Celle que tu utilises.', 'Les pièces et billets en euro circulent depuis le 1er janvier 2002.');
  qcm(H, 'EMC', 'Devise de la République française ?', ['Liberté, Égalité, Fraternité', 'Travail, Famille, Patrie', 'Unité, Progrès, Justice', 'Paix, Justice, Liberté'], 'Elle est inscrite sur les mairies.', '« Liberté, Égalité, Fraternité ». « Travail, Famille, Patrie » était la devise de Vichy.');
  saisie(H, 'EMC', 'En quelle année est votée la loi de séparation des Églises et de l’État ?', ['1905'], 'Début du XXe siècle.', 'La loi de 1905 fonde la laïcité : l’État ne reconnaît ni ne finance aucun culte.');
  saisie(H, 'EMC', 'À partir de quel âge peut-on voter en France ?', ['18'], 'L’âge de la majorité.', 'On vote à partir de 18 ans, si l’on est de nationalité française et inscrit sur les listes.', 'ans');
  qcm(H, 'EMC', 'Qui vote les lois en France ?', ['Le Parlement (Assemblée nationale et Sénat)', 'Le président de la République seul', 'Le Premier ministre', 'Le Conseil constitutionnel'], 'Les députés et les sénateurs.', 'Le Parlement, composé de l’Assemblée nationale et du Sénat, vote les lois (pouvoir législatif).');
  saisie(H, 'EMC', 'Pour combien d’années le président de la République est-il élu ?', ['5'], 'Le quinquennat.', 'Depuis 2000, le mandat est de 5 ans (quinquennat).', 'ans');

  // ───────── Grotte-labo : sciences (physique-chimie, SVT, technologie) ─────────
  const S = 'sciences';
  const PC = 'Physique-chimie', SV = 'SVT', TE = 'Technologie';
  qcm(S, PC, 'Formule chimique de la molécule d’eau ?', ['H₂O', 'CO₂', 'O₂', 'HO₂'], '2 atomes d’hydrogène, 1 d’oxygène.', 'H₂O : deux atomes d’hydrogène (H) et un atome d’oxygène (O).');
  qcm(S, PC, 'Unité de la tension électrique ?', ['Le volt (V)', 'L’ampère (A)', 'L’ohm (Ω)', 'Le watt (W)'], 'Elle se mesure avec un voltmètre.', 'Tension en volts (V), intensité en ampères (A), résistance en ohms (Ω), puissance en watts (W).');
  saisie(S, PC, 'Loi d’Ohm : R = 100 Ω et I = 0,05 A. Calcule la tension U.', ['5'], 'U = R × I.', 'U = 100 × 0,05 = 5 V.', 'V', true);
  saisie(S, PC, 'Un grimpeur parcourt 100 m en 20 s. Vitesse en m/s ?', ['5'], 'v = d ÷ t.', 'v = 100 ÷ 20 = 5 m/s.', 'm/s', true);
  saisie(S, PC, 'Masse 50 kg, g = 10 N/kg. Poids en newtons ?', ['500'], 'P = m × g.', 'P = 50 × 10 = 500 N. Le poids est une force (en N), la masse en kg.', 'N', true);
  qcm(S, PC, 'Une solution de pH = 3 est…', ['Acide', 'Neutre', 'Basique', 'Salée'], 'pH < 7…', 'pH < 7 : acide ; pH = 7 : neutre ; pH > 7 : basique.');
  qcm(S, PC, 'Si la vitesse d’un objet double, son énergie cinétique est multipliée par…', ['4', '2', '8', '1'], 'Ec = ½ × m × v² : la vitesse est au carré.', '(2v)² = 4v², donc l’énergie cinétique est multipliée par 4.');
  qcm(S, PC, 'Lors d’une transformation chimique, la masse totale…', ['Se conserve', 'Augmente', 'Diminue', 'Disparaît'], 'Lavoisier : « rien ne se perd… »', 'Les atomes se réarrangent mais ne disparaissent pas : la masse totale se conserve.');
  qcm(S, PC, 'Quelle particule de l’atome a une charge négative ?', ['L’électron', 'Le proton', 'Le neutron', 'Le noyau'], 'Elle tourne autour du noyau.', 'Les électrons sont négatifs ; le noyau (protons positifs + neutrons neutres) est positif.');
  qcm(S, PC, 'Vitesse de la lumière dans le vide, environ ?', ['300 000 km/s', '340 m/s', '300 km/h', '3 000 km/s'], '340 m/s, c’est la vitesse du son.', 'La lumière va à environ 300 000 km/s ; le son à environ 340 m/s dans l’air.');
  qcm(S, SV, 'Quelle molécule porte l’information génétique ?', ['L’ADN', 'Le glucose', 'L’hémoglobine', 'Le dioxygène'], 'Elle forme les chromosomes.', 'L’ADN, contenu dans les chromosomes du noyau, porte les gènes.');
  saisie(S, SV, 'Combien de chromosomes dans une cellule humaine (hors gamètes) ?', ['46'], '23 paires.', '23 paires, soit 46 chromosomes. Les gamètes n’en ont que 23.', '', true);
  qcm(S, SV, 'Les antibiotiques sont efficaces contre…', ['Les bactéries', 'Les virus', 'Les deux', 'Aucun microbe'], 'Ils sont inutiles contre la grippe.', 'Les antibiotiques agissent sur les bactéries, pas sur les virus.');
  qcm(S, SV, 'À quoi sert un vaccin ?', ['Créer une mémoire immunitaire contre un microbe', 'Tuer directement les bactéries', 'Remplacer les globules rouges', 'Soigner une maladie déjà déclarée'], 'Il prépare l’organisme à l’avance.', 'Le vaccin présente un microbe rendu inoffensif : l’organisme fabrique des lymphocytes mémoire.');
  qcm(S, SV, 'La photosynthèse produit…', ['Du dioxygène et de la matière organique', 'Du dioxyde de carbone', 'De l’azote', 'De l’eau uniquement'], 'Les plantes utilisent la lumière, l’eau et le CO₂.', 'Avec la lumière, la plante transforme CO₂ + eau en matière organique et rejette du dioxygène.');
  qcm(S, SV, 'Où a lieu la fécondation chez la femme ?', ['Dans une trompe', 'Dans l’ovaire', 'Dans l’utérus', 'Dans le vagin'], 'Entre l’ovaire et l’utérus.', 'La fécondation a lieu dans une trompe ; l’embryon s’implante ensuite dans l’utérus.');
  qcm(S, SV, 'Quelles cellules produisent les anticorps ?', ['Les lymphocytes B', 'Les globules rouges', 'Les neurones', 'Les lymphocytes T uniquement'], 'Des globules blancs.', 'Les lymphocytes B produisent les anticorps ; les lymphocytes T détruisent les cellules infectées.');
  qcm(S, SV, 'Où se produisent surtout les séismes ?', ['Aux limites des plaques', 'Au centre des plaques', 'Au hasard partout', 'Seulement sous les océans'], 'La Terre est découpée en plaques qui bougent.', 'Les séismes et volcans se concentrent aux frontières des plaques lithosphériques.');
  qcm(S, SV, 'Pendant l’effort (escalade !), le rythme cardiaque augmente pour…', ['Apporter plus de dioxygène et de glucose aux muscles', 'Refroidir le corps', 'Produire des anticorps', 'Fabriquer des muscles'], 'De quoi les muscles ont-ils besoin ?', 'Les muscles consomment plus de dioxygène et de glucose : cœur et respiration accélèrent.');
  qcm(S, SV, 'Combien de chromosomes contient un gamète humain ?', ['23', '46', '92', '22'], 'La moitié d’une cellule normale.', 'Les gamètes (spermatozoïde, ovule) ont 23 chromosomes ; la fécondation reconstitue 46.');
  qcm(S, TE, 'Dans un objet automatisé, un moteur est…', ['Un actionneur', 'Un capteur', 'Une interface', 'Un programme'], 'Il agit, il ne mesure pas.', 'Les actionneurs agissent (moteur, lampe, buzzer) ; les capteurs acquièrent une information.');
  qcm(S, TE, 'Un capteur de luminosité sert à…', ['Acquérir une information', 'Agir sur l’environnement', 'Stocker de l’énergie', 'Transmettre du courant'], 'Il « mesure ».', 'Le capteur acquiert une information (ici la lumière) qui sera traitée par le programme.');
  saisie(S, TE, '1 octet = combien de bits ?', ['8'], 'Un bit vaut 0 ou 1.', '1 octet = 8 bits.', '', true);
  qcm(S, TE, '« Si … alors … sinon » est une structure…', ['Conditionnelle', 'Répétitive (boucle)', 'Séquentielle', 'Aléatoire'], 'Elle dépend d’une condition.', 'C’est une structure conditionnelle : on exécute un bloc ou l’autre selon une condition.');
  qcm(S, TE, '« Répéter 10 fois » est une structure…', ['Itérative (boucle)', 'Conditionnelle', 'Événementielle', 'Séquentielle simple'], 'On recommence plusieurs fois.', 'Répéter = boucle = structure itérative.');
  qcm(S, TE, 'Quelle énergie est renouvelable ?', ['Solaire', 'Pétrole', 'Charbon', 'Gaz naturel'], 'Elle ne s’épuise pas à notre échelle.', 'Solaire, éolien, hydraulique sont renouvelables ; pétrole, charbon et gaz sont fossiles.');
  qcm(S, TE, 'Le cahier des charges d’un objet décrit…', ['Le besoin et les contraintes à respecter', 'Le prix de vente', 'Le mode d’emploi', 'La publicité'], 'On l’écrit avant de concevoir.', 'Il précise les fonctions attendues et les contraintes (taille, coût, sécurité…).');
  qcm(S, TE, 'Une adresse IP sert à…', ['Identifier un appareil sur un réseau', 'Mesurer la vitesse internet', 'Protéger contre les virus', 'Stocker des fichiers'], 'Comme une adresse postale pour les ordinateurs.', 'L’adresse IP identifie chaque appareil connecté pour que les données arrivent au bon endroit.');
  qcm(S, TE, 'Quel matériau est un bon conducteur électrique ?', ['Le cuivre', 'Le bois', 'Le plastique', 'Le verre'], 'Il est dans les câbles électriques.', 'Les métaux comme le cuivre conduisent le courant ; bois, plastique et verre sont isolants.');
  qcm(S, TE, 'Dans le cycle de vie d’un objet, le recyclage intervient…', ['En fin de vie', 'À la conception', 'Pendant la fabrication uniquement', 'Pendant la publicité'], 'Quand l’objet n’est plus utilisé.', 'Cycle de vie : extraction des matières, fabrication, transport, utilisation, fin de vie (recyclage).');

  // Codes secrets imprimés dans les corrigés des sujets papier, rangés par sujet puis par note.
  // Seule l'empreinte est stockée (voir Logique.empreinte), pas le code en clair.
  const CODES_PAPIER = [
    { sujet: 1, empreinte: '18q8qb', bonus: 150, nom: 'Sujet papier n°1 (moins de 8/20)' },
    { sujet: 1, empreinte: '18fgw0w', bonus: 250, nom: 'Sujet papier n°1 (8 à 11,5/20)' },
    { sujet: 1, empreinte: 'oq3gea', bonus: 350, nom: 'Sujet papier n°1 (12 à 15,5/20)' },
    { sujet: 1, empreinte: '1ouo0w7', bonus: 500, nom: 'Sujet papier n°1 (16/20 et plus)' },
    { sujet: 2, empreinte: 'kxgfwo', bonus: 200, nom: 'Sujet papier n°2 (moins de 8/20)' },
    { sujet: 2, empreinte: 'o4mp55', bonus: 300, nom: 'Sujet papier n°2 (8 à 11,5/20)' },
    { sujet: 2, empreinte: 'yfpp4h', bonus: 450, nom: 'Sujet papier n°2 (12 à 15,5/20)' },
    { sujet: 2, empreinte: 'hk225s', bonus: 600, nom: 'Sujet papier n°2 (16/20 et plus)' },
  ];

  const exports = { QUESTIONS, ZONES, CODES_PAPIER };
  if (typeof module !== 'undefined' && module.exports) module.exports = exports;
  else racine.Banque = exports;
})(typeof globalThis !== 'undefined' ? globalThis : this);
