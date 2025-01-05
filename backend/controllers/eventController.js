const Event = require('../models/Event');
const Employee = require('../models/Employee');
const Schedule = require('../models/Schedule');
const Operations = require('../models/Operations');

// Utility to validate employee availability
const validateAvailability = (employee, startTime, endTime) => {
  const dayOfWeek = new Date(startTime).toLocaleString('en-US', { weekday: 'short' });
  const availability = employee.availability.find((a) => a.day === dayOfWeek);

  if (
    !availability ||
    new Date(startTime).getHours() < parseInt(availability.start.split(':')[0]) ||
    new Date(endTime).getHours() > parseInt(availability.end.split(':')[0])
  ) {
    return false;
  }
  return true;
};

// Utility to validate operational hours
const validateOperationalHours = (startTime, endTime, hours) => {
  const dayOfWeek = new Date(startTime).toLocaleString('en-US', { weekday: 'short' });
  const dayOps = hours.find((day) => day.day === dayOfWeek);

  if (!dayOps || dayOps.closed) {
    return false;
  }

  const shiftStart = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const shiftEnd = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

  const opsStart = parseInt(dayOps.start.split(':')[0]) * 60 + parseInt(dayOps.start.split(':')[1]);
  const opsEnd = parseInt(dayOps.end.split(':')[0]) * 60 + parseInt(dayOps.end.split(':')[1]);

  return shiftStart >= opsStart && shiftEnd <= opsEnd;
};

// Add Event
exports.addEvent = async (req, res) => {
  try {
    const { scheduleId, employeeId, startTime, endTime } = req.body;

    // Check for required fields
    if (!scheduleId || !employeeId || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate schedule
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    // Validate employee
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Validate operational hours
    const operations = await Operations.findOne({ userId: schedule.manager });
    if (!operations) return res.status(404).json({ success: false, message: 'Operational hours not found' });

    if (!validateOperationalHours(startTime, endTime, operations.hours)) {
      return res.status(400).json({ success: false, message: 'Shift falls outside business hours' });
    }

    // Validate employee availability
    if (!validateAvailability(employee, startTime, endTime)) {
      return res.status(400).json({ success: false, message: 'Shift timing conflicts with employee availability' });
    }

    // Add new event
    const event = new Event({
      scheduleId,
      employeeId,
      startTime,
      endTime,
      details: `New shift for ${employee.name}`,
    });

    await event.save();
    res.status(201).json({ success: true, message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error in addEvent:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

//Update event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId, startTime, endTime } = req.body;

    // Check for required fields
    if (!eventId || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Validate schedule
    const schedule = await Schedule.findById(event.scheduleId);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    // Validate employee
    const employee = await Employee.findById(event.employeeId);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

    // Validate operational hours
    const operations = await Operations.findOne({ userId: schedule.manager });
    if (!operations) return res.status(404).json({ success: false, message: 'Operational hours not found' });

    if (!validateOperationalHours(startTime, endTime, operations.hours)) {
      return res.status(400).json({ success: false, message: 'Shift falls outside business hours' });
    }

    // Validate employee availability
    if (!validateAvailability(employee, startTime, endTime)) {
      return res.status(400).json({ success: false, message: 'Shift timing conflicts with employee availability' });
    }

    // Update event
    event.startTime = startTime;
    event.endTime = endTime;
    event.details = `Updated shift for ${employee.name}`;

    await event.save();
    res.status(200).json({ success: true, message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error in updateEvent:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    await event.delete();
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error(`Error deleting event ${req.params.id}:`, error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Auto-Generate Events
exports.autoGenerateEvents = async (req, res) => {
  try {
    const { scheduleId } = req.body;

    // Validate schedule
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ success: false, message: 'Schedule not found' });

    // Fetch operational hours
    const operations = await Operations.findOne({ userId: schedule.manager });
    if (!operations) return res.status(404).json({ success: false, message: 'Operational hours not found' });

    const employees = await Employee.find({ manager: schedule.manager });
    if (!employees || employees.length === 0) return res.status(400).json({ success: false, message: 'No employees found for this manager' });

    const events = [];
    const weeklyHours = {}; // Track weekly hours for each employee

    for (const employee of employees) {
      weeklyHours[employee._id] = {};
    }

    for (
      let currentDate = new Date(schedule.startDate);
      currentDate <= new Date(schedule.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'short' });
      const dayOps = operations.hours.find((day) => day.day === dayOfWeek);

      if (!dayOps || dayOps.closed) continue;

      const requiredEmployees = operations.minEmployeesPerDay[dayOfWeek] || 0;
      let employeesScheduled = 0;

      for (const employee of employees) {
        const availability = employee.availability.find((a) => a.day === dayOfWeek);
        if (!availability) continue;

        const shiftStart = Math.max(
          parseInt(dayOps.start.replace(':', ''), 10),
          parseInt(availability.start.replace(':', ''), 10)
        );
        const shiftEnd = Math.min(
          parseInt(dayOps.end.replace(':', ''), 10),
          parseInt(availability.end.replace(':', ''), 10)
        );

        if (shiftStart >= shiftEnd) continue;

        const shiftHours = (shiftEnd - shiftStart) / 100;
        const currentWeek = `${currentDate.getFullYear()}-W${Math.ceil((currentDate.getDate() - currentDate.getDay() + 1) / 7)}`;
        if (!weeklyHours[employee._id][currentWeek]) {
          weeklyHours[employee._id][currentWeek] = 0;
        }

        if (employee.hoursRequired && weeklyHours[employee._id][currentWeek] + shiftHours > employee.hoursRequired) {
          continue;
        }

        const event = new Event({
          scheduleId,
          employeeId: employee._id,
          startTime: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            Math.floor(shiftStart / 100),
            shiftStart % 100
          ),
          endTime: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            Math.floor(shiftEnd / 100),
            shiftEnd % 100
          ),
          details: `Auto-scheduled shift for ${employee.name}`,
        });

        events.push(event);
        weeklyHours[employee._id][currentWeek] += shiftHours;
        employeesScheduled++;

        if (employeesScheduled >= requiredEmployees) break;
      }
    }

    if (events.length > 0) {
      await Event.insertMany(events);
      res.status(201).json({ success: true, message: 'Events auto-generated successfully', events });
    } else {
      res.status(400).json({ success: false, message: 'No valid events could be generated' });
    }
  } catch (error) {
    console.error('Error auto-generating events:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};