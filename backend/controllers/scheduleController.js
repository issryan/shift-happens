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

        // Loop through each day in the range
        for (let day of businessDays) {
            const shifts = []; // Holds the shifts for the day

            let startTime = businessHours.start; // Start of business hours
            while (startTime < businessHours.end) {
                // Find available employees for the shift
                const availableEmployees = employees.filter((employee) =>
                    employee.availability.includes(`${day} ${startTime}-${startTime + shiftDuration}`)
                );

                // Assign the first available employee
                if (availableEmployees.length) {
                    const assignedEmployee = availableEmployees[0];
                    shifts.push({
                        employee: assignedEmployee.name,
                        shift: `${startTime}:00 - ${startTime + shiftDuration}:00`,
                    });

                    // Update employee hours required
                    assignedEmployee.hoursRequired -= shiftDuration;
                }

                // Increment time for the next shift
                startTime += shiftDuration;
            }

            // Add the day’s shifts to the schedule
            scheduleData.push({
                day,
                shifts,
            });
        }

        // Save the generated schedule
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