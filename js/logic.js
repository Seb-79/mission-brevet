// Logique pure du jeu Mission Brevet : aucune dépendance au navigateur,
// pour pouvoir être testée avec Node (tests/logic.test.js).
(function (racine) {
  // Échelle des cotations : nombre de mètres grimpés pour atteindre chaque niveau.
  const COTATIONS = [
    { nom: '4a', seuil: 0 },
    { nom: '4b', seuil: 50 },
    { nom: '4c', seuil: 100 },
    { nom: '5a', seuil: 180 },
    { nom: '5b', seuil: 280 },
    { nom: '5c', seuil: 400 },
    { nom: '6a', seuil: 550 },
    { nom: '6b', seuil: 730 },
    { nom: '6c', seuil: 950 },
    { nom: '7a', seuil: 1200 },
    { nom: '7b', seuil: 1500 },
    { nom: '7c', seuil: 1850 },
    { nom: '8a', seuil: 2250 },
  ];

  // Zones dont les bonnes réponses comptent double (les maths, point faible à travailler).
  const ZONES_DOUBLES = ['echauffement', 'falaise'];

  /** Renvoie l'index de la cotation atteinte pour un total de mètres. */
  function indexCotation(metres) {
    let i = 0;
    while (i + 1 < COTATIONS.length && metres >= COTATIONS[i + 1].seuil) i++;
    return i;
  }

  /** Renvoie la cotation (objet {nom, seuil}) atteinte avec ce total de mètres. */
  function cotationPour(metres) {
    return COTATIONS[indexCotation(metres)];
  }

  /** Avancement (0 à 1) entre la cotation actuelle et la suivante ; 1 au sommet de l'échelle. */
  function progressionCotation(metres) {
    const i = indexCotation(metres);
    if (i === COTATIONS.length - 1) return 1;
    const bas = COTATIONS[i].seuil;
    const haut = COTATIONS[i + 1].seuil;
    return (metres - bas) / (haut - bas);
  }

  /**
   * Mètres gagnés pour une réponse.
   * Base 10 m, x2 en maths, combo x2 dès 3 bonnes réponses d'affilée et x3 dès 6,
   * moitié si un indice a été utilisé, 0 si chute (jamais de perte).
   * `combo` = nombre de bonnes réponses consécutives AVANT celle-ci.
   */
  function metresGagnes({ correct, combo, zone, indice }) {
    if (!correct) return 0;
    let m = 10;
    if (ZONES_DOUBLES.includes(zone)) m *= 2;
    if (combo >= 6) m *= 3;
    else if (combo >= 3) m *= 2;
    if (indice) m = Math.round(m / 2);
    return m;
  }

  /** Nombre de jours entre deux dates 'AAAA-MM-JJ' (calcul en UTC, sans souci d'heure d'été). */
  function ecartJours(a, b) {
    const ms = Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z');
    return Math.round(ms / 86400000);
  }

  /** Met à jour la série de jours de grimpe consécutifs pour la date du jour. */
  function majSerie(serie, aujourdhui) {
    if (!serie.dernier) return { jours: 1, dernier: aujourdhui };
    const ecart = ecartJours(serie.dernier, aujourdhui);
    if (ecart <= 0) return { jours: serie.jours, dernier: serie.dernier };
    if (ecart === 1) return { jours: serie.jours + 1, dernier: aujourdhui };
    return { jours: 1, dernier: aujourdhui };
  }

  /** Nettoie une saisie : minuscules, espaces superflus, apostrophes typographiques. */
  function normaliserTexte(s) {
    return String(s).trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ');
  }

  /** Nettoie une saisie numérique : virgule -> point, aucun espace, signe moins typographique. */
  function normaliserNombre(s) {
    return String(s).replace(/\s+/g, '').replace(/,/g, '.').replace(/−/g, '-').toLowerCase();
  }

  /** Vrai si la réponse donnée est correcte pour la question (QCM par index ou saisie libre). */
  function verifierReponse(question, donnee) {
    if (question.type === 'qcm') return donnee === question.reponse;
    if (String(donnee).trim() === '') return false;
    const numerique = ZONES_DOUBLES.includes(question.zone) || question.numerique === true;
    const norm = numerique ? normaliserNombre : normaliserTexte;
    const d = norm(donnee);
    return question.reponse.some((r) => norm(r) === d);
  }

  /** Empreinte courte (hash djb2) d'un texte : évite d'écrire les codes secrets en clair dans le code. */
  function empreinte(texte) {
    let h = 5381;
    for (const c of String(texte)) h = ((h * 33) ^ c.codePointAt(0)) >>> 0;
    return h.toString(36);
  }

  /** Vérifie un code secret de sujet papier : {ok, bonus, nom, empreinte} ou {ok:false, raison}. */
  function validerCode(saisie, codes, dejaUtilises) {
    const e = empreinte(String(saisie).trim().toUpperCase().replace(/\s+/g, ''));
    const code = codes.find((c) => c.empreinte === e);
    if (!code) return { ok: false, raison: 'inconnu' };
    if (dejaUtilises.includes(e)) return { ok: false, raison: 'deja' };
    return { ok: true, bonus: code.bonus, nom: code.nom, empreinte: e };
  }

  /** Mélange un tableau sur place (Fisher-Yates) avec la fonction d'aléa fournie. */
  function melanger(tab, alea) {
    for (let i = tab.length - 1; i > 0; i--) {
      const j = Math.floor(alea() * (i + 1));
      [tab[i], tab[j]] = [tab[j], tab[i]];
    }
    return tab;
  }

  /**
   * Tire `n` questions distinctes d'une zone. Jusqu'à 3 questions déjà ratées
   * (`ratees` = liste d'ids) sont reprises en priorité, le reste est tiré au hasard.
   */
  function tirerVoie(banque, zone, n, alea, ratees) {
    const pool = banque.filter((q) => q.zone === zone);
    const aRevoir = melanger(pool.filter((q) => (ratees || []).includes(q.id)), alea).slice(0, 3);
    const reste = melanger(pool.filter((q) => !aRevoir.includes(q)), alea);
    return melanger(aRevoir.concat(reste.slice(0, Math.max(0, n - aRevoir.length))), alea);
  }

  const L = {
    COTATIONS,
    cotationPour,
    progressionCotation,
    metresGagnes,
    majSerie,
    verifierReponse,
    empreinte,
    validerCode,
    tirerVoie,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = L;
  else racine.Logique = L;
})(typeof globalThis !== 'undefined' ? globalThis : this);
