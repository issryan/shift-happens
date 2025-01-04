const Schedule = require('../models/Schedule');
const Event = require('../models/Event');
const Operations = require('../models/Operations');

// Generate schedule
exports.generateSchedule = async (req, res) => {
  try {
    const { month, year } = req.body;
    const managerId = req.user.id;

    if (!month || !year) {
      return res.status(400).json({ message: 'Invalid input. Provide month and year.' });
    }

    // Fetch operational hours
    const operations = await Operations.findOne({ userId: managerId });
    if (!operations || !operations.hours) {
      return res.status(400).json({ message: 'Operational hours not configured for this manager.' });
    }

    // Schedule start and end dates
    const scheduleStart = new Date(year, month - 1, 1);
    const scheduleEnd = new Date(year, month, 0);

    // Reference operational hours to validate
    const operationalHours = operations.hours;
    const validDays = Object.entries(operationalHours).filter(([day, hours]) => !hours.closed);

    if (validDays.length === 0) {
      return res.status(400).json({ message: 'All business days are marked as closed.' });
    }

    // Create a new schedule
    const schedule = await Schedule.create({
      manager: managerId,
      startDate: scheduleStart,
      endDate: scheduleEnd,
    });

    console.log('New Schedule Created:', schedule);

    res.status(201).json({ message: 'Schedule created successfully', schedule });
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