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
import { generateScheduleData } from '../../utils/schedule';

const ScheduleEdit = ({ schedule, setSchedule, employees }) => {
  useEffect(() => {
    if (employees && employees.length > 0 && schedule.startDate) {
      // Populate events for the full month
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // End of the month

      const events = generateScheduleData(employees, startDate, endDate);
      setSchedule((prev) => ({
        ...prev,
        scheduleData: events,
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