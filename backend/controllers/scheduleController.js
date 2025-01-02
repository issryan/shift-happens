const Schedule = require('../models/Schedule');
const Event = require('../models/Event');
const Employee = require('../models/Employee');
const Operations = require('../models/Operations');

// Generate schedule
exports.generateSchedule = async (req, res) => {
  try {
    const { month, year } = req.body;
    const managerId = req.user.id;

    // Check if manager already has 3 active schedules
    const activeSchedules = await Schedule.countDocuments({ manager: managerId });
    if (activeSchedules >= 3) {
      return res.status(400).json({ message: 'Limit of 3 active schedules reached. Delete old schedules to create new ones.' });
    }

    // Check for employees and operations
    const employees = await Employee.find({ manager: managerId });
    const operations = await Operations.findOne({ manager: managerId });

    if (!operations) {
      return res.status(400).json({ message: 'Operational data not found. Please configure your business operations.' });
    }

    if (employees.length === 0) {
      return res.status(400).json({ message: 'No employees found. Add employees before generating a schedule.' });
    }

    // Create schedule
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const schedule = new Schedule({ manager: managerId, startDate, endDate });
    await schedule.save();

    // Generate events
    const events = employees.flatMap((employee) => {
      return operations.hours.flatMap((operationDay, day) => {
        const availability = employee.availability.find((a) => a.day === day);

        if (operationDay.closed || !availability) return []; // Skip closed or unavailable days

        const shiftStart = Math.max(
          parseInt(operationDay.start.replace(':', ''), 10),
          parseInt(availability.start.replace(':', ''), 10)
        );

        const shiftEnd = Math.min(
          parseInt(operationDay.end.replace(':', ''), 10),
          parseInt(availability.end.replace(':', ''), 10)
        );

        if (shiftStart >= shiftEnd) return []; // Invalid shift timing

        return [{
          employeeId: employee._id,
          details: `Shift for ${employee.name}`,
          startTime: new Date(startDate.getFullYear(), startDate.getMonth(), operationDay.dayOfMonth, Math.floor(shiftStart / 100), shiftStart % 100),
          endTime: new Date(startDate.getFullYear(), startDate.getMonth(), operationDay.dayOfMonth, Math.floor(shiftEnd / 100), shiftEnd % 100),
        }];
      });
    });

    await Event.insertMany(events.map((event) => ({ ...event, scheduleId: schedule._id })));

    res.status(201).json({ schedule });
  } catch (error) {
    console.error('Error generating schedule:', error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Get all schedules for a manager
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ manager: req.user.id });
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);

    if (!schedule || schedule.manager.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Schedule not found or not authorized' });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);

    if (!schedule || schedule.manager.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Schedule not found or not authorized' });
    }

    // Cascade delete: Remove associated events
    await Event.deleteMany({ scheduleId: id });

    // Delete the schedule
    await schedule.delete();

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function: Auto-generate shifts
exports.autoSchedule = async (req, res) => {
  const { startDate, endDate, businessHours } = req.body;

  try {
    // Validate input
    if (!startDate || !endDate || !businessHours) {
      return res.status(400).json({ message: 'Invalid input. Ensure startDate, endDate, and businessHours are provided.' });
    }

    const employees = await Employee.find({}); // Fetch all employees
    if (!employees || employees.length === 0) {
      return res.status(400).json({ message: 'No employees found. Add employees before generating a schedule.' });
    }

    const shifts = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const dayOfWeek = currentDate.getDay(); // Get day of the week (0-6)

      const dailyHours = businessHours[dayOfWeek]; // Fetch hours for the current day
      if (!dailyHours || dailyHours.closed) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      employees.forEach((employee) => {
        const availability = employee.availability.find((a) => a.day === dayOfWeek);
        if (availability) {
          const shiftStart = Math.max(
            parseInt(dailyHours.start.replace(':', ''), 10),
            parseInt(availability.start.replace(':', ''), 10)
          );

          const shiftEnd = Math.min(
            parseInt(dailyHours.end.replace(':', ''), 10),
            parseInt(availability.end.replace(':', ''), 10)
          );

          if (shiftStart < shiftEnd) {
            shifts.push({
              date: new Date(currentDate),
              startTime: shiftStart,
              endTime: shiftEnd,
              employee: employee._id,
            });
          } else {
            console.log(`Skipped shift for ${employee.name}: Incompatible hours.`);
          }
        }
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (shifts.length === 0) {
      return res.status(400).json({ message: 'No valid shifts could be generated with the given constraints.' });
    }

    // Save the generated schedule and shifts
    const schedule = await Schedule.create({
      manager: req.user.id,
      startDate,
      endDate,
      shifts,
    });

    res.status(201).json({
      message: 'Schedule generated successfully',
      schedule,
      totalShifts: shifts.length,
    });
  } catch (error) {
    console.error('Error generating schedule:', error.message);
    res.status(500).json({ message: 'Error generating schedule', error });
  }
};

// Helper function: Conflict detection
exports.checkConflicts = async (req, res) => {
  const { employeeId, date, startTime, endTime } = req.body;

  try {
    const events = await Event.find({
      employee: employeeId,
      date: new Date(date),
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    });

    if (events.length > 0) {
      return res.status(409).json({
        message: 'Conflict detected',
        conflicts: events.map((event) => ({
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          employee: event.employee,
        })),
      });
    }

    return res.status(200).json({ message: 'No conflicts detected' });
  } catch (error) {
    console.error('Error checking conflicts:', error.message);
    return res.status(500).json({ message: 'Error checking conflicts', error });
  }
};