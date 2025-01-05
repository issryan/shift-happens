import React, { useState, useEffect } from "react";
import { getSchedules, deleteSchedule } from "../../utils/api";
import MonthPickerModal from "./MonthPickerModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ScheduleGrid = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await getSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await deleteSchedule(scheduleId);
      setSchedules((prev) => prev.filter((schedule) => schedule._id !== scheduleId));
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      console.error("Error deleting schedule:", error.response || error.message);
      toast.error("Failed to delete schedule. Please try again.");
    }
  };

  const handleEdit = (scheduleId) => {
    navigate(`/schedule/edit/${scheduleId}`);
  };

  const handleModalClose = async () => {
    setShowModal(false);
    await fetchSchedules(); // Refresh after generating a new schedule
  };

  return (
    <div className="p-6">
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : schedules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="p-4 bg-white rounded shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {new Date(schedule.startDate).toLocaleDateString()} -{" "}
                {new Date(schedule.endDate).toLocaleDateString()}
              </h3>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(schedule._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(schedule._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No schedules found.</p>
      )}
      {showModal && <MonthPickerModal onClose={handleModalClose} />}
    </div>
  );
};

export default ScheduleGrid;