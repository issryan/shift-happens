import React, { useState, useEffect } from 'react';
import { getEmployees, addEmployee } from '../utils/api';
import EmployeeModal from '../components/AddEmployeeModal';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error('Error fetching employees:', err.message);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employeeData) => {
    try {
      const newEmployee = await addEmployee(employeeData);
      setEmployees([...employees, newEmployee]); // Update employee list
      setShowModal(false); // Close the modal
    } catch (err) {
      console.error('Error adding employee:', err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={() => setShowModal(true)}
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
              <td className="border border-gray-300 px-4 py-2">{employee.email || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{employee.phone || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <EmployeeModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default Dashboard;