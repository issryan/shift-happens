const Event = require('../models/Event');
const Employee = require('../models/Employee');
const Schedule = require('../models/Schedule');

// Utility to validate employee availability
const validateAvailability = (employee, startTime, endTime) => {
  const day = new Date(startTime).getDay();
  const availability = employee.availability.find((a) => a.day === day);

  if (
    !availability ||
    new Date(startTime).getHours() < parseInt(availability.start) ||
    new Date(endTime).getHours() > parseInt(availability.end)
  ) {
    return false; // Not available
  }
  return true; // Available
};

// Get events for a schedule
exports.getEventsBySchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const events = await Event.find({ scheduleId }).lean();
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error(`Error fetching events for schedule ${req.params.scheduleId}:`, error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, details } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (details) event.details = details;

    await event.save();
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error(`Error updating event ${req.params.id}:`, error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete multiple events
exports.deleteMultipleEvents = async (req, res) => {
  try {
    const { eventIds } = req.body;

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No event IDs provided' });
    }

    await Event.deleteMany({ _id: { $in: eventIds } });
    res.status(200).json({ success: true, message: 'Events deleted successfully' });
  } catch (error) {
    console.error('Error deleting events:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* -------------------------------- Drag and drop -------------------------------- */

// Move a shift
exports.moveShift = async (req, res) => {
  try {
    const { shiftId, newStartTime, newEndTime, newEmployeeId } = req.body;

    const shift = await Event.findById(shiftId);
    if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });

    const employee = await Employee.findById(newEmployeeId || shift.employeeId);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    if (!validateAvailability(employee, newStartTime, newEndTime)) {
      return res.status(400).json({
        success: false,
        message: 'Shift timing conflicts with employee availability',
      });
    }

    shift.startTime = newStartTime;
    shift.endTime = newEndTime;
    if (newEmployeeId) shift.employeeId = newEmployeeId;

    await shift.save();
    res.status(200).json({ success: true, message: 'Shift moved successfully', shift });
  } catch (error) {
    console.error('Error moving shift:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a shift
exports.addShift = async (req, res) => {
  try {
    const { scheduleId, employeeId, startTime, endTime } = req.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    if (!validateAvailability(employee, startTime, endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Shift timing conflicts with employee availability',
      });
    }

    const shift = new Event({
      scheduleId,
      employeeId,
      startTime,
      endTime,
      details: `Shift for ${employee.name}`,
    });

    await shift.save();
    res.status(201).json({ success: true, message: 'Shift added successfully', shift });
  } catch (error) {
    console.error('Error adding shift:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a shift
exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;

    const shift = await Event.findById(id);
    if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });

    await shift.delete();
    res.status(200).json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    console.error(`Error deleting shift ${req.params.id}:`, error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};