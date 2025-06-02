import api from './api';
// import publicApi from './publicApi';

interface LoginResponse {
    access: string;
    refresh: string;
}

interface LoginData {
    username: string;
    password: string;
}

interface UserInfo {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
}

interface UserDetails {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: number;
}

export const login = async (data: LoginData): Promise<string> => {
    try {
        console.log('tentative de connexion', data);
        const response = await api.post<LoginResponse>('/token/', data);
        console.log('réponse de la connexion', response.data);
        const token = response.data.access;
        localStorage.setItem('token', token);

        localStorage.setItem('refresh_token', response.data.refresh);
        return token;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token)  return false;

    return !isTokenExpired(token);
}; 

export const decodeToken = (token: string): UserInfo | null => {
    try {
        // Diviser le token en 3 parties (header.payload.signature)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload) as UserInfo;
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
    }
};

// Vérifier si le token est expiré
export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

// Récupérer les informations de l'utilisateur connecté
export const getCurrentUser = (): UserInfo | null => {
    const token = getToken();
    if (!token) return null;
    
    if (isTokenExpired(token)) {
        logout(); // Déconnecter automatiquement si le token est expiré
        return null;
    }
    
    return decodeToken(token);
};

// Récupérer une information spécifique de l'utilisateur
export const getCurrentUserId = (): number | null => {
    const user = getCurrentUser();
    return user?.user_id || null;
};

export const getUserDetails = async (): Promise<UserDetails | null> => {
    try {
        const userId = getCurrentUserId();
        console.log('user id', userId);
        if (!userId) {
            console.log('Pas d\'ID utilisateur trouvé');
            return null;
        }

        console.log('Tentative de récupération des détails utilisateur...');
        const response = await api.get<UserDetails>(`/user-connect/${userId}/`);
        console.log('Réponse des détails utilisateur:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
        return null;
    }
};

// Fonctions utilitaires pour accéder aux informations de l'utilisateur
export const getCurrentUserDetails = async (): Promise<{
    user : UserDetails | null;
}> => {
    const userDetails = await getUserDetails();
    return { user: userDetails };
};
