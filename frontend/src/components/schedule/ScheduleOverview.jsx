import React, { useState, useEffect } from 'react';
import MonthPickerModal from './MonthPickerModal';
import { generateSchedule, getSchedules, deleteSchedule } from '../../utils/api';
import ScheduleCard from './ScheduleCard';

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
      alert('You can only have a maximum of 3 schedules at a time. Please delete an existing schedule to create a new one.');
      return;
    }

    try {
      await generateSchedule({ month });
      alert('Schedule created successfully!');
      fetchSchedules();
      setShowModal(false);
    } catch (err) {
      console.error('Error creating schedule:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      alert('Schedule deleted successfully!');
      fetchSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err.message);
    }
  };

  const handleView = (id) => {
    window.location.href = `/schedule/${id}`; // Navigate to the view/edit page
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className={`bg-green-500 text-white px-4 py-2 rounded ${schedules.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
        disabled={schedules.length >= 3}
      >
        Create New Schedule
      </button>
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