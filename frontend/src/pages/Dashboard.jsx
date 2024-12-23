import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <table className="min-w-full bg-white border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td className="border border-gray-300 p-2">{employee.name}</td>
              <td className="border border-gray-300 p-2">{employee.email}</td>
              <td className="border border-gray-300 p-2">{employee.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;