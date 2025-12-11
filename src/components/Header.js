import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="branding">
        <Link to="/" className="logo">BuildOne</Link>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  );
}

export default Header;
