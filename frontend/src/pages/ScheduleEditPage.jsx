import React, { useEffect, useState } from 'react';
import { getScheduleById, getEmployees, updateSchedule, generateSchedule } from '../utils/api';
import ScheduleEdit from '../components/schedule/ScheduleEdit';
import { useNavigate, useParams } from 'react-router-dom';

const ScheduleEditPage = ({ isNew }) => {
  const [schedule, setSchedule] = useState({
    scheduleData: [],
    startDate: '',
    endDate: '',
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await getEmployees();
        setEmployees(employeeData);

        if (!isNew) {
          const scheduleData = await getScheduleById(id);
          setSchedule(scheduleData);
        }
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew]);

  const handleSave = async () => {
    try {
      if (isNew) {
        await generateSchedule(schedule);
      } else {
        await updateSchedule(id, schedule);
      }
      navigate('/schedule');
    } catch (err) {
      console.error('Error saving schedule:', err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{isNew ? 'Create Schedule' : 'Edit Schedule'}</h1>
      <ScheduleEdit schedule={schedule} setSchedule={setSchedule} employees={employees} />
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => navigate('/schedule')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleEditPage;