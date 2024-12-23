import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OperationsInfo() {
    const [businessHours, setBusinessHours] = useState({ Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' });
    const [minEmployees, setMinEmployees] = useState({ Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 });

    const handleBusinessHoursChange = (day, value) => {
        setBusinessHours({ ...businessHours, [day]: value });
    };

    const handleMinEmployeesChange = (day, value) => {
        setMinEmployees({ ...minEmployees, [day]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        await fetch('/api/business-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ businessHours, minEmployees }),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(businessHours).map((day) => (
                <div key={day}>
                    <label>{day}</label>
                    <input type="text" placeholder="Hours (e.g., 9:00-17:00)" onChange={(e) => handleBusinessHoursChange(day, e.target.value)} />
                    <input type="number" placeholder="Min Employees" onChange={(e) => handleMinEmployeesChange(day, e.target.value)} />
                </div>
            ))}
            <button type="submit">Save</button>
        </form>
    );
}

export default OperationsInfo;