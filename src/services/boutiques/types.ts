export interface UserOption {
  id: number;
  username: string;
  email: string;
  hasBoutique: boolean;
}

export interface BoutiqueFormData {
  boutique_id?: number;
  nom_boutique: string;
  adresse: string;
  ville: string;
  code_postal: string;
  departement?: string;
  longitude?: number | null;
  latitude?: number | null;
  num_telephone?: string;
  email?: string;
  responsable?: number | null;
  gestionnaires: number[];
}

export interface Boutique extends BoutiqueFormData {
  date_creation?: string;
  date_maj?: string;
}