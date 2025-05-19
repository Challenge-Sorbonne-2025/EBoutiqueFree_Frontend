import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
// import { checkUserBoutique } from '../../services/boutiques/boutiqueService';
import Header from '../Headers/Header';
import '../../assets/styles/Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        try {
            await login({ username, password });
             navigate('/boutiques'); 

            // Vérifie si l'utilisateur a une boutique
            // const result = await checkUserBoutique();

            // if (result.hasBoutique) {
            //     navigate('/boutiques');       // Il a une boutique -> liste
            // } else {
            //     navigate('/boutiques/new');   // Pas de boutique -> création
            // }
        } catch (err) {
            setError('Erreur de connexion. Vérifiez vos identifiants.');
        }
    };

    return (
        <div className="login">
            <Header />
            <main id="main">
                <div className="login_container" role="main">
                    <div className="login_left">
                        <h1>Bienvenue chez Votre Boutique</h1>
                        <p>Avec votre Espace employee Free, gérez votre compte, consultez 
                            le stock des produits, veillez à la bonne gestion des produits 
                            et bien plus encore !</p>

                        <div className="login_form">
                            {error && (
                                <div className="error-message" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} id="log_form" spellCheck="false">
                                <div className="field">
                                    <input
                                        type="text"
                                        id="login_b"
                                        className="inputfield"
                                        placeholder="Identifiant"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        aria-label="Identifiant"
                                    />
                                </div>
                                <div className="field">
                                    <input
                                        type="password"
                                        id="pass_b"
                                        className="inputfield"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        aria-label="Mot de passe"
                                    />
                                </div>
                                <div className="field">
                                    <button type="submit" className="login_button">
                                        Se connecter
                                    </button>
                                </div>
                            </form>

                            <hr />

                            <div className="links">
                                <a href="/password-recovery" title="Mot de passe oublié">
                                    <img src="/images/question.svg" alt="" />
                                    Vous avez oublié votre mot de passe ?
                                </a>
                                <a href="/mobile" title="Espace Abonné Free Mobile">
                                    <img src="/images/smartphone.svg" alt="" />
                                    Trouver votre Telephone dans la boutique Free la plus proche.
                                </a>
                                <a href="/offers" title="Découvrir nos offres">
                                    <img src="/images/freebox.svg" alt="" />
                                    Découvrir nos Telephones disponibles
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="login_right">
                        <img 
                            src="/images/login.webp" 
                            alt="Illustration Freebox"
                            className="login_background_image"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
