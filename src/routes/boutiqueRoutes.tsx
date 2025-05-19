import BoutiqueList from '../components/Boutiques/BoutiqueList';
import BoutiqueForm from '../components/Boutiques/BoutiqueForm';

const boutiqueRoutes = [
  {
    path: '/boutiques',
    element: <BoutiqueList />
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
