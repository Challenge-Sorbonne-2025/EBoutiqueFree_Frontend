import axios from 'axios';
import { PUBLIC_API_CONFIG } from '../config/api';

// Création d'une instance axios pour les requêtes publiques
const publicApi = axios.create(PUBLIC_API_CONFIG);

export default publicApi; 