import React, { useState } from "react";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";

const EmployeeList = ({ employees, handleEdit, handleDelete, fetchEmployees }) => {
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper to format availability for each day
  const formatAvailability = (availability, day) => {
    const dayData = availability.find((slot) => slot.day === day);
    return dayData ? `${dayData.start}-${dayData.end}` : "X";
  };

  // Open edit modal
  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setSelectedEmployee(null);
    setIsEditEmployeeModalOpen(false);
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      {/* Header and Add Employee Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Employee List</h3>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => setIsAddEmployeeModalOpen(true)}
        >
          Add Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      {isAddEmployeeModalOpen && (
        <AddEmployeeModal
          onClose={() => setIsAddEmployeeModalOpen(false)}
          onAdd={fetchEmployees}
        />
      )}

      {/* Edit Employee Modal */}
      {isEditEmployeeModalOpen && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={closeEditModal}
          onUpdate={fetchEmployees} // Refresh employees after editing
        />
      )}

      {/* Employee Table */}
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Phone</th>
            <th className="p-3 border-b">Hours Required</th>
            {daysOfWeek.map((day) => (
              <th key={day} className="p-3 border-b text-center">{day}</th>
            ))}
            <th className="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{employee.name}</td>
              <td className="p-3 border-b">{employee.email || "N/A"}</td>
              <td className="p-3 border-b">{employee.phone || "N/A"}</td>
              <td className="p-3 border-b">{employee.hoursRequired || "N/A"} hrs</td>
              {daysOfWeek.map((day) => (
                <td key={day} className="p-3 border-b text-center">
                  {formatAvailability(employee.availability, day)}
                </td>
              ))}
              <td className="p-3 border-b flex gap-2 justify-center">
                {/* Edit Button */}
                <button
                  className="bg-yellow-400 text-white py-1 px-3 rounded hover:bg-yellow-500"
                  onClick={() => openEditModal(employee)}
                >
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No employees message */}
      {employees.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No employees found</p>
      )}
    </div>
  );
};

export default EmployeeList;