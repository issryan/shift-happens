import React, { useEffect } from 'react';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Week,
  Month,
  Inject,
  ResourcesDirective,
  ResourceDirective,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule';

const ScheduleEdit = ({ schedule, setSchedule, employees }) => {

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

  useEffect(() => {
    console.log('Employees:', employees);
    if (employees && employees.length > 0) {
      const weekStartDate = schedule.startDate || new Date(); // Use the selected week or current date
      const availabilityEvents = employees.flatMap((employee) => {
        if (!employee.availability || employee.availability.length === 0) {
          console.warn(`Employee ${employee.name} has no availability`);
          return []; // Skip if no availability
        }

        return employee.availability.map((availability, index) => {
          const date = getDateForDay(availability.day, weekStartDate);

          // Create StartTime and EndTime
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

      console.log('Generated Events:', availabilityEvents);

      setSchedule((prev) => ({
        ...prev,
        scheduleData: availabilityEvents,
      }));
    }
  }, [employees, schedule.startDate, setSchedule]);

  return (
    <ScheduleComponent
      height="650px"
      eventSettings={{ dataSource: schedule.scheduleData }}
      workHours={{ start: '09:00', end: '17:30' }}
      timeScale={{ enable: true, interval: 60 }}
      selectedDate={new Date(schedule.startDate || Date.now())}
    >
      <ResourcesDirective>
        <ResourceDirective
          field="EmployeeId"
          title="Employees"
          name="Employees"
          allowMultiple={false}
          dataSource={employees.map((emp) => ({
            text: emp.name,
            id: emp._id, 
            color: '#1e90ff',
          }))}
          textField="text"
          idField="id"
          colorField="color"
        />
      </ResourcesDirective>
      <ViewsDirective>
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
      </ViewsDirective>
      <Inject services={[Week, Month, DragAndDrop]} />
    </ScheduleComponent>
  );
};

export default ScheduleEdit;