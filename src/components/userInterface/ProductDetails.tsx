
import React from 'react';

interface Props {
  produit: any;
  boutiques: any[];
}

const ProductDetails: React.FC<Props> = ({ produit, boutiques }) => {
  return (
    <div className="infos-container">
      <h3>{produit.nom_produit}</h3>
      <p>💶 {produit.prix} €</p>

      <h4>🛍️ Boutiques avec stock :</h4>
      <ul>
        {boutiques.map((b, i) => (
          <li key={i}>
            {b.nom} – {b.quantite} en stock
            {b.distance && <> ({b.distance.toFixed(2)} km)</>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetails;
