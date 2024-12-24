import React, { useState } from 'react';
import { createOperations } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const OperationsInfo = () => {
  const [businessHours, setBusinessHours] = useState({
    Mon: { start: '', end: '' },
    Tue: { start: '', end: '' },
    Wed: { start: '', end: '' },
    Thu: { start: '', end: '' },
    Fri: { start: '', end: '' },
    Sat: { start: '', end: '' },
    Sun: { start: '', end: '' },
  });

  const [minEmployeesPerDay, setMinEmployeesPerDay] = useState({
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  });

  const navigate = useNavigate();

  const handleBusinessHoursChange = (day, key, value) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [key]: value },
    }));
  };

  const handleMinEmployeesChange = (day, value) => {
    setMinEmployeesPerDay((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        businessHours,
        minEmployeesPerDay,
      };
      console.log('Submitting payload:', payload);
      await createOperations(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving operations info:', err.message);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-3xl"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Operations Information
        </h2>
        {Object.keys(businessHours).map((day) => (
          <div key={day} className="flex items-center justify-between mb-4">
            <label className="w-1/6 text-gray-600 font-medium">{day}</label>
            <div className="flex gap-2 w-2/3">
              <input
                type="time"
                value={businessHours[day].start}
                onChange={(e) =>
                  handleBusinessHoursChange(day, 'start', e.target.value)
                }
                className="p-2 border rounded w-1/2"
                required
              />
              <input
                type="time"
                value={businessHours[day].end}
                onChange={(e) =>
                  handleBusinessHoursChange(day, 'end', e.target.value)
                }
                className="p-2 border rounded w-1/2"
                required
              />
            </div>
            <input
              type="number"
              value={minEmployeesPerDay[day]}
              onChange={(e) =>
                handleMinEmployeesChange(day, Number(e.target.value))
              }
              className="p-2 border rounded w-1/6"
              min="0"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default OperationsInfo;