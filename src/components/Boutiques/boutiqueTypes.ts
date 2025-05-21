// boutiqueTypes.ts
export interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
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
  responsable?: User | null;
  gestionnaires?: User[];
}

// Pour les formulaires
export interface BoutiqueFormData {
  nom_boutique: string;
  adresse: string;
  ville: string;
  code_postal: string;
  departement?: string;
  longitude?: string; // string pour le champ input
  latitude?: string;
  num_telephone?: string;
  email?: string;
  responsable?: User | null;
  gestionnaires?: User[];
}

export interface BoutiquesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Boutique[];
}
