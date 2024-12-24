import React, { useState } from 'react';
import { saveBusinessInfo } from '../utils/api';

const BusinessInfoPage = () => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [hours, setHours] = useState('');
  const [minEmployees, setMinEmployees] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveBusinessInfo({ businessName, location, hours, minEmployees });
      window.location.href = '/operations';
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="info-form">
      <h2>Business Information</h2>
      <input
        type="text"
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Hours of Operation (e.g., 9AM - 5PM)"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Minimum Employees Per Day"
        value={minEmployees}
        onChange={(e) => setMinEmployees(e.target.value)}
        required
      />
      <button type="submit">Save & Continue</button>
    </form>
  );
};

export default BusinessInfoPage;