import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BusinessInfo() {
    const [businessName, setBusinessName] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        await fetch('/api/business-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ businessName, location }),
        });

        navigate('/operations-info');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <button type="submit">Next</button>
        </form>
    );
}

export default BusinessInfo;