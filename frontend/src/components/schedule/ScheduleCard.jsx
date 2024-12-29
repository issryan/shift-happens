import React from 'react';
import {FaTrash, FaFileExport, FaEye } from 'react-icons/fa';

const ScheduleCard = ({ schedule, onEdit, onDelete, onExport, onView }) => (
  <div className="relative p-4 border rounded shadow flex flex-col justify-between group hover:bg-gray-100 transition duration-300">
    {/* Schedule Info */}
    <div>
      <h2 className="text-lg font-semibold mb-2">
        {`Schedule: ${new Date(schedule.startDate).toLocaleString('default', { month: 'long' })} ${new Date(schedule.startDate).getFullYear()}`}
      </h2>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => onView(schedule._id)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <FaEye />
        View
      </button>
      <button
        onClick={() => onExport(schedule._id)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
      >
        <FaFileExport />
        Export
      </button>
      <button
        onClick={() => onDelete(schedule._id)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
      >
        <FaTrash />
        Delete
      </button>
    </div>
  </div>
);

export default ScheduleCard;