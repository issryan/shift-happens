const Employee = require('../models/Employee');
const Operations = require('../models/Operations');

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
    console.log("Request Body:", req.body);

    const { name, email = null, phone = null, availability, hoursRequired = 0 } = req.body;

    if (!name || !availability) {
      return res.status(400).json({ message: "Name and availability are required" });
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
    console.error("Error adding employee:", err.message);
    res.status(500).json({ message: "Server error" });
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

    // Calculate availability stats
    const availabilityStats = employees.reduce((acc, employee) => {
      employee.availability.forEach(({ day }) => {
        acc[day] = acc[day] || 0;
        acc[day]++;
      });
      return acc;
    }, {});

    // Fetch required staffing per day from operations
    const operations = await Operations.findOne({ userId: req.user.id });

    if (!operations) {
      return res.status(404).json({ message: "Operations not defined for the manager." });
    }

    const minEmployeesPerDay = Object.fromEntries(operations.minEmployeesPerDay); // Convert Map to object

    const staffingStatus = Object.keys(minEmployeesPerDay).map((day) => {
      const required = minEmployeesPerDay[day] || 0;
      const assigned = availabilityStats[day] || 0;
      const status = assigned < required ? "understaffed" : "sufficient";

      return { day, staffCount: assigned, needed: required, status };
    });

    res.status(200).json({
      totalEmployees,
      staffingStatus,
      alerts: staffingStatus.filter((day) => day.status === "understaffed").length,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err.message);
    res.status(500).json({ message: "Server error" });
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

// Update employee details
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, availability, hoursRequired } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.manager.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this employee' });
    }

    // Update fields
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (availability) employee.availability = availability;
    if (hoursRequired) employee.hoursRequired = hoursRequired;

    await employee.save();
    res.status(200).json(employee);
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};