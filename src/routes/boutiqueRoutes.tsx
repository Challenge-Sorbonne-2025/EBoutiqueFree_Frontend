import BoutiqueList from '../components/Boutiques/BoutiqueList';
import BoutiqueForm from '../components/Boutiques/BoutiqueForm';

const boutiqueRoutes = [
  {
    path: '/boutiques',
    element: <BoutiqueList />
  },
  {
    path: '/boutiques/nouveau', // ✅ version française
    element: <BoutiqueForm />
  },
  {
    path: '/boutiques/modifier/:id',
    element: <BoutiqueForm />
  }
];

export default boutiqueRoutes;
