import React from 'react';
import './Nav.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  let navigate = useNavigate();

    const loginNavigate = () => {
        navigate('/login');
    };

    const signupNavigate = () => {
      navigate("/register");
    };

  return (
    <nav className="navbar">
      <div className="logo">Shift Happens</div>

      <div className="sitemap">
        <a href="/demos" className="navLink">Demos</a>
        <a href="/features" className="navLink">Features</a>
        <a href="/contact" className="navLink">Contact</a>
      </div>

      <div className="buttonsContainer">
        <button className="loginButton" onClick={loginNavigate}>Log In</button>
        <button className="getStartedButton" onClick={signupNavigate}>Get Started</button>
      </div>
    </nav>
  );
}

export default Navbar;