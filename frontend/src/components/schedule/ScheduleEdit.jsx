import React, { useEffect, useState } from 'react';
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
import { generateScheduleData } from '../../utils/schedule';
import { fetchOperations } from '../../utils/api';

const ScheduleEdit = ({ schedule, setSchedule, employees }) => {
  const [operationHours, setOperationHours] = useState({
    start: '09:00',
    end: '17:30',
    closedDays: [],
  });

  const predefinedColors = [
    '#1e90ff', // Light Blue
    '#ff6347', // Tomato
    '#32cd32', // Lime Green
    '#ffa500', // Orange
    '#6a5acd', // Slate Blue
  ];

  // Fetch operation hours
  useEffect(() => {
    const fetchOperationHours = async () => {
      try {
        const operations = await fetchOperations(); 
        const businessDays = Object.keys(operations).filter(
          (day) => !operations[day].closed
        );
        setOperationHours({
          start: operations[businessDays[0]].start,
          end: operations[businessDays[0]].end,
          closedDays: Object.keys(operations)
            .filter((day) => operations[day].closed)
            .map((day) => day.substring(0, 3)), // Get short form like "Mon"
        });
      } catch (err) {
        console.error('Error fetching operation hours:', err.message);
      }
    };

    fetchOperationHours();
  }, []);

  useEffect(() => {
    if (employees && employees.length > 0 && schedule.startDate) {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      const events = generateScheduleData(employees, startDate, endDate);
      setSchedule((prev) => ({
        ...prev,
        scheduleData: events,
      }));
    }
  }, [employees, schedule.startDate, setSchedule]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Schedule</h1>
      <ScheduleComponent
        height="650px"
        eventSettings={{ dataSource: schedule.scheduleData }}
        workHours={{ start: operationHours.start, end: operationHours.end }}
        timeScale={{ enable: true, interval: 60 }}
        selectedDate={new Date(schedule.startDate || Date.now())}
        showWeekend={true} // Show weekends even if they are closed
        readonly={false} // Enable editing
      >
        <ResourcesDirective>
          <ResourceDirective
            field="EmployeeId"
            title="Employees"
            name="Employees"
            allowMultiple={false}
            dataSource={employees.map((emp, index) => ({
              text: emp.name,
              id: emp._id,
              color: predefinedColors[index % predefinedColors.length], // Cycle through predefined colors
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
    </div>
  );
};

export default ScheduleEdit;