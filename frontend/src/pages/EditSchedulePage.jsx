import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScheduleById } from '../utils/api';
import { toast } from 'react-toastify';
import ScheduleEditor from '../components/Schedules/ScheduleEditor';

const EditSchedulePage = () => {
  const { id: scheduleId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        console.log("Fetching schedule with ID:", scheduleId);
        const data = await getScheduleById(scheduleId);
        console.log("Fetched schedule data:", data);
        setSchedule(data);
      } catch (error) {
        toast.error("Failed to load the schedule.");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (scheduleId) {
      fetchSchedule();
    } else {
      toast.error("No schedule selected.");
      navigate("/schedule");
    }
  }, [scheduleId, navigate]);

  const handleBack = () => {
    navigate('/schedule');
  };

  return (
    <div className="p-4">
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