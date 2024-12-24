import React, { useState } from "react";
import { addEmployee } from "../utils/api";

const EmployeeModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState({
    Mon: { start: "", end: "", copyAbove: false },
    Tue: { start: "", end: "", copyAbove: false },
    Wed: { start: "", end: "", copyAbove: false },
    Thu: { start: "", end: "", copyAbove: false },
    Fri: { start: "", end: "", copyAbove: false },
    Sat: { start: "", end: "", copyAbove: false },
    Sun: { start: "", end: "", copyAbove: false },
  });

  const handleAvailabilityChange = (day, key, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [key]: value, copyAbove: false },
    }));
  };

  const handleCopyAbove = (day) => {
    const days = Object.keys(availability);
    const currentIndex = days.indexOf(day);

    if (currentIndex > 0) {
      const previousDay = days[currentIndex - 1];
      setAvailability((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          start: prev[previousDay].start,
          end: prev[previousDay].end,
          copyAbove: !prev[day].copyAbove,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty availability rows
      const filteredAvailability = Object.entries(availability)
        .filter(([, value]) => value.start && value.end)
        .map(([day, { start, end }]) => ({ day, start, end }));

      const payload = {
        name,
        email,
        phone,
        availability: filteredAvailability,
      };

      console.log("Payload being sent:", payload); // Debugging

      await addEmployee(payload);
      onAdd(payload);
      onClose();
    } catch (err) {
      console.error("Error adding employee:", err.message); // Debugging
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
        <h2 className="text-lg font-bold mb-4">Add Employee</h2>
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

          <h3 className="text-md font-semibold text-gray-700 mb-2">Availability</h3>
          {Object.keys(availability).map((day) => (
            <div key={day} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="w-1/6 text-gray-600 font-medium">{day}</label>
                <div className="flex gap-2 w-2/3">
                  <input
                    type="time"
                    value={availability[day].start}
                    onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                    className="p-2 border rounded w-1/2"
                  />
                  <input
                    type="time"
                    value={availability[day].end}
                    onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                    className="p-2 border rounded w-1/2"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={availability[day].copyAbove}
                    onChange={() => handleCopyAbove(day)}
                  />
                  <span className="text-gray-600 text-sm">Copy Above</span>
                </div>
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
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;