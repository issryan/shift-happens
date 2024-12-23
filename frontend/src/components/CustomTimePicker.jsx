import React from 'react';

const CustomTimePicker = ({ day, availability, onSave }) => {
  const handleTimeChange = (type, value) => {
    onSave({ ...availability, [type]: value });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{day}</label>
      <div className="flex gap-4 items-center">
        <div>
          <label className="text-sm">Start</label>
          <input
            type="time"
            value={availability?.start || ''}
            onChange={(e) => handleTimeChange('start', e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="text-sm">End</label>
          <input
            type="time"
            value={availability?.end || ''}
            onChange={(e) => handleTimeChange('end', e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>
      {availability?.start && availability?.end && (
        <p className="mt-2 text-sm text-gray-600">
          Selected Time: {availability.start} - {availability.end}
        </p>
      )}
      {!availability?.start && !availability?.end && (
        <p className="mt-2 text-sm text-gray-400">Unavailable</p>
      )}
    </div>
  );
};

export default CustomTimePicker;