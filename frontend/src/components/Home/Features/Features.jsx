import React from 'react';
import './Features.css';
import ControlIcon from '../../../assets/clickIcon.png';
import DetectionIcon from '../../../assets/detectIcon.png';
import FreeIcon from '../../../assets/freeIcon.png';


function Features() {
    return (
        <section className="features">
            <div className="feature">
                <img src={FreeIcon} alt="Free Icon" />
                <h3>Zero Cost, Full Control</h3>
                <p>Improve your scheduling at no extra cost. 'Shift Happens' is completely free, offering you all the smart scheduling tools without the price tag.</p>
            </div>
            <div className="feature">
                <img src={ControlIcon} alt="Auto-Schedule Icon" />
                <h3>Auto-Scheduling with a Click</h3>
                <p>Create your team, set their availability, and let 'Shift Happens' auto-fill the calendar for you. It's scheduling made smart and simple.</p>
            </div>
            <div className="feature">
                <img src={DetectionIcon} alt="Detection Icon" />
                <h3>Instant Conflict Detection</h3>
                <p>Schedule with confidence. Our real-time conflict detection ensures you're always staffed right, avoiding over or under-staffing pitfalls.</p>
            </div>
        </section>
    );
}

export default Features;