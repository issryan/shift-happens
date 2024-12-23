import React from 'react';
import './FooterCTA.css';
import { useNavigate } from 'react-router-dom';

function FooterCTA() {
    let navigate = useNavigate();
    const signupNavigate = () => {
        navigate("/signup");
    };

    return (
        <section className="footer-cta">
            <h2>Ready to get started?</h2>
            <p>Take the first step towards effortless scheduling.</p>
            <div className='btn-container'>
                <button className="cta-button" onClick={signupNavigate}>Launch Your Schedule</button>
            </div>
        </section>
    );
}

export default FooterCTA;