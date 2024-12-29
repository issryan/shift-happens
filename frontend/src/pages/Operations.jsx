import React, { useEffect, useState } from 'react';
import { createOperations, fetchOperations } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const OperationsInfo = () => {
  const [businessHours, setBusinessHours] = useState({
    Mon: { start: '', end: '', closed: false },
    Tue: { start: '', end: '', closed: false },
    Wed: { start: '', end: '', closed: false },
    Thu: { start: '', end: '', closed: false },
    Fri: { start: '', end: '', closed: false },
    Sat: { start: '', end: '', closed: false },
    Sun: { start: '', end: '', closed: false },
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

  useEffect(() => {
    const checkExistingOperations = async () => {
      try {
        const operations = await fetchOperations();
        if (operations) {
          // Redirect to dashboard if operations already exist
          navigate('/dashboard');
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error checking operations:', error.message);
        }
      }
    };

    checkExistingOperations();
  }, [navigate]);

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

  const toggleClosed = (day) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed, start: '', end: '' },
    }));
  };

  const copyFromAbove = (day) => {
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentIndex = daysOrder.indexOf(day);

    if (currentIndex > 0) {
      const prevDay = daysOrder[currentIndex - 1];

      if (!businessHours[prevDay].closed) {
        setBusinessHours((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            start: prev[prevDay].start,
            end: prev[prevDay].end,
            closed: false,
          },
        }));
        setMinEmployeesPerDay((prev) => ({
          ...prev,
          [day]: prev[prevDay],
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        businessHours,
        minEmployeesPerDay,
      };
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
        className="bg-white p-4 rounded shadow-md w-full max-w-3xl"
      >
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Operations Information
        </h2>
        <div className="space-y-2">
          {Object.keys(businessHours).map((day, index) => (
            <div
              key={day}
              className={`flex items-center justify-between p-2 border rounded-lg ${businessHours[day].closed ? 'bg-gray-200' : ''
                }`}
            >
              {/* Day Label and Checkbox */}
              <div className="flex items-center gap-3 w-1/6">
                <div className="w-[50px] text-right">
                  <label className="text-sm text-gray-600 font-medium">{day}</label>
                </div>
                <input
                  type="checkbox"
                  checked={businessHours[day].closed}
                  onChange={() => toggleClosed(day)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-xs text-gray-500">Closed?</span>
              </div>

              {/* Inputs */}
              {!businessHours[day].closed && (
                <>
                  <div className="flex gap-2 w-1/3">
                    <input
                      type="time"
                      value={businessHours[day].start}
                      onChange={(e) =>
                        handleBusinessHoursChange(day, 'start', e.target.value)
                      }
                      className="p-1 border rounded text-sm w-full"
                      required
                    />
                    <input
                      type="time"
                      value={businessHours[day].end}
                      onChange={(e) =>
                        handleBusinessHoursChange(day, 'end', e.target.value)
                      }
                      className="p-1 border rounded text-sm w-full"
                      required
                    />
                  </div>
                  <input
                    type="number"
                    value={minEmployeesPerDay[day]}
                    onChange={(e) =>
                      handleMinEmployeesChange(day, Number(e.target.value))
                    }
                    className="p-1 border rounded text-sm w-1/6"
                    min="0"
                    required
                  />
                  {/* Copy From Above Button */}
                  <div className="w-[110px]">
                    {index > 0 ? (
                      <button
                        type="button"
                        onClick={() => copyFromAbove(day)}
                        className="bg-gray-300 text-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-400"
                      >
                        Copy from Above
                      </button>
                    ) : (
                      <div className="invisible w-[110px]">Placeholder</div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 mt-4 rounded-md hover:bg-blue-600 text-sm"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default OperationsInfo;