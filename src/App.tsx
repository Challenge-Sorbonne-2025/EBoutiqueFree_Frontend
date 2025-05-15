// src/App.tsx

import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import produitRoutes from './routes/produitRoutes';
import boutiqueRoutes from './routes/boutiqueRoutes'; // ✅ nouveau
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
    ...boutiqueRoutes // ✅ ajouté ici
  ]);
  return routes;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
