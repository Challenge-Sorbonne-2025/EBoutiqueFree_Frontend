import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import ProductList from './components/Produits/ProductList';
import Login from './components/Accueils/Login';
import StoreFinder from './components/Accueils/StoreFinder';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#cd1517', // Rouge Free
    },
    secondary: {
      main: '#000000',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<StoreFinder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
