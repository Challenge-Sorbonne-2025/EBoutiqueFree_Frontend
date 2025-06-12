import React, { useEffect, useState } from 'react';
import { initializeCharts, initializeSortable } from './dashboardScripts';
import { logout, getCurrentUserDetails } from '../../services/auth';
import { getUserById } from '../../services/users/UserService';
import { getAllProduits } from '../../services/produits/produitService';
import { getAllGestionnaires } from '../../services/users/UserService';
import { getAllBoutiques } from '../../services/boutiques/boutiqueService';


const UserAdministrationPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<{
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    username: string | null;
    profile: number | null;
  } | null>(null);
  const [profile, setProfile] = useState<string | null>(null);
  const [nbProduits, setNbProduits] = useState<number | null>(null);
  const [nbGestionnaires, setNbGestionnaires] = useState<number | null>(null);
  const [nbBoutiques, setNbBoutiques] = useState<number | null>(null);
  // const [nbStocks, setNbStocks] = useState<number | null>(null);


  useEffect(() => {
    // Initialize charts and sortable when component mounts
    initializeCharts();
    initializeSortable();
    
    // Récupérer les détails de l'utilisateur
    const fetchUserDetails = async () => {
      try {
        const details = await getCurrentUserDetails();
        setUserDetails({
          firstName: details.user?.first_name || null,
          lastName: details.user?.last_name || null,
          email: details.user?.email || null,
          username: details.user?.username || null,
          profile: details.user?.profile || null
        });
        const data = await getUserById(details.user?.profile || 0);
        console.log('Détails de userProfile:', data);
        setProfile(data.role);
        const data_products = await getAllProduits();
        console.log('Détails de products:', data_products);
        setNbProduits(data_products.count);
        
        const data_gestionnaires = await getAllGestionnaires();
        console.log('Détails de gestionnaires:', data_gestionnaires);
        setNbGestionnaires(data_gestionnaires.length);

        const data_boutiques = await getAllBoutiques();
        console.log('Détails de boutiques:', data_boutiques);
        setNbBoutiques(data_boutiques.count);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
      }
    };

    fetchUserDetails();
  }, []);

  function handleLogout(_event: React.MouseEvent<HTMLAnchorElement>): void {
    logout();
    window.location.href = '/';
  }

  return (
    <div className="layout-fixed sidebar-expand-lg bg-body-tertiary">
      <div className="app-wrapper">
        {/* Header */}
        <nav className="app-header navbar navbar-expand bg-body">
          <div className="container-fluid">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                  <i className="bi bi-list"></i>
                </a>
              </li>
              <li className="nav-item d-none d-md-block">
                <a href="/users/" className="nav-link">Home</a>
              </li>
              <li className="nav-item d-none d-md-block">
                <a href="/users/contact" className="nav-link">Contact</a>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
            {/* <!--begin::Navbar Search--> */}
            <li className="nav-item">
              <a className="nav-link" data-widget="navbar-search" href="#" role="button">
                <i className="bi bi-search"></i>
              </a>
            </li>
            {/* <!--end::Navbar Search--> */}
            {/* <!--begin::Messages Dropdown Menu--> */}
              <li className="nav-item dropdown">
                <a className="nav-link" data-bs-toggle="dropdown" href="#">
                  <i className="bi bi-chat-text"></i>
                  <span className="navbar-badge badge text-bg-danger">3</span>
                </a>
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                  {/* Messages dropdown content */}
                  <a href="#" className="dropdown-item">
                  {/* <!--begin::Message--> */}
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <img
                        src="/images/user1-128x128.jpg"
                        alt="User Avatar"
                        className="img-size-50 rounded-circle me-3"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="dropdown-item-title">
                         Sow Malick
                          <span className="float-end fs-7 text-danger">
                          <i className="bi bi-star-fill"></i>
                          </span>
                      </h3>
                      <p className="fs-7">Hello, demande de réapprovisionnement ...</p>
                      <p className="fs-7 text-secondary">
                        <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                  {/* <!--end::Message--> */}
                  </a> 
                  <div className="dropdown-divider"></div>
                  <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
                </div> 
              </li>
              {/* <!--end::Messages Dropdown Menu--> */}
              {/* <!--begin::Notifications Dropdown Menu--> */}
              <li className="nav-item dropdown">
                <a className="nav-link" data-bs-toggle="dropdown" href="#">
                  <i className="bi bi-bell-fill"></i>
                  <span className="navbar-badge badge text-bg-warning">15</span>
                </a>
                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                  {/* Notifications dr  opdown content */}
                  <span className="dropdown-item dropdown-header">15 Notifications</span>
                  <div className="dropdown-divider"></div>
                  <a href="#" className="dropdown-item">
                    <i className="bi bi-envelope me-2"></i> 4 new messages
                    <span className="float-end text-secondary fs-7">3 mins</span>
                  </a>
                  <div className  ="dropdown-divider"></div>
                  <a href="#" className="dropdown-item">
                    <i className="bi bi-people-fill me-2"></i> 8 friend requests
                    <span className="float-end text-secondary fs-7">12 hours</span>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="#" className="dropdown-item">
                    <i className="bi bi-file-earmark-fill me-2"></i> 3 new reports
                    <span className="float-end text-secondary fs-7">2 days</span>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="#" className="dropdown-item dropdown-footer"> See All Notifications </a>
                </div>
              </li>
              {/* <!--end::Notifications Dropdown Menu--> */}

              {/* <!--begin::Fullscreen Toggle--> */}
              <li className="nav-item">
                <a className="nav-link" href="#" data-lte-toggle="fullscreen">
                  <i data-lte-icon="maximize" className="bi bi-arrows-fullscreen"></i>
                  <i data-lte-icon="minimize" className="bi bi-fullscreen-exit" style={{ display: 'none' }}></i>
                </a>
              </li>
              {/* <!--end::Fullscreen Toggle--> */}
              {/* <!--begin::User Menu Dropdown--> */}
              <li className="nav-item dropdown user-menu">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <img
                    src="/images/avatar.png"
                    className="user-image rounded-circle shadow"
                    alt="User Image"
                  />
                  <span className="d-none d-md-inline">{userDetails?.firstName || 'Utilisateur'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                  <li className="user-header text-bg-primary">
                    <img
                      src="/images/user3-128x128.jpg"
                      className="rounded-circle shadow"
                      alt="User Image"
                    />
                    <p>
                      {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Chargement...'}
                      <small>{profile || 'Rôle non défini'}</small>
                    </p>
                  </li>
                 
                  <li className="user-footer">
                    <a href="#" className="btn btn-default btn-flat">Profile</a>
                    <a href="#" className="btn btn-default btn-flat float-end" onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </li>
              {/* <!--end::User Menu Dropdown--> */}
            </ul>
          </div>
        </nav>

        {/* Sidebar */}
        <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
          <div className="sidebar-brand">
            <a href="/users/" className="brand-link">
              <img
                src="/images/free.svg"
                alt="Free Logo"
                className="brand-image opacity-75 shadow"
              />
              <span className="brand-text fw-light">Boutique</span>
            </a>
          </div>
          <div className="sidebar-wrapper">
            <nav className="mt-2">
              <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu" data-accordion="false">
                <li className="nav-item menu-open">
                  <a href="#" className="nav-link active">
                    <i className="nav-icon bi bi-speedometer"></i>
                    <p>
                      Dashboard
                      <i className="nav-arrow bi bi-chevron-right"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                  <br/>
                    <li className="nav-item">
                      <a href="/users/" className="nav-link active">
                        <i className="nav-icon bi bi-tools"></i>
                        <p>Administration</p>
                      </a>
                    </li>
                    <br/><br/>
                    <li className="nav-item">
                      <a href="/boutiques/" className="nav-link active">
                        <i className="nav-icon bi bi-shop"></i>
                        <p>Mes Boutiques</p>
                      </a>
                    </li>
                    <br/><br/>
                    <li className="nav-item">
                      <a href="/gestion-utilisateurs/" className="nav-link active">
                        <i className="nav-icon bi bi-people"></i>
                        <p>Gestion des Utilisateurs</p>
                      </a>
                    </li>
                    <br/><br/>
                    <li className="nav-item">
                      <a href="/products/" className="nav-link active">
                        <i className="nav-icon bi bi-bag-check"></i>
                        <p>Gestion des Produits</p>
                      </a>
                    </li>
                    <br/><br/>
                    <li className="nav-item">
                      <a href="/stocks/" className="nav-link active">
                        <i className="nav-icon bi bi-collection-fill"></i>
                        <p>Gestion des Stocks</p>
                      </a>
                    </li>

                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="app-main">
          <div className="app-content-header">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="mb-1">Dashboard Responsable Boutique</h3>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-end">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="app-content">
            <div className="container-fluid">
              <div className="row">
                {/* Small Box Widgets */}
                <div className="col-lg-3 col-6">
                  <div className="small-box text-bg-primary">
                    <div className="inner">
                      <h3>{nbProduits}</h3>
                      <p>Nouveaux produits</p>
                    </div>
                    <svg className="small-box-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                    </svg>
                    <a href="#" className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                      More info <i className="bi bi-link-45deg"></i>
                    </a>
                  </div>
                </div>
                {/* Add other small box widgets here */}
                <div className="col-lg-3 col-6">
                  {/*begin::Small Box Widget 2*/}
                  <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>53<sup className="fs-5">%</sup></h3>
                    <p>Niveau de stock</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"
                    ></path>
                  </svg>
                  <a
                    href="#"
                    className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg"></i>
                  </a>
                </div>

                </div>
                <div className="col-lg-3 col-6">
                {/*begin::Small Box Widget 3*/}
                <div className="small-box text-bg-warning">
                  <div className="inner">
                    <h3>{nbGestionnaires || 'aucun gestionnaire'}</h3>
                    <p>Gestionnaires</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"
                    ></path>
                  </svg>
                  <a
                    href="#"
                    className="small-box-footer link-dark link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
                {/* <!--end::Small Box Widget 3--> */}
              </div>
              {/*end::Col*/}
              <div className="col-lg-3 col-6">
                {/*begin::Small Box Widget 4*/}
                <div className="small-box text-bg-danger">
                  <div className="inner">
                    <h3>{nbBoutiques}</h3>
                    <p>Boutiques</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
                    ></path>
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
                    ></path>
                  </svg>
                  <a
                    href="#"
                    className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg"></i>
                  </a>
                </div>
                {/* <!--end::Small Box Widget 4--> */}
              </div>
              {/* <!--end::Col--> */}
                </div>

                <div className="row">
                <div className="col-lg-7 connectedSortable">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h3 className="card-title">Disponibilité de stocks par produits</h3>
                    </div>
                    <div className="card-body">
                      <div id="revenue-chart"></div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 connectedSortable">
                  <div className="card text-white bg-primary bg-gradient border-primary mb-4">
                    <div className="card-header border-0">
                      <h3 className="card-title">Nos Boutiques</h3>
                    </div>
                    <div className="card-body">
                      <div id="world-map" style={{ height: '220px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="float-end d-none d-sm-inline">C'est pour vous</div>
          <strong>
            Copyright &copy; 2025 &nbsp;
            <a href="#" className="text-decoration-none">Votre boutique plus prés de chez vous</a> .
          </strong>
         Tout droit reservé.
        </footer>
      </div>
    </div>
  );
};

export default UserAdministrationPage;