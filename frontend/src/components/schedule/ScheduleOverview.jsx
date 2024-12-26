import React, { useEffect, useState } from 'react';
import { getSchedules, deleteSchedule } from '../../utils/api';
import ScheduleCard from './ScheduleCard';
import { useNavigate } from 'react-router-dom';

const ScheduleOverview = () => {
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await getSchedules();
                setSchedules(data);
            } catch (err) {
                console.error('Error fetching schedules:', err.message);
            }
        };

        fetchSchedules();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                await deleteSchedule(id);
                setSchedules(schedules.filter((schedule) => schedule._id !== id));
            } catch (err) {
                console.error('Error deleting schedule:', err.message);
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Your Schedules</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.length === 0 ? (
                    <p>No schedules found. Click the button to create a new one!</p>
                ) : (
                    schedules.map((schedule) => (
                        <ScheduleCard
                            key={schedule._id}
                            schedule={schedule}
                            onEdit={() => navigate(`/schedule/edit/${schedule._id}`)}
                            onDelete={() => handleDelete(schedule._id)}
                        />
                    ))
                )}
            </div>
            <div
                className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100 flex items-center justify-center"
                onClick={() => navigate('/schedule/edit/new')}
            >
                <span className="text-xl text-gray-600">+ Create New Schedule</span>
            </div>
        </div>
    );
};

export default ScheduleOverview;