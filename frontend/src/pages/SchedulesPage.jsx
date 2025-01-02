import React, { useState, useEffect } from 'react';
import { getSchedules, generateSchedule } from '../utils/api';
import { toast } from 'react-toastify';
import ScheduleGrid from '../components/Schedules/ScheduleGrid';
import { useNavigate } from 'react-router-dom';

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await getSchedules();
        setSchedules(data);
      } catch (error) {
        toast.error('Failed to fetch schedules.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, []);

  const handleCreateSchedule = async () => {
    setCreating(true);
    try {
      const newSchedule = await generateSchedule({
        name: `New Schedule - ${new Date().toLocaleDateString()}`,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setSchedules([...schedules, newSchedule]);
      toast.success('Schedule created successfully!');
    } catch (error) {
      toast.error('Failed to create schedule.');
    } finally {
      setCreating(false);
    }
  };

  const handleEditSchedule = (scheduleId) => {
    navigate(`/schedules/${scheduleId}/edit`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Schedules</h1>
      <button
        onClick={handleCreateSchedule}
        disabled={creating}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow mb-4"
      >
        {creating ? 'Creating...' : 'Create New Schedule'}
      </button>
      {isLoading ? (
        <p className="text-gray-500">Loading schedules...</p>
      ) : schedules.length > 0 ? (
        <ScheduleGrid schedules={schedules} onEdit={handleEditSchedule} />
      ) : (
        <p className="text-gray-500">No schedules available. Create one to get started!</p>
      )}
    </div>
  );
};

export default SchedulesPage;