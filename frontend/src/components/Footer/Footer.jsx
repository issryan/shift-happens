import React from 'react';
import './Footer.css';
import { FaLinkedin, FaGithub, FaIdCard } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <h3>Shift Happens</h3>
                </div>
                <div className="footer-center">
                    <p>All rights reserved. Ryan Arafeh 2024.</p>
                </div>
                <div className="footer-right">
                    <a href="https://www.linkedin.com" className="social-icon">
                        <FaLinkedin />
                    </a>
                    <a href="https://www.github.com" className="social-icon">
                        <FaGithub />
                    </a>
                    <a href="https://www.example.com" className="social-icon">
                        <FaIdCard />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;