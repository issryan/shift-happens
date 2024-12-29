import React, { useState, useEffect } from "react";
import { addEmployee, fetchOperations } from "../../utils/api";

const AddEmployeeModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [operationsHours, setOperationsHours] = useState({});
  const [hoursRequired, setHoursRequired] = useState(0);
  const [availability, setAvailability] = useState({});

  // Fetch operations hours when the modal loads
  useEffect(() => {
    const fetchOperationsHours = async () => {
      try {
        const operations = await fetchOperations();
        console.log("Operations Hours:", operations);

        if (operations && operations.hours) {
          setOperationsHours(operations.hours);

          // Initialize availability based on operations hours
          const initialAvailability = {};
          Object.keys(operations.hours).forEach((day) => {
            const { start, end } = operations.hours[day];
            initialAvailability[day] = {
              available: true, // Default to available
              start,
              end,
            };
          });
          setAvailability(initialAvailability);
        } else {
          console.error("Invalid operations hours data");
        }
      } catch (err) {
        console.error("Error fetching operations hours:", err.message);
      }
    };

    fetchOperationsHours();
  }, []);

  // Handle changes in availability
  const handleAvailabilityChange = (day, key, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [key]: value },
    }));
  };

  // Toggle availability for a day
  const toggleAvailability = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
        ...(prev[day].available
          ? { start: "", end: "" } // Clear start/end when unavailable
          : {
            start: operationsHours[day]?.start || "09:00", // Default start
            end: operationsHours[day]?.end || "17:00", // Default end
          }),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredAvailability = Object.entries(availability)
        .filter(([, value]) => value.available)
        .map(([day, { start, end }]) => ({ day, start, end }));

      const payload = {
        name,
        email: email || null,
        phone: phone || null,
        availability: filteredAvailability,
        hoursRequired: hoursRequired || 0,
      };

      console.log("Payload being sent:", payload);

      await addEmployee(payload);
      onAdd(payload);
      onClose();
    } catch (err) {
      console.error("Error adding employee:", err.message);
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
                      min={operationsHours[day]?.start || "00:00"}
                      max={operationsHours[day]?.end || "23:59"}
                      onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                      className="p-2 border rounded w-1/2"
                      required
                    />
                    <input
                      type="time"
                      value={availability[day].end}
                      min={availability[day]?.start} // End time must be after start time
                      max={operationsHours[day]?.end || "23:59"}
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
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;