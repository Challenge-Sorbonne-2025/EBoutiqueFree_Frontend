import UserAdministrationPage from '../components/Dashbords/UserAdministrationPage';
import GestionUtilisateur from '../components/Dashbords/GestionUtilisateur';
const UserRoutes = [
    {
        path: '/users',
        element: <UserAdministrationPage />
    },
    {
        path: '/gestion-utilisateurs',
        element: <GestionUtilisateur onUserAdded={() => {}} />
    }
]


export default UserRoutes;