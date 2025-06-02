// src/App.tsx

import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import produitRoutes from './routes/produitRoutes';
import boutiqueRoutes from './routes/boutiqueRoutes'; 
import userRoutes from './routes/UserRoutes';
import Login from './components/Accueils/Login';
import StoreFinder from './components/Accueils/StoreFinder';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#cd1517',
    },
    secondary: {
      main: '#000000',
    },
  },
});

const generalRoutes = [
  {
    path: '/',
    element: <StoreFinder />
  },
  {
    path: '/login',
    element: <Login />
  }
];

function AppRoutes() {
  // Fusion des routes générales, produits et boutiques
  const routes = useRoutes([
    ...generalRoutes,
    ...produitRoutes,
    ...boutiqueRoutes,
    ...userRoutes,
  ]);
  return routes;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* add future={{ ... }} pour masquer les warnings dans la console */}
      <Router 
      future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true}} >
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
