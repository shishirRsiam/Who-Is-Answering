import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer blur-bg">
            <div className="container footer-content">
                <div className="footer-section">
                    <h3>ScaleHub</h3>
                    <p>Learn Docker scaling with real-time container monitoring.</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#about">About</a></li>
                        <li><a href="#docs">Documentation</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="#github" aria-label="GitHub"><FaGithub /></a>
                        <a href="#linkedin" aria-label="LinkedIn"><FaLinkedin /></a>
                        <a href="#twitter" aria-label="Twitter"><FaTwitter /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                © 2026 ScaleHub. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
