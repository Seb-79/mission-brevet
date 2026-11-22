// Interface de Mission Brevet : écrans, sauvegarde locale, chrono, sons et fête.
// La logique de calcul (points, cotations, codes) est dans js/logic.js.
(function () {
  'use strict';

  const L = window.Logique;
  const { QUESTIONS, ZONES, CODES_PAPIER } = window.Banque;
  const CLE = 'missionBrevet.v1';
  const TAILLE_VOIE = 10;
  const DECO_MUR = [
    ['jaune', 12, 8], ['magenta', 58, 22], ['cyan', 18, 37], ['orange', 60, 51],
    ['vert', 10, 66], ['magenta', 55, 79], ['jaune', 22, 92],
  ];

  const ecran = document.getElementById('ecran');
  const bandeau = document.getElementById('bandeau');
  const fete = document.getElementById('fete');

  let etat = charger();
  let voie = null;
  let chrono = null;
  let audio = null;

  // ───────── Sauvegarde ─────────

  /** Lit l'état sauvegardé dans le navigateur ; repart à zéro si absent ou illisible. */
  function charger() {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) return JSON.parse(brut);
    } catch (e) { /* stockage indisponible (navigation privée) : on joue sans sauvegarde */ }
    return { actif: null, profils: {}, son: true };
  }

  /** Enregistre l'état courant dans le navigateur (sans planter si le stockage est bloqué). */
  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* ignoré */ }
  }

  /** Renvoie le profil du grimpeur actif, ou null. */
  function profilActif() {
    return etat.profils[etat.actif] || null;
  }

  /** Crée un nouveau profil de grimpeur et le rend actif. */
  function creerProfil(pseudo) {
    const id = 'p' + Date.now().toString(36);
    etat.profils[id] = { id, pseudo, metres: 0, serie: { jours: 0, dernier: null }, codes: [], ratees: [], stats: {} };
    etat.actif = id;
    sauver();
  }

  // ───────── Outils ─────────

  /** Date du jour au format AAAA-MM-JJ, à l'heure locale. */
  function aujourdhui() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /** Échappe un texte pour l'insérer sans risque dans du HTML. */
  function echapper(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /** Mélange une copie d'un tableau (pour l'ordre d'affichage des choix). */
  function melange(tab) {
    const t = tab.slice();
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  }

  /** Trouve la description d'un secteur à partir de son identifiant. */
  function zone(id) {
    return ZONES.find((z) => z.id === id);
  }

  /** Remplace le contenu de l'écran principal et remet le focus en haut (accessibilité). */
  function afficher(html) {
    ecran.innerHTML = html;
    window.scrollTo(0, 0);
  }

  // ───────── Sons (Web Audio, sans fichier) ─────────

  /** Joue une petite suite de notes : 'ok' (prise tenue), 'ko' (chute) ou 'fete'. */
  function son(type) {
    if (!etat.son) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { ok: [660, 880], ko: [220, 165], fete: [523, 659, 784, 1047] }[type];
      notes.forEach((f, i) => {
        const o = audio.createOscillator();
        const g = audio.createGain();
        o.type = type === 'ko' ? 'triangle' : 'sine';
        o.frequency.value = f;
        const t = audio.currentTime + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g).connect(audio.destination);
        o.start(t);
        o.stop(t + 0.25);
      });
    } catch (e) { /* audio indisponible : tant pis */ }
  }

  // ───────── Bandeau (cotation actuelle) ─────────

  /** Affiche le bandeau du haut : cotation, mètres, jauge, série et boutons. */
  function rendreBandeau() {
    const p = profilActif();
    if (!p) { bandeau.innerHTML = ''; return; }
    const cot = L.cotationPour(p.metres);
    const idx = L.COTATIONS.indexOf(cot);
    const suivante = L.COTATIONS[idx + 1];
    const pct = Math.round(L.progressionCotation(p.metres) * 100);
    const detail = suivante
      ? (suivante.seuil - p.metres) + ' m avant le ' + suivante.nom
      : 'Sommet atteint : tu es une légende';
    bandeau.innerHTML =
      '<div class="bandeau-in">' +
        '<div class="cotation-actuelle" aria-label="Cotation ' + cot.nom + '">' + cot.nom + '</div>' +
        '<div class="bandeau-infos">' +
          '<div class="bandeau-nom">' + echapper(p.pseudo) + ' · ' + p.metres + ' m grimpés</div>' +
          '<div class="jauge" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
          '<div class="bandeau-detail">' + detail + '</div>' +
        '</div>' +
        '<div class="bandeau-actions">' +
          '<span class="pastille" title="Jours de grimpe d’affilée">🔥 ' + p.serie.jours + ' jour' + (p.serie.jours > 1 ? 's' : '') + '</span>' +
          '<button class="bouton-bandeau" data-action="son">' + (etat.son ? 'Son activé' : 'Son coupé') + '</button>' +
          '<button class="bouton-bandeau" data-action="profils">Changer de grimpeur</button>' +
        '</div>' +
      '</div>';
  }

  // ───────── Écran : choix du grimpeur ─────────

  /** Écran d'accueil : choisir son profil ou en créer un (le prénom reste sur cet appareil). */
  function ecranProfils() {
    voie = null;
    arreterChrono();
    const profils = Object.values(etat.profils);
    rendreBandeau();
    afficher(
      '<section class="accueil">' +
        '<h1>Mission Brevet</h1>' +
        '<p class="sous-titre">Grimpe de 4a à 8a en révisant le brevet. Chaque bonne réponse te fait monter.</p>' +
        (profils.length
          ? '<div class="profils">' + profils.map((p) =>
              '<button class="secteur" data-action="choisir" data-id="' + p.id + '">' +
                '<span class="prise jaune"></span>' +
                '<span class="secteur-texte"><span class="secteur-nom">' + echapper(p.pseudo) + '</span>' +
                '<span class="secteur-matiere">' + L.cotationPour(p.metres).nom + ' · ' + p.metres + ' m</span></span>' +
              '</button>').join('') + '</div>'
          : '') +
        '<form class="carte" data-form="profil">' +
          '<label for="pseudo"><strong>' + (profils.length ? 'Nouveau grimpeur' : 'Qui grimpe ?') + '</strong></label>' +
          '<div class="ligne-code"><input type="text" id="pseudo" maxlength="20" autocomplete="off" placeholder="Ton prénom ou ton pseudo">' +
          '<button class="bouton" type="submit">Entrer dans la salle</button></div>' +
          '<p class="message ko" id="msg-profil" aria-live="polite"></p>' +
          '<p class="sous-titre">Ton prénom reste uniquement sur cet appareil.</p>' +
        '</form>' +
      '</section>'
    );
  }

  // ───────── Écran : le mur (accueil du grimpeur) ─────────

  /** Dessine la topo verticale : graduations de cotation, corde et position du grimpeur. */
  function rendreMur(p) {
    const n = L.COTATIONS.length;
    const idx = L.COTATIONS.indexOf(L.cotationPour(p.metres));
    const position = (i) => 4 + (i / (n - 1)) * 90;
    const ici = Math.min(94, position(idx + L.progressionCotation(p.metres)));
    const deco = DECO_MUR.map(([c, x, y]) =>
      '<span class="prise deco ' + c + '" style="left:' + x + '%;top:' + y + '%"></span>').join('');
    const grad = L.COTATIONS.map((c, i) =>
      '<span class="mur-graduation' + (i <= idx ? ' atteinte' : '') + '" style="bottom:' + position(i) + '%">' + c.nom + '</span>').join('');
    return '<div class="mur" aria-label="Ta position sur le mur : ' + L.cotationPour(p.metres).nom + '">' + deco + grad +
      '<span class="corde" style="height:' + (100 - ici) + '%"></span>' +
      '<span class="grimpeur" style="bottom:' + ici + '%">' + echapper(p.pseudo.charAt(0).toUpperCase()) + '</span>' +
    '</div>';
  }

  /** Écran principal : le mur, les 5 secteurs, le code du sujet papier, le classement. */
  function ecranMur() {
    voie = null;
    arreterChrono();
    const p = profilActif();
    if (!p) return ecranProfils();
    rendreBandeau();
    const secteurs = ZONES.map((z) => {
      const st = p.stats[z.id] || { bonnes: 0, total: 0, voies: 0 };
      const double = z.id === 'echauffement' || z.id === 'falaise';
      return '<button class="secteur" data-action="grimper" data-zone="' + z.id + '">' +
        '<span class="prise ' + z.couleur + '"></span>' +
        '<span class="secteur-texte">' +
          '<span class="secteur-nom">' + z.nom + (double ? '<span class="badge-double">mètres x2</span>' : '') + '</span>' +
          '<span class="secteur-matiere">' + z.matiere + '<span class="secteur-desc"> — ' + z.description + '</span></span>' +
        '</span>' +
        '<span class="secteur-stat"><strong>' + st.voies + '</strong>voie' + (st.voies > 1 ? 's' : '') + '</span>' +
      '</button>';
    }).join('');
    const classement = Object.values(etat.profils).sort((a, b) => b.metres - a.metres).map((q, i) =>
      '<li class="' + (q.id === p.id ? 'moi' : '') + '"><span class="rang">' + (i + 1) + '</span>' +
      '<span class="qui">' + echapper(q.pseudo) + ' · ' + q.metres + ' m</span>' +
      '<span class="cot">' + L.cotationPour(q.metres).nom + '</span></li>').join('');
    afficher(
      '<div class="salle">' + rendreMur(p) +
        '<div class="colonne">' +
          '<div><h1>Choisis ta voie</h1><p class="sous-titre">10 prises par voie. Une chute ne fait rien perdre : la corde te rattrape et tu vois la solution.</p></div>' +
          secteurs +
          '<div class="carte carte-verrou"><span class="prise magenta" aria-hidden="true"></span><div><h3>Le projet : brevet blanc en conditions réelles</h3>' +
            '<p class="message">Se débloque le week-end prochain : sciences de 8 h à 9 h, puis maths de 10 h à 12 h, comme le 28 juin.</p></div></div>' +
          '<form class="carte" data-form="code"><h3>Carnet de croix : sujet papier</h3>' +
            '<p class="message">Tu as fait un sujet de maths sur papier ? Après correction, ton parent te donne un code qui rapporte des mètres.</p>' +
            '<div class="ligne-code"><label class="evitement" for="code">Code du corrigé</label><input type="text" id="code" autocomplete="off" placeholder="EXEMPLE-00">' +
            '<button class="bouton" type="submit">Valider le code</button></div>' +
            '<p class="message" id="msg-code" aria-live="polite"></p></form>' +
          '<div class="carte"><h3>Classement de la salle</h3><ol class="classement">' + classement + '</ol>' +
            '<p class="message">Ajoute un autre grimpeur sur cet appareil avec « Changer de grimpeur ».</p></div>' +
        '</div>' +
      '</div>'
    );
  }

  // ───────── Écran : une voie (série de 10 questions) ─────────

  /** Démarre une voie de 10 questions dans un secteur. */
  function lancerVoie(zoneId) {
    const p = profilActif();
    const questions = L.tirerVoie(QUESTIONS, zoneId, TAILLE_VOIE, Math.random, p.ratees);
    voie = { zone: zone(zoneId), questions, i: 0, combo: 0, resultats: [], indice: false, repondu: false, gain: 0, ordre: null };
    afficherQuestion();
  }

  /** Affiche la question courante de la voie (QCM en prises, ou champ de saisie). */
  function afficherQuestion() {
    const q = voie.questions[voie.i];
    voie.indice = false;
    voie.repondu = false;
    voie.ordre = q.type === 'qcm' ? melange(q.choix.map((_, k) => k)) : null;
    const prises = voie.questions.map((_, k) => {
      const r = voie.resultats[k];
      const cls = r ? (r.correct ? 'tenue' : 'chute') : (k === voie.i ? 'courante' : '');
      return '<span class="prise ' + cls + '"></span>';
    }).join('');
    const lettres = ['A', 'B', 'C', 'D', 'E'];
    const reponse = q.type === 'qcm'
      ? '<div class="choix">' + voie.ordre.map((k, n) =>
          '<button data-action="choix" data-k="' + k + '"><span class="prise ' + voie.zone.couleur + '">' + lettres[n] + '</span><span>' + q.choix[k] + '</span></button>').join('') + '</div>'
      : '<form class="saisie" data-form="saisie"><label class="evitement" for="rep">Ta réponse</label>' +
          '<input type="text" id="rep" inputmode="' + (q.zone === 'francais' ? 'text' : 'decimal') + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ta réponse">' +
          (q.unite ? '<span class="unite">' + q.unite + '</span>' : '') +
          '<button class="bouton" type="submit">Valider</button></form><p class="erreur-saisie" id="err" aria-live="polite"></p>';
    afficher(
      '<div class="voie-entete"><span class="prise ' + voie.zone.couleur + '"></span>' +
        '<div class="voie-titre"><h2>' + voie.zone.nom + '</h2><p class="sous-titre">Prise ' + (voie.i + 1) + ' sur ' + voie.questions.length + '</p></div>' +
        (voie.combo >= 3 ? '<span class="combo">Combo x' + (voie.combo >= 6 ? 3 : 2) + '</span>' : '') +
        '<button class="bouton secondaire" data-action="mur">Redescendre</button></div>' +
      '<div class="prises-voie" aria-hidden="true">' + prises + '</div>' +
      (voie.zone.chrono ? '<div class="chrono" aria-hidden="true"><span id="chrono"></span></div>' : '') +
      '<section class="question" id="question"><p class="question-theme">' + q.theme + '</p>' +
        '<p class="question-enonce">' + q.enonce + '</p>' + reponse +
        '<div class="outils"><button class="bouton secondaire" data-action="indice">Lire la voie (indice, mètres ÷ 2)</button></div>' +
        '<div id="zone-indice"></div><div id="zone-retour" aria-live="polite"></div>' +
      '</section>'
    );
    const champ = document.getElementById('rep');
    if (champ) champ.focus();
    if (voie.zone.chrono) demarrerChrono(voie.zone.chrono);
  }

  /** Lance le compte à rebours de l'échauffement ; à zéro, c'est une chute. */
  function demarrerChrono(secondes) {
    arreterChrono();
    const barre = document.getElementById('chrono');
    const debut = performance.now();
    chrono = setInterval(() => {
      const reste = 1 - (performance.now() - debut) / (secondes * 1000);
      if (barre) barre.style.transform = 'scaleX(' + Math.max(0, reste) + ')';
      if (reste <= 0) { arreterChrono(); repondre(null, true); }
    }, 100);
  }

  /** Arrête le compte à rebours en cours. */
  function arreterChrono() {
    if (chrono) clearInterval(chrono);
    chrono = null;
  }

  /** Affiche l'indice de la question courante (le gain sera divisé par deux). */
  function montrerIndice() {
    if (voie.repondu || voie.indice) return;
    voie.indice = true;
    document.getElementById('zone-indice').innerHTML = '<div class="indice"><strong>Lecture de la voie : </strong>' + voie.questions[voie.i].indice + '</div>';
  }

  /** Corrige la réponse, met à jour mètres, combo, stats et questions à revoir, puis affiche le retour. */
  function repondre(donnee, tempsEcoule) {
    if (voie.repondu) return;
    const q = voie.questions[voie.i];
    voie.repondu = true;
    arreterChrono();
    const p = profilActif();
    const correct = !tempsEcoule && L.verifierReponse(q, donnee);
    const gain = L.metresGagnes({ correct, combo: voie.combo, zone: q.zone, indice: voie.indice });
    const avant = L.COTATIONS.indexOf(L.cotationPour(p.metres));
    voie.combo = correct ? voie.combo + 1 : 0;
    voie.gain += gain;
    voie.resultats.push({ q, correct, donnee });
    p.metres += gain;
    const st = p.stats[q.zone] || (p.stats[q.zone] = { bonnes: 0, total: 0, voies: 0 });
    st.total += 1;
    if (correct) { st.bonnes += 1; p.ratees = p.ratees.filter((id) => id !== q.id); }
    else if (!p.ratees.includes(q.id)) p.ratees.push(q.id);
    sauver();

    if (q.type === 'qcm') {
      document.querySelectorAll('.choix button').forEach((b) => {
        const k = Number(b.dataset.k);
        b.disabled = true;
        if (k === q.reponse) b.classList.add('bonne');
        else if (k === donnee) b.classList.add('mauvaise');
      });
    } else {
      const champ = document.getElementById('rep');
      if (champ) champ.disabled = true;
    }
    const bonneReponse = q.type === 'qcm' ? q.choix[q.reponse] : q.reponse[0].replace('.', ',') + (q.unite ? ' ' + q.unite : '');
    const titre = correct
      ? (voie.combo >= 3 ? 'Prise tenue, combo ' + voie.combo + ' !' : 'Prise tenue !')
      : (tempsEcoule ? 'Temps écoulé : chute !' : 'Chute ! La corde t’a rattrapé.');
    const dernier = voie.i === voie.questions.length - 1;
    document.getElementById('zone-retour').innerHTML =
      '<div class="retour ' + (correct ? 'ok' : 'ko') + '">' +
        '<p class="retour-titre">' + titre + (gain ? ' +' + gain + ' m' : '') + '</p>' +
        (correct ? '' : '<p>Bonne réponse : <strong>' + bonneReponse + '</strong></p>') +
        '<p class="solution"><strong>Méthode : </strong>' + q.solution + '</p>' +
        '<button class="bouton" data-action="suivante" id="suivante">' + (dernier ? 'Arriver au relais' : 'Prise suivante') + '</button>' +
      '</div>';
    son(correct ? 'ok' : 'ko');
    if (!correct) document.getElementById('question').classList.add('secoue');
    rendreBandeau();
    const apres = L.COTATIONS.indexOf(L.cotationPour(p.metres));
    if (apres > avant) feter(L.COTATIONS[apres].nom);
    document.getElementById('suivante').focus();
  }

  /** Passe à la question suivante, ou au bilan en fin de voie. */
  function priseSuivante() {
    if (voie.i < voie.questions.length - 1) { voie.i += 1; afficherQuestion(); }
    else ecranBilan();
  }

  // ───────── Écran : bilan de la voie ─────────

  /** Bilan au relais : mètres gagnés, réussites, série du jour et chutes à revoir. */
  function ecranBilan() {
    const p = profilActif();
    const st = p.stats[voie.zone.id];
    st.voies += 1;
    p.serie = L.majSerie(p.serie, aujourdhui());
    sauver();
    rendreBandeau();
    const bonnes = voie.resultats.filter((r) => r.correct).length;
    const total = voie.resultats.length;
    const chutes = voie.resultats.filter((r) => !r.correct);
    const titre = bonnes === total ? 'Voie enchaînée à vue !' : bonnes >= total * 0.7 ? 'Belle voie, presque enchaînée' : 'Au relais : on retente ?';
    afficher(
      '<h1>' + titre + '</h1><p class="sous-titre">' + voie.zone.nom + ' · ' + voie.zone.matiere + '</p>' +
      '<div class="bilan-chiffres">' +
        '<div class="chiffre"><strong>+' + voie.gain + ' m</strong><span>grimpés sur cette voie</span></div>' +
        '<div class="chiffre"><strong>' + bonnes + '/' + total + '</strong><span>prises tenues</span></div>' +
        '<div class="chiffre"><strong>' + L.cotationPour(p.metres).nom + '</strong><span>ta cotation</span></div>' +
        '<div class="chiffre"><strong>🔥 ' + p.serie.jours + '</strong><span>jour' + (p.serie.jours > 1 ? 's' : '') + ' de grimpe d’affilée</span></div>' +
      '</div>' +
      (chutes.length
        ? '<h2>Tes chutes à revoir</h2><p class="sous-titre">Elles reviendront dans tes prochaines voies : c’est là qu’on progresse.</p><ul class="liste-chutes">' +
          chutes.map((r) => '<li><p class="q">' + r.q.enonce + '</p><p>' + r.q.solution + '</p></li>').join('') + '</ul>'
        : '<p>Aucune chute : tu peux tenter un autre secteur.</p>') +
      '<div class="actions"><button class="bouton" data-action="grimper" data-zone="' + voie.zone.id + '">Refaire une voie ici</button>' +
      '<button class="bouton secondaire" data-action="mur">Retour au mur</button></div>'
    );
  }

  // ───────── Codes des sujets papier ─────────

  /** Vérifie le code saisi (corrigé papier) et crédite les mètres bonus une seule fois. */
  function validerCodePapier(saisie) {
    const p = profilActif();
    const msg = document.getElementById('msg-code');
    if (!saisie.trim()) { msg.className = 'message ko'; msg.textContent = 'Tape le code écrit en bas du corrigé.'; return; }
    const r = L.validerCode(saisie, CODES_PAPIER, p.codes);
    if (!r.ok) {
      msg.className = 'message ko';
      msg.textContent = r.raison === 'deja' ? 'Ce code a déjà été utilisé.' : 'Code inconnu. Vérifie les lettres et le tiret.';
      return;
    }
    const avant = L.COTATIONS.indexOf(L.cotationPour(p.metres));
    p.codes.push(r.empreinte);
    p.metres += r.bonus;
    sauver();
    ecranMur();
    const m = document.getElementById('msg-code');
    m.className = 'message ok';
    m.textContent = r.nom + ' validé : +' + r.bonus + ' m !';
    son('fete');
    const apres = L.COTATIONS.indexOf(L.cotationPour(p.metres));
    if (apres > avant) feter(L.COTATIONS[apres].nom);
  }

  // ───────── Fête : nouvelle cotation ─────────

  /** Nuage de magnésie et grande annonce quand le grimpeur passe une cotation. */
  function feter(nom) {
    son('fete');
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let html = '<div class="fete-texte"><span>Nouvelle cotation</span><strong>' + nom + '</strong></div>';
    if (!reduit) {
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        const d = 120 + Math.random() * 160;
        html += '<span class="poussiere" style="left:50%;top:50%;--dx:' + Math.round(Math.cos(a) * d) + 'px;--dy:' + Math.round(Math.sin(a) * d) + 'px"></span>';
      }
    }
    fete.innerHTML = html;
    setTimeout(() => { fete.innerHTML = ''; }, 2700);
  }

  // ───────── Événements ─────────

  /** Un seul écouteur de clics pour tous les boutons (délégation via data-action). */
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-action]');
    if (!b) return;
    const a = b.dataset.action;
    if (a === 'grimper') lancerVoie(b.dataset.zone);
    else if (a === 'mur') ecranMur();
    else if (a === 'profils') ecranProfils();
    else if (a === 'choisir') { etat.actif = b.dataset.id; sauver(); ecranMur(); }
    else if (a === 'choix') repondre(Number(b.dataset.k), false);
    else if (a === 'indice') montrerIndice();
    else if (a === 'suivante') priseSuivante();
    else if (a === 'son') { etat.son = !etat.son; sauver(); rendreBandeau(); }
  });

  /** Gestion des formulaires : création de profil, saisie de réponse, code papier. */
  document.addEventListener('submit', (ev) => {
    const f = ev.target.closest('[data-form]');
    if (!f) return;
    ev.preventDefault();
    if (f.dataset.form === 'profil') {
      const v = document.getElementById('pseudo').value.trim();
      if (!v) { document.getElementById('msg-profil').textContent = 'Écris un prénom ou un pseudo.'; return; }
      creerProfil(v);
      ecranMur();
    } else if (f.dataset.form === 'saisie') {
      const v = document.getElementById('rep').value;
      if (!v.trim()) { document.getElementById('err').textContent = 'Écris une réponse (ou tente ta chance !).'; return; }
      repondre(v, false);
    } else if (f.dataset.form === 'code') {
      validerCodePapier(document.getElementById('code').value);
    }
  });

  /** Efface le message d'erreur dès que l'élève retape sa réponse. */
  document.addEventListener('input', (ev) => {
    if (ev.target.id === 'rep') document.getElementById('err').textContent = '';
  });

  /** Raccourcis clavier en QCM : touches 1 à 4 (ou A à D). */
  document.addEventListener('keydown', (ev) => {
    if (!voie || voie.repondu || !voie.ordre || ev.target.tagName === 'INPUT') return;
    const n = '1234'.indexOf(ev.key) >= 0 ? '1234'.indexOf(ev.key) : 'abcd'.indexOf(ev.key.toLowerCase());
    if (n >= 0 && n < voie.ordre.length) repondre(voie.ordre[n], false);
  });

  // Démarrage : directement sur le mur si un grimpeur est déjà connu sur cet appareil.
  if (profilActif()) ecranMur(); else ecranProfils();
})();
