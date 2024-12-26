import React from 'react';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  Month,
  DragAndDrop,
  Inject,
} from '@syncfusion/ej2-react-schedule';

const ScheduleEdit = ({ schedule, setSchedule }) => {
  const onEventRendered = (args) => {
    args.element.style.backgroundColor = args.data.CategoryColor || '#4caf50';
  };

  const onActionComplete = (args) => {
    if (['eventCreated', 'eventChanged', 'eventRemoved'].includes(args.requestType)) {
      const updatedRecords = args.addedRecords || args.changedRecords || [];
      if (updatedRecords.length > 0) {
        setSchedule((prev) => ({
          ...prev,
          scheduleData: [
            ...prev.scheduleData.filter((event) => !updatedRecords.find((updated) => updated.Id === event.Id)),
            ...updatedRecords,
          ],
        }));
      }
    }
  };

  const onActionBegin = (args) => {
    if (['eventCreate', 'eventChange'].includes(args.requestType)) {
      const { StartTime, EndTime } = args.data[0];
      const businessStart = new Date().setHours(8, 0, 0, 0);
      const businessEnd = new Date().setHours(20, 0, 0, 0);

      if (StartTime < businessStart || EndTime > businessEnd) {
        args.cancel = true;
        alert('Cannot schedule events outside of business hours.');
      }
    }
  };

  return (
    <ScheduleComponent
      height="650px"
      eventSettings={{ dataSource: schedule.scheduleData }}
      actionBegin={onActionBegin}
      actionComplete={onActionComplete}
      eventRendered={onEventRendered}
      workHours={{ highlight: true, start: '08:00', end: '20:00' }}
      timeScale={{ enable: true, interval: 60 }}
      selectedDate={new Date(schedule.startDate || Date.now())}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
        <ViewDirective option="Month" />
      </ViewsDirective>
      <Inject services={[Day, Week, Month, DragAndDrop]} />
    </ScheduleComponent>
  );
};

export default ScheduleEdit;