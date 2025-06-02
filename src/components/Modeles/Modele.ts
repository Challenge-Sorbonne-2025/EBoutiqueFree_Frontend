import type { Marque } from "../Marques/Marque";

export interface Modele {
    modele_id: number;
    modele: string;
    marque: Marque;
}

export interface ModeleResponse {
    modele_id: number;
    modele: string;
    marque: Marque;
}

export interface ModeleCreate {
    nom_modele: string;
    marque: number;
}

