const Schedule = require('../models/Schedule');
const Employee = require('../models/Employee');

// Generate a schedule
exports.generateSchedule = async (req, res) => {
  try {
    const { month, businessHours } = req.body;

    const year = new Date().getFullYear();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: "Invalid dates calculated." });
    }

    const employees = await Employee.find({ manager: req.user.id });
    if (!employees.length) {
      return res.status(400).json({ message: "No employees found for this manager." });
    }

    const scheduleData = employees.flatMap((employee) => {
      return Object.keys(businessHours)
        .filter((day) => !businessHours[day].closed)
        .flatMap((day) => {
          const availability = employee.availability.find((a) => a.day === day);
          if (availability) {
            return {
              employeeId: employee._id,
              day,
              date: new Date(startDate),
              startTime: businessHours[day].start,
              endTime: businessHours[day].end,
            };
          }
          return [];
        });
    });

    const newSchedule = new Schedule({
      manager: req.user.id,
      scheduleData,
      startDate,
      endDate,
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error generating schedule:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all schedules for a manager
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ manager: req.user.id });
    res.status(200).json(schedules);
  } catch (err) {
    console.error('Error fetching schedules:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch individual schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Invalid schedule ID provided.' });
    }

    // Find the schedule by ID
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    // Ensure the user is the manager who owns the schedule
    if (schedule.manager.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this schedule.' });
    }

    res.status(200).json(schedule);
  } catch (err) {
    console.error('Error fetching schedule by ID:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduleData, startDate, endDate } = req.body;

    // Find the schedule by ID
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    // Ensure the user is the manager who owns the schedule
    if (schedule.manager.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this schedule.' });
    }

    // Update schedule details
    schedule.scheduleData = scheduleData;
    schedule.startDate = startDate;
    schedule.endDate = endDate;

    await schedule.save();
    res.status(200).json({ message: 'Schedule updated successfully.', schedule });
  } catch (err) {
    console.error('Error updating schedule:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    if (schedule.manager.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this schedule.' });
    }

    await Schedule.deleteOne({ _id: id });
    res.status(200).json({ message: 'Schedule deleted successfully.' });
  } catch (err) {
    console.error('Error deleting schedule:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};