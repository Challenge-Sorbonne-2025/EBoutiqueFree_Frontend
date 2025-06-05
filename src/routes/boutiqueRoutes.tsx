// src/routes/boutiqueRoutes.tsx

import BoutiquesList from '../components/Boutiques/BoutiqueList';
import BoutiqueForm from '../components/Boutiques/BoutiqueForm';
import BoutiquesMapProximite from '../components/Boutiques/BoutiqueMapProximite';

const boutiqueRoutes = [
  {
    path: '/boutiques',
    element: <BoutiquesList />
  },
  {
    path: '/boutiques/new',
    element: <BoutiqueForm />
  },
  {
    path: '/boutiques/edit/:id',
    element: <BoutiqueForm />
  }, 

  {
    path  : '/boutiques/map',
    element: <BoutiquesMapProximite />
  }
];

export default boutiqueRoutes;
