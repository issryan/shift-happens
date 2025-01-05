import React from 'react';

const ScheduleGrid = ({ schedules, onDelete, onEdit }) => {
  if (!schedules.length) {
    return <p>No schedules found. Please generate one.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {schedules.map((schedule) => (
        <div
          key={schedule._id}
          className="bg-white shadow-md p-4 rounded border border-gray-300"
        >
          <h2 className="text-lg font-bold">{schedule.name || 'Unnamed Schedule'}</h2>
          <p>
            <span className="font-medium">Start Date:</span>{' '}
            {new Date(schedule.startDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">End Date:</span>{' '}
            {new Date(schedule.endDate).toLocaleDateString()}
          </p>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => onEdit(schedule._id)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(schedule._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleGrid;