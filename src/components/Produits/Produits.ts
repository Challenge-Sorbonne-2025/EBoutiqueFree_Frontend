import type { Modele } from "../Modeles/Modele";


export interface ProduitResponse {
    produit_id: number;
    boutiques: BoutiqueResponseProduit[];
    nom_produit: string;
    prix: number;
    couleur: string;
    capacite: number;
    ram: number;  
    image: string;
    modele: Modele;
    user: ResponseUserProduit;  

}
export interface BoutiqueResponseProduit {
    boutique_id: number;
    nom_boutique: string;
    quantite: number;
}

export interface ProduitCreate {
    boutique_id: number;
    quantite_initiale: number;
    nom_produit: string;
    prix: number;
    couleur: string;
    capacite: number;
    ram: number;
    modele: number;   
}

export interface ResponseUserProduit {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}