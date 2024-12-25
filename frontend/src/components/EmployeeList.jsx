import React, { useState, useEffect } from "react";
import { getEmployees, updateEmployee } from "../utils/api";
import AddEmployeeModal from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
      } catch (err) {
        console.error("Error fetching employees:", err.message);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleEditEmployee = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee
      )
    );
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEmployee(null);
    setIsEditEmployeeModalOpen(false);
  };

  const handleUpdateEmployee = async (updatedData) => {
    try {
      const updatedEmployee = await updateEmployee(selectedEmployee._id, updatedData);
      handleEditEmployee(updatedEmployee);
      closeEditModal();
    } catch (err) {
      console.error("Error updating employee:", err.message);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Employee List</h3>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => setIsAddEmployeeModalOpen(true)}
        >
          Add Employee
        </button>
      </div>
      {isAddEmployeeModalOpen && (
        <AddEmployeeModal
          onClose={() => setIsAddEmployeeModalOpen(false)}
          onAdd={handleAddEmployee}
        />
      )}
      {isEditEmployeeModalOpen && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={closeEditModal}
          onUpdate={handleEditEmployee}
        />
      )}
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
                <button
                  className="bg-yellow-400 text-white py-1 px-3 rounded hover:bg-yellow-500"
                  onClick={() => openEditModal(employee)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  onClick={() => setEmployees((prev) => prev.filter((e) => e._id !== employee._id))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No employees found</p>
      )}
    </div>
  );
};

export default EmployeeList;