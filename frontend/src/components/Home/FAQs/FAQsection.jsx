import React from 'react';
import './FAQsection.css';
import FAQItem from './FAQItem';

function FAQSection() {
    const faqData = [
        {
            question: 'How does Shift Happens simplify the scheduling process?',
            answer: 'Shift Happens automates schedule creation based on employee availability, flags any conflicts, and allows for easy drag-and-drop adjustments, turning hours of planning into just a few clicks.',
        },
        {
            question: 'Is Shift Happens really free?',
            answer: 'Absolutely! Shift Happens is free for managers and teams, ensuring no-cost efficiency for your scheduling needs.',
        },
        {
            question: 'What happens if there’s a scheduling conflict?',
            answer: 'The app instantly notifies you of any scheduling conflicts, like over or under booking on certain days, employees at risk of working overtime, or not being scheduled for enough hours, allowing you to make informed adjustments quickly.',
        },
        {
            question: 'Is it possible to export the schedule for offline use?',
            answer: 'Yes! You can seamlessly export your schedules to Google Calendar, Outlook Calendar, or as a PDF, Excel, and PNG files for easy access and sharing across platforms and formats.',
        },
    ];

    return (
        <section className="faq-section">
            <h2>FAQs</h2>
            {faqData.map((faq, index) => (
                <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                />
            ))}
        </section>
    );
}

export default FAQSection;