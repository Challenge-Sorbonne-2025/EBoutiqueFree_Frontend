export interface BoutiqueResponse {
    boutique_id: number;
    nom_boutique: string;
    adresse: string;
    ville: string;
    code_postal: string;
    departement: string;
    latitude: number;
    longitude: number;
    numero_telephone: string;
    email: string;
    responsable: ResponsableOUGestionnaireBoutique;
    gestionnaire: ResponsableOUGestionnaireBoutique[];
}

export interface ResponsableOUGestionnaireBoutique {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface BoutiqueCreate {
    nom_boutique: string;
    adresse: string;
    ville: string;
    code_postal: string;
    departement: string;
    latitude: number;
    longitude: number;
    numero_telephone: string;
    email: string;
    responsable: number | null;
    gestionnaires: number[];
}

 export interface Boutique {
    lat: string;
    lon: string;
    boutique: string;
    ville: string;
    adresse: string;
    produit: string;
    marque: string;
    modele: string;
    prix: number;
    quantite: number;
  }