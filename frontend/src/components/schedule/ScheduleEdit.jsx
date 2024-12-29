import React, { useEffect, useRef, useState } from "react";
import {
  ScheduleComponent,
  ResourcesDirective,
  ResourceDirective,
  ViewsDirective,
  ViewDirective,
  Inject,
  TimelineViews,
  TimelineMonth,
  DragAndDrop,
  Resize,
} from "@syncfusion/ej2-react-schedule";
import Breadcrumbs from "../common/Breadcrumbs";
import { toast } from "react-toastify";
import { fetchOperations } from "../../utils/api";
import { predefinedColors } from "../../utils/constants";
import { generateScheduleData } from "../../utils/schedule";

const ScheduleEdit = ({ schedule, setSchedule, employees }) => {
  const scheduleObj = useRef(null);
  const [operationHours, setOperationHours] = useState({
    start: "09:00",
    end: "17:30",
    closedDays: [],
  });

  // Fetch operation hours and initialize schedule data
  useEffect(() => {
    const fetchOperationHours = async () => {
      try {
        const operations = await fetchOperations();
        setOperationHours(operations);
  
        if (employees.length > 0 && schedule.startDate && schedule.endDate) {
          const { scheduleData } = generateScheduleData(
            employees,
            new Date(schedule.startDate),
            new Date(schedule.endDate),
            operations
          );
  
          setSchedule((prev) => ({
            ...prev,
            scheduleData,
          }));
        }
      } catch (err) {
        console.error("Error fetching operation hours:", err.message);
      }
    };
  
    fetchOperationHours();
  }, [employees, schedule.startDate, schedule.endDate, setSchedule]);

  

  // Validate drag-and-drop events
  const onDragStop = (args) => {
    const eventData = args.data;
    const dayName = eventData.StartTime.toLocaleDateString("en-US", { weekday: "short" });
    const employee = employees.find((emp) => emp._id === eventData.EmployeeId);

    // Validate business hours
    if (operationHours[dayName]?.closed) {
      toast.error("Cannot schedule shifts on closed days.");
      args.cancel = true;
      return;
    }

    // Validate employee availability
    const availability = employee.availability.find((slot) => slot.day === dayName);
    if (!availability) {
      toast.warning(`${employee.name} is not available on ${dayName}.`);
      args.cancel = true;
      return;
    }
  };

  return (
    <div>
      <Breadcrumbs
        paths={[
          { label: "Home", to: "/" },
          { label: "Schedules", to: "/schedules" },
          { label: "Edit Schedule" },
        ]}
      />
      <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Edit Schedule</h1>
        <ScheduleComponent
          ref={scheduleObj}
          height="650px"
          eventSettings={{ dataSource: schedule.scheduleData }}
          workHours={{ start: operationHours.start, end: operationHours.end }}
          timeScale={{ enable: true, interval: 60 }}
          selectedDate={new Date(schedule.startDate || Date.now())}
          group={{ enable: true, resources: ["Employees"] }}
          dragStop={onDragStop}
          readonly={false}
        >
          {/* Resource Definitions */}
          <ResourcesDirective>
            <ResourceDirective
              field="EmployeeId"
              title="Employees"
              name="Employees"
              allowMultiple={false}
              dataSource={employees.map((emp, index) => ({
                text: emp.name,
                id: emp._id,
                color: predefinedColors[index % predefinedColors.length],
              }))}
              textField="text"
              idField="id"
              colorField="color"
            />
          </ResourcesDirective>

          {/* Views */}
          <ViewsDirective>
            <ViewDirective option="TimelineDay" />
            <ViewDirective option="TimelineWeek" />
            <ViewDirective option="TimelineMonth" />
          </ViewsDirective>

          <Inject services={[TimelineViews, TimelineMonth, DragAndDrop, Resize]} />
        </ScheduleComponent>
      </div>
    </div>
  );
};

export default ScheduleEdit;