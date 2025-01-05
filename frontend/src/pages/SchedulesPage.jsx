import React, { useEffect, useState } from 'react';
import { generateSchedule, getSchedules, deleteSchedule } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ScheduleGrid from '../components/Schedules/ScheduleGrid';

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getSchedules();
        setSchedules(data);
      } catch (error) {
        toast.error('Failed to fetch schedules.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleGenerateSchedule = async () => {
    try {
      const schedule = await generateSchedule(); // Assumes default generation parameters
      setSchedules((prev) => [...prev, schedule]);
      toast.success('Schedule generated successfully!');
    } catch (error) {
      toast.error('Failed to generate schedule.');
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((schedule) => schedule._id !== id));
      toast.success('Schedule deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete schedule.');
    }
  };

  const handleEditSchedule = (id) => {
    navigate(`/schedule/edit${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Schedules</h1>
      <button
        onClick={handleGenerateSchedule}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Generate Schedule
      </button>
      {isLoading ? (
        <p>Loading schedules...</p>
      ) : (
        <ScheduleGrid
          schedules={schedules}
          onDelete={handleDeleteSchedule}
          onEdit={handleEditSchedule}
        />
      )}
    </div>
  );
};

export default SchedulesPage;