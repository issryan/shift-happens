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
    return false; // Not available
  }
  return true; // Available
};

// Add or Update Event
exports.addOrUpdateEvent = async (req, res) => {
  try {
    const { scheduleId, employeeId, startTime, endTime, eventId } = req.body;

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

    let event;
    if (eventId) {
      // Update existing event
      event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

      event.startTime = startTime;
      event.endTime = endTime;
      event.employeeId = employeeId;
      event.details = `Updated shift for ${employee.name}`;
    } else {
      // Add new event
      event = new Event({
        scheduleId,
        employeeId,
        startTime,
        endTime,
        details: `New shift for ${employee.name}`,
      });
    }

    await event.save();
    res.status(201).json({ success: true, message: eventId ? 'Event updated successfully' : 'Event created successfully', event });
  } catch (error) {
    console.error('Error adding or updating event:', error.message);
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

exports.autoGenerateEvents = async (req, res) => {
  try {
    const { scheduleId } = req.body;

    // Validate schedule
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    // Fetch operational hours and minimum employees
    const operations = await Operations.findOne({ userId: schedule.manager });
    if (!operations) {
      return res.status(404).json({ success: false, message: 'Operational hours not found' });
    }

    // Fetch all employees for the manager
    const employees = await Employee.find({ manager: schedule.manager });
    if (!employees || employees.length === 0) {
      return res.status(400).json({ success: false, message: 'No employees found for this manager' });
    }

    const events = [];
    const employeeHours = {}; // Track total hours worked for each employee
    employees.forEach((emp) => (employeeHours[emp._id] = 0));

    const operationalHours = operations.hours;
    const minEmployeesPerDay = operations.minEmployeesPerDay;

    // Generate events for each day in the schedule
    for (
      let currentDate = new Date(schedule.startDate);
      currentDate <= new Date(schedule.endDate);
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'short' });
      const dayOps = operationalHours[dayOfWeek];

      if (!dayOps || dayOps.closed) {
        console.log(`Skipped ${dayOfWeek}: Business closed.`);
        continue;
      }

      const requiredEmployees = minEmployeesPerDay[dayOfWeek] || 0;

      let employeesScheduled = 0;
      for (const employee of employees) {
        if (employeesScheduled >= requiredEmployees) break;

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

        if (shiftStart >= shiftEnd) continue; // Skip incompatible hours

        // Calculate shift hours
        const shiftHours = (shiftEnd - shiftStart) / 100;
        if (employee.hoursRequired && employeeHours[employee._id] + shiftHours > employee.hoursRequired) continue;

        // Create event
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
        employeeHours[employee._id] += shiftHours;
        employeesScheduled++;
      }
    }

    // Save events to the database
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