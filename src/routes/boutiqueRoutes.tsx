// src/routes/boutiqueRoutes.tsx

import BoutiquesList from '../components/Boutiques/BoutiqueList';
import BoutiqueForm from '../components/Boutiques/BoutiqueForm';

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
  }
];

export default boutiqueRoutes;
