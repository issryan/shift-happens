import React from 'react';

const ScheduleCard = ({ schedule, onEdit, onDelete }) => (
  <div className="p-4 border rounded shadow flex flex-col justify-between">
    <h2 className="text-lg font-semibold">{`Schedule: ${schedule.startDate} - ${schedule.endDate}`}</h2>
    <div className="mt-2 flex justify-between">
      <button
        onClick={onEdit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </div>
);

export default ScheduleCard;