// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/recordpage">Speakalytics</Link>
      </div>
      <div className={`navbar__links ${isMobileNavOpen ? 'open' : ''}`}>
        <Link to="/recordpage">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/">Log Out</Link>
      </div>
      <button className="navbar__toggle" onClick={toggleMobileNav}>
        ☰
      </button>
    </nav>
  );
};

export default Navbar;
