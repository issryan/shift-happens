import React, { useState, useEffect } from "react";
import { getEmployees } from "../utils/api";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData);
    } catch (err) {
      console.error("Error fetching employees:", err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add new employee to the list
  const handleAddEmployee = () => {
    // Re-fetch employees to ensure the list is up-to-date
    fetchEmployees();
  };

  // Update employee in the list
  const handleEditEmployee = () => {
    // Re-fetch employees to ensure the list is up-to-date
    fetchEmployees();
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
          onAdd={handleAddEmployee}
        />
      )}

      {/* Edit Employee Modal */}
      {isEditEmployeeModalOpen && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={closeEditModal}
          onUpdate={handleEditEmployee}
        />
      )}

      {/* Employee Table */}
      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Phone</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{employee.name}</td>
              <td className="p-3 border-b">{employee.email || "N/A"}</td>
              <td className="p-3 border-b">{employee.phone || "N/A"}</td>
              <td className="p-3 border-b">{employee.status || "N/A"}</td>
              <td className="p-3 border-b flex gap-2">
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
                  onClick={() =>
                    setEmployees((prev) => prev.filter((e) => e._id !== employee._id))
                  }
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