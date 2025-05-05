# EBoutiqueFree Frontend

Application frontend React pour le projet EBoutiqueFree, une boutique en ligne développée avec React, Material-UI et TypeScript.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)

## Installation

1. Clonez le dépôt :
```bash
git clone git@github.com:Challenge-Sorbonne-2025/EBoutiqueFree_Frontend.git
cd EBoutiqueFree_Frontend
```

2. Installez les dépendances :
```bash
npm install
```

## Démarrage de l'application

Pour lancer l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse : [http://localhost:5173](http://localhost:5173)

## Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Crée une version de production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

## Structure du projet

```
src/
  ├── components/     # Composants React
  ├── services/      # Services (API, authentification)
  ├── config/        # Configuration
  └── assets/        # Ressources statiques
```

## Configuration de l'API

L'application est configurée pour communiquer avec notre backend Django sur `http://localhost:8000/api`. 

## Dépendances principales

- React 18.2.0
- Material-UI 5.15.6
- React Router 6.21.3
- Axios 1.6.7
- TypeScript 5.3.3
- Vite 5.0.12

## Contribution

1. Créez une nouvelle branche pour vos modifications
2. Committez vos changements
3. Poussez vers la branche
4. Créez une Pull Request

## Résolution des problèmes courants

### Erreur CORS
Si vous rencontrez des erreurs CORS, assurez-vous que votre backend Django est configuré pour accepter les requêtes de `http://localhost:5173`.

### Erreurs de TypeScript
En cas d'erreurs TypeScript, essayez :
```bash
npm install
npm run build
```

### Problèmes de dépendances
Si vous rencontrez des problèmes avec les dépendances :
```bash
rm -rf node_modules package-lock.json
npm install
```

## Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement dans le groupe

## PS: 
Il ne faut pas faire des push directement sur la branche `main`; j'ai créer une branche dev a partir de la branch `main`.
- chacun doit creer sa propre branch nommé a partir de la branch `dev` comme parexemple `dev-aby`
- Noté aussi qu'il faut d'abord mergé sa branche perso (`dev-aby`) avec la branche `dev`, une fois nos modification terminées. Cela va permettre d'éviter au mieux les problémes de conflit.
- Avant de saugarder publier vos modifications; il faut toujours faire un contrôle sur e depôt distant avec :
```bash 
git status uno
```
afin de verifier s'il y'a de nouveau modification.

## Licence

[MIT Licence]
