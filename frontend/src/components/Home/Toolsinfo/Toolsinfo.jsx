import React from 'react';
import './Toolsinfo.css';
import toolsImage from '../../../assets/CalendarTools.png';
import ToolsList from './ToolsList';

function ToolsInfo() {
    return (
        <section className="tools-info">
            <h2>All the essential tools</h2>
            <p className='subtitle'>Say goodbye to scheduling headaches. "Shift Happens" gives you the power to create conflict-free schedules in a snap, all within a sleek, user-friendly interface.</p>
            <div className="tools-content">
                <div className="tools-image">
                    <img src={toolsImage} alt="Tools Display" />
                </div>
                <ToolsList />
            </div>
        </section>
    );
}

export default ToolsInfo;