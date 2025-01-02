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
        toast.error('Failed to load the schedule.');
      } finally {
        setIsLoading(false);
      }
    };

    if (scheduleId) {
      fetchSchedule();
    } else {
      toast.error('No schedule selected.');
      navigate('/schedules');
    }
  }, [scheduleId, navigate]);

  const handleBack = () => {
    navigate('/schedules');
  };

  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 underline">
        Back to Schedules
      </button>
      {isLoading ? (
        <p className="text-gray-500">Loading schedule...</p>
      ) : schedule ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{`Edit Schedule: ${schedule.name}`}</h1>
          <ScheduleEditor scheduleId={scheduleId} onBack={handleBack} />
        </div>
      ) : (
        <p className="text-red-500">Failed to load the schedule. Please try again.</p>
      )}
    </div>
  );
};

export default EditSchedulePage;