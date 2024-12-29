import React, { useState, useEffect } from "react";
import { updateEmployee } from "../../utils/api";

const EditEmployeeModal = ({ employee, onClose, onUpdate }) => {
  const [name, setName] = useState(employee?.name || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [phone, setPhone] = useState(employee?.phone || "");
  const [hoursRequired, setHoursRequired] = useState(employee?.hoursRequired || 0);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    if (employee && employee.availability) {
      const initialAvailability = {};
      // Initialize availability based on the employee's existing availability
      for (let day of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) {
        const dayAvailability = employee.availability.find((a) => a.day === day);
        if (dayAvailability) {
          initialAvailability[day] = {
            available: true,
            start: dayAvailability.start,
            end: dayAvailability.end,
          };
        } else {
          initialAvailability[day] = { available: false, start: "", end: "" };
        }
      }
      setAvailability(initialAvailability);
    }
  }, [employee]);

  const handleAvailabilityChange = (day, key, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [key]: value },
    }));
  };

  const toggleAvailability = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
        ...(prev[day].available
          ? { start: "", end: "" } // Clear start/end when unavailable
          : { start: "09:00", end: "17:00" }), // Default times
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredAvailability = Object.entries(availability)
        .filter(([, value]) => value.available)
        .map(([day, { start, end }]) => ({ day, start, end }));

      const updatedEmployee = {
        name,
        email: email || null,
        phone: phone || null,
        hoursRequired,
        availability: filteredAvailability,
      };

      await updateEmployee(employee._id, updatedEmployee);
      onUpdate(updatedEmployee); // Notify parent component of the update
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error updating employee:", err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
        <h2 className="text-lg font-bold mb-4">Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Hours Required</label>
            <input
              type="number"
              value={hoursRequired}
              onChange={(e) => setHoursRequired(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              placeholder="Enter required hours"
            />
          </div>

          <h3 className="text-md font-semibold text-gray-700 mb-2">Availability</h3>
          {Object.keys(availability).map((day) => (
            <div key={day} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="w-1/6 text-gray-600 font-medium">{day}</label>
                <div className="flex items-center gap-2 w-1/3">
                  <input
                    type="checkbox"
                    checked={!availability[day].available}
                    onChange={() => toggleAvailability(day)}
                  />
                  <span className="text-gray-600 text-sm">Unavailable</span>
                </div>
                {availability[day]?.available && (
                  <div className="flex gap-2 w-2/3">
                    <input
                      type="time"
                      value={availability[day].start}
                      onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                      className="p-2 border rounded w-1/2"
                      required
                    />
                    <input
                      type="time"
                      value={availability[day].end}
                      onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                      className="p-2 border rounded w-1/2"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;