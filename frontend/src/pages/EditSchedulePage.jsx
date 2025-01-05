import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScheduleById } from '../utils/api';
import { toast } from 'react-toastify';
import ScheduleEditor from '../components/Schedules/ScheduleEditor';

const EditSchedulePage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getScheduleById(scheduleId);
        setSchedule(data);
      } catch (error) {
        toast.error('Failed to fetch the schedule.');
        navigate('/schedules'); // Redirects to the schedules list if an error occurs
      } finally {
        setIsLoading(false);
      }
    };

    if (scheduleId) {
      fetchSchedule();
    }
  }, [scheduleId, navigate]);

  const handleBack = () => {
    navigate('/schedules');
  };

  return (
    <div className="p-4">
      <button
        onClick={handleBack}
        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
      >
        Back to Schedules
      </button>
      {isLoading ? (
        <p className="text-gray-500 mt-4">Loading schedule...</p>
      ) : schedule ? (
        <div>
          <h1 className="text-2xl font-bold mt-4 mb-6">{`Edit Schedule: ${schedule.name || 'Unnamed Schedule'}`}</h1>
          <ScheduleEditor schedule={schedule} onBack={handleBack} />
        </div>
      ) : (
        <p className="text-red-500 mt-4">Failed to load the schedule. Please try again.</p>
      )}
    </div>
  );
};

export default EditSchedulePage;