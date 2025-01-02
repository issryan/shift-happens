import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const ShiftList = ({ shifts, onDeleteShift }) => {
  return (
    <Droppable droppableId="shiftList">
      {(provided) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="bg-gray-100 p-4 rounded shadow mt-4"
        >
          {shifts.map((shift, index) => (
            <Draggable key={shift._id} draggableId={shift._id} index={index}>
              {(provided) => (
                <li
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="p-2 bg-white rounded shadow mb-2 flex justify-between items-center"
                >
                  <span>
                    {shift.startTime} - {shift.endTime} (Employee: {shift.employeeId || 'Unassigned'})
                  </span>
                  <button
                    onClick={() => onDeleteShift(shift._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};

export default ShiftList;