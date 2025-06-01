import BoutiqueList from '../components/Boutiques/BoutiqueList';
import BoutiqueForm from '../components/Boutiques/BoutiqueForm';
import RechercheBoutique from '../components/userInterface/RechercheBoutique';

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
  },
  {
    path: '/boutiques/recherche',
    element: <RechercheBoutique />,
  }
];

export default boutiqueRoutes;
