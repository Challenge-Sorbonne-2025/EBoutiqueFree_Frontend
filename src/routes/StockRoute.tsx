
import StocksForm from "../components/Stocks/StocksForm";


const stockRoutes = [
    {
        path: '/boutiques/:boutiqueId/produits/addStock',
        element: <StocksForm/>
    }

];
export default stockRoutes;