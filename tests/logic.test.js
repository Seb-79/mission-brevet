// Tests de la logique pure du jeu (cotations, points, série, codes, réponses).
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../js/logic.js');

test('cotationPour : 0 m donne 4a', () => {
  assert.equal(L.cotationPour(0).nom, '4a');
});

test('cotationPour : juste au seuil passe à la cotation suivante', () => {
  assert.equal(L.cotationPour(49).nom, '4a');
  assert.equal(L.cotationPour(50).nom, '4b');
});

test('cotationPour : au-delà du dernier seuil reste 8a', () => {
  assert.equal(L.cotationPour(999999).nom, '8a');
});

test('progressionCotation : 0 au seuil, 1 au seuil suivant, 1 au sommet', () => {
  assert.equal(L.progressionCotation(50), 0);
  assert.equal(L.progressionCotation(75), 0.5);
  assert.equal(L.progressionCotation(999999), 1);
});

test('metresGagnes : bonne réponse de base = 10 m', () => {
  assert.equal(L.metresGagnes({ correct: true, combo: 0, zone: 'francais', indice: false }), 10);
});

test('metresGagnes : maths compte double', () => {
  assert.equal(L.metresGagnes({ correct: true, combo: 0, zone: 'echauffement', indice: false }), 20);
  assert.equal(L.metresGagnes({ correct: true, combo: 0, zone: 'falaise', indice: false }), 20);
});

test('metresGagnes : combo x2 à partir de 3 bonnes, x3 à partir de 6', () => {
  assert.equal(L.metresGagnes({ correct: true, combo: 2, zone: 'francais', indice: false }), 10);
  assert.equal(L.metresGagnes({ correct: true, combo: 3, zone: 'francais', indice: false }), 20);
  assert.equal(L.metresGagnes({ correct: true, combo: 6, zone: 'francais', indice: false }), 30);
});

test('metresGagnes : un indice divise le gain par deux', () => {
  assert.equal(L.metresGagnes({ correct: true, combo: 0, zone: 'falaise', indice: true }), 10);
});

test('metresGagnes : une chute ne fait rien perdre', () => {
  assert.equal(L.metresGagnes({ correct: false, combo: 5, zone: 'falaise', indice: false }), 0);
});

test('majSerie : premier jour de grimpe', () => {
  assert.deepEqual(L.majSerie({ jours: 0, dernier: null }, '2026-11-22'), { jours: 1, dernier: '2026-11-22' });
});

test('majSerie : même jour, rien ne change', () => {
  assert.deepEqual(L.majSerie({ jours: 3, dernier: '2026-11-22' }, '2026-11-22'), { jours: 3, dernier: '2026-11-22' });
});

test('majSerie : jour suivant, la série augmente (y compris changement de mois)', () => {
  assert.deepEqual(L.majSerie({ jours: 3, dernier: '2026-11-30' }, '2026-12-01'), { jours: 4, dernier: '2026-12-01' });
});

test('majSerie : un jour sauté, la série repart à 1', () => {
  assert.deepEqual(L.majSerie({ jours: 5, dernier: '2026-11-20' }, '2026-11-22'), { jours: 1, dernier: '2026-11-22' });
});

test('verifierReponse : QCM par index', () => {
  const q = { type: 'qcm', choix: ['a', 'b'], reponse: 1 };
  assert.equal(L.verifierReponse(q, 1), true);
  assert.equal(L.verifierReponse(q, 0), false);
});

test('verifierReponse : saisie numérique accepte virgule, point et espaces', () => {
  const q = { type: 'saisie', zone: 'echauffement', reponse: ['2.5'] };
  assert.equal(L.verifierReponse(q, ' 2,5 '), true);
  assert.equal(L.verifierReponse(q, '2.5'), true);
  assert.equal(L.verifierReponse(q, '25'), false);
});

test('verifierReponse : saisie texte insensible à la casse mais pas aux accents', () => {
  const q = { type: 'saisie', zone: 'francais', reponse: ['à'] };
  assert.equal(L.verifierReponse(q, ' À '), true);
  assert.equal(L.verifierReponse(q, 'a'), false);
});

test('verifierReponse : saisie vide = faux', () => {
  const q = { type: 'saisie', zone: 'echauffement', reponse: ['0'] };
  assert.equal(L.verifierReponse(q, '   '), false);
});

test('empreinte : stable et différente selon le texte', () => {
  assert.equal(L.empreinte('ABC'), L.empreinte('ABC'));
  assert.notEqual(L.empreinte('ABC'), L.empreinte('ABD'));
});

test('validerCode : code connu non utilisé donne son bonus, insensible à la casse/espaces', () => {
  const codes = [{ empreinte: L.empreinte('CORDE-71'), bonus: 200, nom: 'Sujet 1' }];
  const r = L.validerCode(' corde-71 ', codes, []);
  assert.equal(r.ok, true);
  assert.equal(r.bonus, 200);
});

test('validerCode : code inconnu ou déjà utilisé refusé', () => {
  const codes = [{ empreinte: L.empreinte('CORDE-71'), bonus: 200, nom: 'Sujet 1' }];
  assert.equal(L.validerCode('FAUX', codes, []).ok, false);
  const r = L.validerCode('CORDE-71', codes, [L.empreinte('CORDE-71')]);
  assert.equal(r.ok, false);
  assert.equal(r.raison, 'deja');
});

test('tirerVoie : n questions distinctes de la zone, déterministe avec un aléa fourni', () => {
  const banque = Array.from({ length: 20 }, (_, i) => ({ id: 'q' + i, zone: i < 15 ? 'a' : 'b' }));
  let s = 1;
  const alea = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const voie = L.tirerVoie(banque, 'a', 10, alea);
  assert.equal(voie.length, 10);
  assert.equal(new Set(voie.map((q) => q.id)).size, 10);
  assert.ok(voie.every((q) => q.zone === 'a'));
});

test('tirerVoie : si la zone a moins de questions que demandé, renvoie tout', () => {
  const banque = [{ id: 'x', zone: 'a' }, { id: 'y', zone: 'a' }];
  assert.equal(L.tirerVoie(banque, 'a', 10, Math.random).length, 2);
});

test('tirerVoie : jusqu’à 3 questions ratées sont reprises en priorité', () => {
  const banque = Array.from({ length: 100 }, (_, i) => ({ id: 'q' + i, zone: 'a' }));
  let s = 7;
  const alea = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const ratees = ['q90', 'q91', 'q92', 'q93', 'q94'];
  const voie = L.tirerVoie(banque, 'a', 10, alea, ratees);
  assert.equal(voie.length, 10);
  assert.equal(new Set(voie.map((q) => q.id)).size, 10);
  assert.equal(voie.filter((q) => ratees.includes(q.id)).length, 3);
});

test('tirerVoie : une question ratée d’une autre zone est ignorée', () => {
  const banque = [{ id: 'x', zone: 'a' }, { id: 'y', zone: 'b' }];
  const voie = L.tirerVoie(banque, 'a', 10, Math.random, ['y']);
  assert.deepEqual(voie.map((q) => q.id), ['x']);
});
