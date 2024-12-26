export const generateScheduleData = (employees, startDate) => {
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
  
      return employee.availability.map((availability, index) => {
        const date = getDateForDay(availability.day, startDate);
  
        const startTime = new Date(date);
        const [startHour, startMinute] = availability.start.split(':').map(Number);
        startTime.setHours(startHour, startMinute, 0, 0);
  
        const endTime = new Date(date);
        const [endHour, endMinute] = availability.end.split(':').map(Number);
        endTime.setHours(endHour, endMinute, 0, 0);
  
        return {
          Id: `${employee._id}-${index}`,
          Subject: 'Work',
          StartTime: startTime,
          EndTime: endTime,
          EmployeeId: employee._id,
          CategoryColor: '#1e90ff',
        };
      });
    });
  
    return availabilityEvents;
  };