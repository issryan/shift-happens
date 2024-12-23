import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [onLeaveCount, setOnLeaveCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    availability: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
    },
    status: 'Available',
  });

  // Fetch employees and calculate stats
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5500/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);

      // Calculate total hours and employees on leave
      const total = res.data.reduce((sum, emp) => sum + emp.hoursRequired, 0);
      setTotalHours(total);
      const leaveCount = res.data.filter((emp) => emp.status === 'On Leave').length;
      setOnLeaveCount(leaveCount);
    } catch (err) {
      console.error('Error fetching employees:', err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5500/api/employees', newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddModal(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error adding employee:', err.message);
    }
  };

  const handleAvailabilityChange = (day, time) => {
    setNewEmployee((prev) => ({
      ...prev,
      availability: { ...prev.availability, [day]: time },
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:bg-gray-200 transition"
        >
          <i className="fas fa-user-plus text-3xl text-blue-500 mb-2"></i>
          <span className="text-xl font-bold">Add Employee</span>
        </button>
        <button
          onClick={() => alert('View Schedule (Placeholder)')}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:bg-gray-200 transition"
        >
          <i className="fas fa-calendar-alt text-3xl text-green-500 mb-2"></i>
          <span className="text-xl font-bold">View Schedule</span>
        </button>
        <button
          onClick={() => alert('Export Schedule (Placeholder)')}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:bg-gray-200 transition"
        >
          <i className="fas fa-file-export text-3xl text-yellow-500 mb-2"></i>
          <span className="text-xl font-bold">Export Schedule</span>
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Total Hours Scheduled</h2>
          <p className="text-4xl font-bold text-blue-500">{totalHours}h</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Total Employees</h2>
          <p className="text-4xl font-bold text-green-500">{employees.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4">Employees On Leave</h2>
          <p className="text-4xl font-bold text-red-500">{onLeaveCount}</p>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Current Employees</h2>
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Availability</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="border border-gray-300 p-2">{employee.name}</td>
                <td className="border border-gray-300 p-2">
                  {Object.entries(employee.availability).map(([day, time]) => (
                    <div key={day}>
                      {day}: {time || 'X'}
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 p-2">{employee.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <Modal
        title="Add New Employee"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEmployee}
      >
        <input
          type="text"
          name="name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          placeholder="Employee Name"
          className="w-full p-2 border rounded mb-4"
        />
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <div key={day} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{day}</label>
            <input
              type="text"
              value={newEmployee.availability[day]}
              onChange={(e) => handleAvailabilityChange(day, e.target.value)}
              placeholder="e.g., 9:00-13:00"
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <select
          name="status"
          value={newEmployee.status}
          onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Available">Available</option>
          <option value="On Leave">On Leave</option>
          <option value="Sick">Sick</option>
        </select>
      </Modal>
    </div>
  );
};

export default Dashboard;