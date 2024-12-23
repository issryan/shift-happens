import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [onLeaveCount, setOnLeaveCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
  const [currentEmployee, setCurrentEmployee] = useState(null);

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

  // Handle Add Employee
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

  // Handle Edit Employee
  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setShowEditModal(true);
  };

  const handleSaveEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5500/api/employees/${currentEmployee._id}`,
        currentEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditModal(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error updating employee:', err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5500/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err.message);
    }
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditModal) {
      setCurrentEmployee((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailabilityChange = (day, time) => {
    if (showEditModal) {
      setCurrentEmployee((prev) => ({
        ...prev,
        availability: { ...prev.availability, [day]: time },
      }));
    } else {
      setNewEmployee((prev) => ({
        ...prev,
        availability: { ...prev.availability, [day]: time },
      }));
    }
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
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="border border-gray-300 p-2">{employee.name}</td>
                <td className="border border-gray-300 p-2">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                          <th key={day} className="p-1 border text-center">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                          <td key={day} className="p-1 border text-center">
                            {employee.availability[day] || 'X'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="border border-gray-300 p-2">{employee.status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEmployee}
        newEmployee={newEmployee}
        handleInputChange={handleInputChange}
        handleAvailabilityChange={handleAvailabilityChange}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSaveEmployee}
        currentEmployee={currentEmployee}
        handleInputChange={handleInputChange}
        handleAvailabilityChange={handleAvailabilityChange}
      />
    </div>
  );
};

export default Dashboard;