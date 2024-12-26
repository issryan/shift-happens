export const generateScheduleData = (employees, startDate, endDate) => {
  const getDateForDay = (day, weekStartDate) => {
    const dayMap = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const dayIndex = dayMap[day];
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + dayIndex - date.getDay());
    return date;
  };

  const availabilityEvents = employees.flatMap((employee) => {
    if (!employee.availability || employee.availability.length === 0) {
      console.warn(`Employee ${employee.name} has no availability`);
      return [];
    }

    return employee.availability.flatMap((availability) => {
      const date = getDateForDay(availability.day, startDate);
      const endOfMonth = new Date(endDate);

      const events = [];
      while (date <= endOfMonth) {
        // Skip closed days
        const startTime = new Date(date);
        const [startHour, startMinute] = availability.start.split(':').map(Number);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(date);
        const [endHour, endMinute] = availability.end.split(':').map(Number);
        endTime.setHours(endHour, endMinute, 0, 0);

        events.push({
          Id: `${employee._id}-${date.toISOString()}`,
          Subject: employee.name.split(' ')[0], // Use the employee's first name
          StartTime: new Date(startTime),
          EndTime: new Date(endTime),
          EmployeeId: employee._id,
          CategoryColor: '#1e90ff', // Default color
        });

        // Move to the next week
        date.setDate(date.getDate() + 7);
      }

      return events;
    });
  });

  return availabilityEvents;
};