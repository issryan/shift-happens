const Employee = require('../models/Employee');

// Get all employees for the logged-in manager
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ manager: req.user.id });
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, phone, availability, hoursRequired } = req.body;

    const newEmployee = new Employee({
      manager: req.user.id,
      name,
      email,
      phone,
      availability,
      hoursRequired,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Error adding employee:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.manager.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this employee' });
    }

    await Employee.deleteOne({ _id: employee._id });

    res.status(200).json({ message: 'Employee removed' });
  } catch (err) {
    console.error('Error deleting employee:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};