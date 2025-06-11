import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import '../dist/css/adminlte.css'
import "admin-lte/dist/css/adminlte.css";
//import "admin-lte/dist/js/adminlte.js";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
