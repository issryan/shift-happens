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

  const handleMonthSelect = async ({ month, year }) => {
    const businessHours = {
      Mon: { start: "09:00", end: "17:00", closed: false },
      Tue: { start: "09:00", end: "17:00", closed: false },
      Wed: { start: "09:00", end: "17:00", closed: false },
      Thu: { start: "09:00", end: "17:00", closed: false },
      Fri: { start: "09:00", end: "17:00", closed: false },
      Sat: { closed: true },
      Sun: { closed: true },
    };
  
    try {
      await generateSchedule({ month, year, businessHours });
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
      <div
        onClick={() => setShowModal(true)}
        className="flex justify-center items-center bg-gray-200 rounded-lg h-32 cursor-pointer hover:bg-gray-300"
      >
        <span className="text-4xl text-gray-600">+</span>
      </div>
      <MonthPickerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleMonthSelect}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
    </div>
  );
};

export default ScheduleOverview;