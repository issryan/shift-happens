import React, { useState } from 'react';
import { createBusiness } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const BusinessInfo = () => {
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBusiness({ name: businessName, location });
      navigate('/operations');
    } catch (err) {
      console.error('Error saving business info:', err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Business Information
        </h2>
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-2 mb-6 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default BusinessInfo;