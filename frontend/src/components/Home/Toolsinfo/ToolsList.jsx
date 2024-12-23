import React, { useState } from 'react';
import './Toolsinfo.css';

function ToolsList() {
    const [activeIndex, setActiveIndex] = useState(0);

    const toolsData = [
        {
            title: "Customizable Shift Swapping",
            description: "Need to make changes? No problem. Our intuitive interface allows for easy drag-and-drop adjustments. Manage your team's shifts with flexibility and ease, ensuring everyone's happy."
        },
        {
            title: "Intelligent Alerts",
            description: "Stay ahead of scheduling conflicts with alerts that help you intervene before issues become problems."
        },
        {
            title: "Smart Staffing Balance",
            description: "Automatically balance staff levels to optimize coverage and efficiency."
        }
    ];

    const toggleExpand = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="tools-list">
            {toolsData.map((tool, index) => (
                <div
                    key={index}
                    className={`tool-item ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => toggleExpand(index)}
                >
                    <h3>{tool.title}</h3>
                    {activeIndex === index && (
                        <p className="tool-description">{tool.description}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ToolsList;