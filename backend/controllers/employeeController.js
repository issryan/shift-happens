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

    // Validate availability structure
    if (
      !Array.isArray(availability) ||
      availability.some(
        slot => !slot.day || !slot.start || !slot.end
      )
    ) {
      return res.status(400).json({
        message: 'Invalid availability format. Ensure day, start, and end are provided.',
      });
    }

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

//get analytics for manager
exports.getAnalytics = async (req, res) => {
  try {
    const employees = await Employee.find({ manager: req.user.id });

    // Calculate total employees
    const totalEmployees = employees.length;

    // Calculate availability
    const availabilityStats = employees.reduce((acc, employee) => {
      employee.availability.forEach(({ day, start, end }) => {
        acc[day] = acc[day] || [];
        acc[day].push({ start, end });
      });
      return acc;
    }, {});

    // Calculate overstaffing/understaffing
    const operations = await Operations.findOne({ manager: req.user.id });
    const staffingStatus = Object.keys(availabilityStats).map(day => {
      const staffCount = availabilityStats[day].length;
      const needed = operations.minimumEmployeesPerDay[day] || 0;
      return {
        day,
        staffCount,
        needed,
        status: staffCount < needed ? 'understaffed' : 'sufficient',
      };
    });

    res.status(200).json({
      totalEmployees,
      availabilityStats,
      staffingStatus,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//search for employee in list of employees
exports.searchEmployees = async (req, res) => {
  try {
    const { name, day, start, end } = req.query;

    // Build the query
    const query = { manager: req.user.id };
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
    }
    if (day) {
      query['availability.day'] = day;
    }
    if (start || end) {
      query['availability.start'] = { $gte: start || '00:00' };
      query['availability.end'] = { $lte: end || '23:59' };
    }

    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error searching employees:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};