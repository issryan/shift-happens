import React, { useState, useEffect } from "react";
import MonthPickerModal from "./MonthPickerModal";
import { generateSchedule, getSchedules, deleteSchedule } from "../../utils/api";
import ScheduleCard from "./ScheduleCard";
import Breadcrumbs from "../common/Breadcrumbs";

const ScheduleOverview = () => {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const data = await getSchedules();
    setSchedules(data);
  };

  const handleMonthSelect = async (month) => {
    if (schedules.length >= 3) {
      alert("You can only have a maximum of 3 schedules at a time. Please delete an existing schedule to create a new one.");
      return;
    }

    const businessHours = {
      Mon: { start: '09:00', end: '17:00', closed: false },
      Tue: { start: '09:00', end: '17:00', closed: false },
      Wed: { start: '09:00', end: '17:00', closed: false },
      Thu: { start: '09:00', end: '17:00', closed: false },
      Fri: { start: '09:00', end: '17:00', closed: false },
      Sat: { closed: true },
      Sun: { closed: true },
    };

    try {
      await generateSchedule({ month, businessHours });
      alert("Schedule created successfully!");
      fetchSchedules();
      setShowModal(false);
    } catch (err) {
      console.error("Error creating schedule:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      alert("Schedule deleted successfully!");
      fetchSchedules();
    } catch (err) {
      console.error("Error deleting schedule:", err.message);
    }
  };

  const handleView = (id) => {
    window.location.href = `/schedule/${id}`; // Navigate to the view/edit page
  };

  return (
    <div>
      <Breadcrumbs paths={[{ label: "Home", to: "/" }, { label: "Schedules" }]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div
          onClick={() => setShowModal(true)}
          className="cursor-pointer flex justify-center items-center border-dashed border-2 border-gray-400 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-600 transition p-4"
        >
          <span className="text-2xl">+</span>
        </div>
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule._id}
            schedule={schedule}
            onEdit={() => handleView(schedule._id)}
            onDelete={() => handleDelete(schedule._id)}
            onExport={(id) => console.log(`Exporting schedule with ID: ${id}`)}
            onView={handleView}
          />
        ))}
      </div>
      <MonthPickerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleMonthSelect}
      />
    </div>
  );
};

export default ScheduleOverview;