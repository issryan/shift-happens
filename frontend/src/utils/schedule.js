export const generateScheduleData = (employees, startDate, endDate, operations) => {
  const scheduleData = [];

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });

    // Skip closed days
    if (operations[dayName]?.closed) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Assign employees to shifts
    employees.forEach((employee) => {
      const availability = employee.availability.find((slot) => slot.day === dayName);
      if (availability) {
        const startTime = new Date(currentDate);
        const endTime = new Date(currentDate);

        const [startHour, startMinute] = availability.start.split(":").map(Number);
        const [endHour, endMinute] = availability.end.split(":").map(Number);

        startTime.setHours(startHour, startMinute, 0, 0);
        endTime.setHours(endHour, endMinute, 0, 0);

        scheduleData.push({
          EmployeeId: employee._id,
          Subject: employee.name,
          StartTime: startTime,
          EndTime: endTime,
          CategoryColor: "#1e90ff", // Default color
        });
      }
    });

    currentDate.setDate(currentDate.getDate() + 1); // Move to next day
  }

  return { scheduleData };
};