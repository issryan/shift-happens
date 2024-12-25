import React, { useState, useEffect } from "react";
import { getEmployees, addEmployee, deleteEmployee, updateEmployee } from "../utils/api";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err.message);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employeeData) => {
    try {
      await addEmployee(employeeData);
      const updatedEmployees = await getEmployees();
      setEmployees(updatedEmployees); // Update the list of employees
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding employee:", err.message);
    }
  };

  const handleEditEmployee = async (updatedEmployee) => {
    try {
      await updateEmployee(selectedEmployee._id, updatedEmployee);
      const updatedEmployees = await getEmployees();
      setEmployees(updatedEmployees); // Refresh the list of employees
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating employee:", err.message);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      setEmployees(employees.filter((employee) => employee._id !== employeeId));
    } catch (err) {
      console.error("Error deleting employee:", err.message);
    }
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={() => setShowAddModal(true)}
      >
        Add Employee
      </button>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
              <td className="border border-gray-300 px-4 py-2">{employee.email || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{employee.phone || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => openEditModal(employee)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline ml-2"
                  onClick={() => handleDeleteEmployee(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleEditEmployee}
        />
      )}
    </div>
  );
};

export default Dashboard;