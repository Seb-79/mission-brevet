# Mission Brevet

Jeu de révision du brevet des collèges 2027, dans l'univers de l'escalade. Chaque bonne réponse fait grimper les cotations, de 4a à 8a.

- **Secteurs** : maths (automatismes chronométrés, puis problèmes, en mètres x2), français, histoire-géo-EMC, sciences (physique-chimie, SVT, technologie).
- **Règles** : 10 prises par voie. Une chute ne fait rien perdre et affiche la méthode. Les questions ratées reviennent en priorité.
- **Codes papier** : un code imprimé dans le corrigé d'un sujet papier rapporte des mètres bonus.
- **Données** : le profil et les scores restent dans le navigateur (localStorage). Rien n'est envoyé.

## Lancer en local

```bash
python3 -m http.server 5180
```

Puis ouvrir http://localhost:5180.

## Vérifier (syntaxe et tests)

```bash
npm run verify
```

## Structure

- `index.html` : la page.
- `css/style.css` : le design.
- `js/logic.js` : la logique pure (cotations, points, série, codes), testée.
- `js/questions.js` : la banque de questions et les empreintes des codes.
- `js/app.js` : l'interface.
- `tests/` : les tests Node (`node --test`).
