const Schedule = require('../models/Schedule');
const Employee = require('../models/Employee');

// Generate a schedule
exports.generateSchedule = async (req, res) => {
    try {
      const { startDate, endDate, businessHours, shiftDuration } = req.body;
  
      // Fetch employees for the logged-in manager
      const employees = await Employee.find({ manager: req.user.id });
  
      if (!employees.length) {
        return res.status(400).json({ message: 'No employees found for this manager.' });
      }
  
      // Initialize the schedule
      const scheduleData = [];
      const businessDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
      // Loop through each business day
      for (let day of businessDays) {
        const shifts = [];
  
        let startTime = businessHours.start;
        while (startTime < businessHours.end) {
          const timeSlot = `${startTime}:00 - ${startTime + shiftDuration}:00`;
  
          // Match employees based on availability
          const availableEmployees = employees.filter((employee) =>
            employee.availability.includes(`${day} ${timeSlot}`)
          );
  
          if (availableEmployees.length > 0) {
            const assignedEmployee = availableEmployees[0]; // Assign the first available employee
            shifts.push({
              employee: assignedEmployee.name,
              timeSlot,
            });
  
            // Deduct hours from employee's required hours
            assignedEmployee.hoursRequired -= shiftDuration;
  
            // Remove employee if they’ve fulfilled their required hours
            if (assignedEmployee.hoursRequired <= 0) {
              employees.splice(employees.indexOf(assignedEmployee), 1);
            }
          }
  
          // Increment time for the next shift
          startTime += shiftDuration;
        }
  
        scheduleData.push({
          day,
          shifts,
        });
      }
  
      const newSchedule = new Schedule({
        manager: req.user.id,
        scheduleData,
        startDate,
        endDate,
      });
  
      await newSchedule.save();
      res.status(201).json(newSchedule);
    } catch (err) {
      console.error('Error generating schedule:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get all schedules for a manager
exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find({ manager: req.user.id });
        res.status(200).json(schedules);
    } catch (err) {
        console.error('Error fetching schedules:', err.message);
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