export const generateScheduleData = (employees, startDate, endDate) => {
  const getDateForDay = (day, targetDate) => {
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
    const date = new Date(targetDate);
    while (date.getDay() !== dayIndex) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  };

  const availabilityEvents = [];
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    employees.forEach((employee) => {
      const availability = employee.availability.find((a) => a.day === dayName);

      if (availability) {
        const startTime = new Date(date);
        const [startHour, startMinute] = availability.start.split(':').map(Number);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(date);
        const [endHour, endMinute] = availability.end.split(':').map(Number);
        endTime.setHours(endHour, endMinute, 0, 0);

        availabilityEvents.push({
          Id: `${employee._id}-${date.toISOString()}`,
          Subject: 'Work',
          StartTime: startTime,
          EndTime: endTime,
          EmployeeId: employee._id,
          CategoryColor: '#1e90ff',
        });
      }
    });
  }

  return availabilityEvents;
};