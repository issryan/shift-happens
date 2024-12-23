import React from 'react';
import './Hero.css'
import illustration from '../../../assets/illustrationTeam.png'
import { useNavigate } from 'react-router-dom';


function Hero() {

    const scrollToInstructions = () => {
        const section = document.getElementById('instructions-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    let navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/login');
    };


    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text">
                    <h1>Seamless Scheduling, Happier Teams</h1>
                    <p>Scheduling is no longer a puzzle with "Shift Happens." Our free app lets managers weave through employee scheduling with ease, saving hours by automating conflict detection and resolution. Whether it's avoiding under or overstaffing or just crafting the perfect monthly schedule, we make sure you’re covered. So why wait? Say goodbye to the scheduling scramble and hello to hassle-free harmony with "Shift Happens."</p>
                    <div className="hero-buttons">
                        <button className="btn-get-started" onClick={handleNavigate}>Get Started</button>
                        <button className="btn-learn-more" onClick={scrollToInstructions}>Learn more →</button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={illustration} alt="Hero" />
                </div>
            </div>
        </section>
    );
}

export default Hero;