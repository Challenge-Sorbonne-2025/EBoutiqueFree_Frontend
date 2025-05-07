import Header_accueil from '../Headers/Header_accueil';
import { Link } from 'react-router-dom';
import '../../assets/styles/StoreFinder.css';

export default function StoreFinder() {
    return (
        <div className="store-finder">
            <Header_accueil />
            <main className="store-finder-main">
                <div className="store-finder-container">
                    <h1>Trouver votre mobile en boutique</h1>
                    <p>Vérifier mon modèle de téléphone si s'est disponible</p>

                    <div className="search-form">
                        <div className="search-fields">
                            <div className="field">
                                <Link to="/boutiques" className="search-input">
                                    Trouver la boutique la plus proche
                                </Link>
                            </div>
                            <div className="field">
                                <Link to="/modeles" className="search-input">
                                    Selectionner votre modèle de smartphones
                                </Link>
                            </div>
                        </div>
                    </div>

                    <section className="store-banner">
                        <div className="store-image-container">
                            <img 
                                src="/src/assets/images/boutique_paris_republique.jpg" 
                                alt="Notre boutique"
                                className="store-banner-image"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/1200x400?text=Notre+Boutique';
                                }}
                            />
                        </div>
                       
                    </section>

                    <section className="smartphones-section">
                        <h2>Nos smartphones</h2>
                        <div className="smartphones-grid">
                            <div className="smartphone-card">
                                <div className="image-container">
                                    <img 
                                        src="/src/assets/images/SamsungGalaxyF62.jpg" 
                                        alt="Samsung Galaxy S25 Ultra"
                                        className="smartphone-image"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/300x400?text=Galaxy+S25+Ultra';
                                        }}
                                    />
                                </div>
                                <h3>Samsung Galaxy S25 Ultra</h3>
                                <div className="voir-produit">
                                     <a href="/smartphones/id">Voir le produit</a>
                                </div>
                            </div>
                            <div className="smartphone-card">
                                <div className="image-container">
                                    <img 
                                        src="/src/assets/images/iphone.jpg" 
                                        alt="iPhone 15 Pro"
                                        className="smartphone-image"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/300x400?text=iPhone+15+Pro';
                                        }}
                                    />
                                </div>
                                <h3>Apple iPhone 15 Pro</h3>
                                <div className="voir-produit">
                                     <a href="/smartphones/id">Voir le produit</a>
                                </div>
                            </div>
                            <div className="smartphone-card">
                                <div className="image-container">
                                    <img 
                                        src="/src/assets/images/poco.jpg" 
                                        alt="Poco M2 Pro"
                                        className="smartphone-image"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/300x400?text=Poco+M2+Pro';
                                        }}
                                    />
                                </div>
                                <h3>Poco M2 Pro</h3>
                                <div className="voir-produit">
                                     <a href="/smartphones/id">Voir le produit</a>
                                </div>
                            </div>
                        </div>
                        <div className="voir-plus">
                            <a href="/smartphones">Voir plus</a>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
} 