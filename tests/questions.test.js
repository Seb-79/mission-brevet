// Contrôle d'intégrité de la banque de questions : chaque question doit être jouable
// et corrigeable (bonne réponse présente, solution expliquée, zone connue).
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../js/logic.js');
const { QUESTIONS, ZONES, CODES_PAPIER } = require('../js/questions.js');

const idsZones = ZONES.map((z) => z.id);

test('les 5 secteurs existent', () => {
  assert.deepEqual(idsZones, ['echauffement', 'falaise', 'francais', 'histoire', 'sciences']);
});

test('identifiants uniques', () => {
  const ids = QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('chaque question a une zone connue, un énoncé, un indice et une solution', () => {
  for (const q of QUESTIONS) {
    assert.ok(idsZones.includes(q.zone), q.id + ' zone');
    assert.ok(q.enonce && q.enonce.length > 5, q.id + ' énoncé');
    assert.ok(q.indice && q.indice.length > 5, q.id + ' indice');
    assert.ok(q.solution && q.solution.length > 5, q.id + ' solution');
  }
});

test('QCM : au moins 3 choix distincts et la bonne réponse est jugée correcte', () => {
  for (const q of QUESTIONS.filter((x) => x.type === 'qcm')) {
    assert.ok(q.choix.length >= 3, q.id + ' choix');
    assert.equal(new Set(q.choix).size, q.choix.length, q.id + ' doublon');
    assert.equal(L.verifierReponse(q, q.reponse), true, q.id);
    const mauvais = q.reponse === 0 ? 1 : 0;
    assert.equal(L.verifierReponse(q, mauvais), false, q.id + ' mauvais choix');
  }
});

test('saisies : chaque réponse attendue est acceptée telle quelle', () => {
  for (const q of QUESTIONS.filter((x) => x.type === 'saisie')) {
    assert.ok(Array.isArray(q.reponse) && q.reponse.length > 0, q.id);
    for (const r of q.reponse) assert.equal(L.verifierReponse(q, r), true, q.id + ' ' + r);
  }
});

test('assez de questions par secteur pour varier les voies', () => {
  for (const id of idsZones) {
    const n = QUESTIONS.filter((q) => q.zone === id).length;
    assert.ok(n >= 20, id + ' n’a que ' + n + ' questions');
  }
});

test('sciences : les 3 matières sont couvertes (au moins 8 chacune)', () => {
  for (const m of ['Physique-chimie', 'SVT', 'Technologie']) {
    const n = QUESTIONS.filter((q) => q.zone === 'sciences' && q.theme === m).length;
    assert.ok(n >= 8, m + ' : ' + n);
  }
});

test('codes papier : 4 paliers, bonus croissants, aucun code en clair', () => {
  assert.equal(CODES_PAPIER.length, 4);
  const bonus = CODES_PAPIER.map((c) => c.bonus);
  assert.deepEqual([...bonus].sort((a, b) => a - b), bonus);
  for (const c of CODES_PAPIER) assert.ok(!('code' in c));
});

test('codes papier : les codes imprimés dans le corrigé sont reconnus', () => {
  for (const code of ['PRISE-24', 'DEGAINE-58', 'RELAIS-93', 'SOMMET-46']) {
    assert.equal(L.validerCode(code, CODES_PAPIER, []).ok, true, code);
  }
  assert.equal(L.validerCode('SOMMET-47', CODES_PAPIER, []).ok, false);
});
