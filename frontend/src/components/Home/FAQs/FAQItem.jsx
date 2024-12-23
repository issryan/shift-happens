import React, { useState } from 'react';
import './FAQItem.css';

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="faq-item">
            <div className="faq-question" onClick={toggleOpen}>
                <h3>{question}</h3>
                <button className="toggle-button">
                    {isOpen ? '-' : '+'}
                </button>
            </div>
            {isOpen && <p className="faq-answer">{answer}</p>}
        </div>
    );
}

export default FAQItem;