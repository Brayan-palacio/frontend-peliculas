import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { path: '/media', label: 'Películas / Series', icon: '🎬' },
    { path: '/genres', label: 'Géneros', icon: '🏷️' },
    { path: '/directors', label: 'Directores', icon: '🎭' },
    { path: '/producers', label: 'Productoras', icon: '🏢' },
    { path: '/types', label: 'Tipos', icon: '📂' },
  ];

  const currentPage = menuItems.find(item => location.pathname === item.path);
  const pageTitle = currentPage ? currentPage.label : 'Dashboard';

  return (
    <nav className={`navbar navbar-expand-lg custom-navbar mb-4 ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <span className="brand-icon">🎬</span>
          <span>
            Cine<span className="brand-highlight">Flix</span>
          </span>
        </Link>

        {/* Toggler */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <span className="bar"></span>
          </span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink 
                  className="nav-link" 
                  to={item.path}
                  activeClassName="active"
                  end={item.path === '/'}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                  {location.pathname === item.path && (
                    <span className="nav-indicator"></span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};