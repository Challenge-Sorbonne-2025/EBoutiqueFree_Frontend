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
}

 export interface Boutique {
  boutique_id: number;
  nom_boutique: string;
  adresse: string;
  ville: string;
  code_postal: string;
  departement?: string;
  longitude?: number | null;
  latitude?: number | null;
  num_telephone?: string | null;
  email?: string | null;
  date_creation?: string;
  date_maj?: string;
  responsable?: ResponsableOUGestionnaireBoutique | null;
}

  export interface BoutiquesResponsePage {
  count: number;
  next: string | null;
  previous: string | null;
  results: Boutique[];
}