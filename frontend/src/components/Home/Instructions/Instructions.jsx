import React from 'react';
import './Instructions.css';
import teamTableImage from '../../../assets/Group.svg';

function Instructions() {
    return (
        <section className="instructions-team">
            <div className="instructions-header">
                <h2>Your Scheduling, Streamlined</h2>
                <p>In just three simple steps, take back control of your time and focus on what truly matters — your team.</p>
            </div>
            <div className="instructions-content">
                <div className="team-table-image">
                    <img src={teamTableImage} alt="Team Members Table" />
                </div>

                <ol className="instructions-list">
                    <li className="instruction-item">
                        <div className="number-circle">1</div>
                        <div className='instruction-info'>
                            <h3>Set Your Team</h3>
                            <p>Create profiles for your employees and define their weekly availability. Building your team is the first step towards streamlined scheduling.</p>
                        </div>
                    </li>
                    <li className="instruction-item">
                        <div className="number-circle">2</div>
                        <div className='instruction-info'>
                            <h3>Generate the Schedule</h3>
                            <p>With a single click, 'Shift Happens' auto-populates your schedule, smartly aligning employee availability with your staffing needs.</p>
                        </div>
                    </li>
                    <li class="instruction-item">
                        <div class="number-circle">3</div>
                        <div className='instruction-info'>
                            <h3>Fine-tune & Share</h3>
                            <p>Drag-and-drop to adjust shifts as needed. Then, effortlessly export the schedule or share it directly with your team.</p>
                        </div>
                    </li>
                </ol>
            </div>
        </section >
    );
}

export default Instructions;