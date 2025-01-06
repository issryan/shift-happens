import React, { useState, useEffect } from "react";
import { getSchedules, generateSchedule, fetchOperations, deleteSchedule } from "../utils/api";
import { toast } from "react-toastify";
import ScheduleGrid from "../components/Schedules/ScheduleGrid";
import { useNavigate } from "react-router-dom";
import MonthPickerModal from "../components/Schedules/MonthPickerModal";

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [operations, setOperations] = useState(null);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const navigate = useNavigate();

  // Load schedules and operations data on mount
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await getSchedules();
        setSchedules(data);
      } catch (error) {
        toast.error("Failed to fetch schedules.");
        console.error("Error fetching schedules:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const loadOperations = async () => {
      try {
        const operationsData = await fetchOperations();
        console.log("Fetched Operations Data:", operationsData);
        setOperations(operationsData.hours || {});
      } catch (error) {
        toast.error("Failed to fetch business operations.");
        console.error("Error fetching operations:", error.message);
      }
    };

    loadSchedules();
    loadOperations();
  }, []);

  // Handle schedule creation
  const handleCreateSchedule = async ({ month, year }) => {
    setCreating(true);
    try {
      console.log("Business Hours:", operations);
      console.log("Month:", month, "Year:", year);

      // Ensure operations data is available
      if (!operations || Object.keys(operations).length === 0) {
        toast.error("Business hours data is missing. Please configure your operations.");
        return;
      }

      // Validate month and year
      if (!month || !year) {
        toast.error("Please select a valid month and year.");
        return;
      }

      // Generate schedule
      await generateSchedule({
        month,
        year,
        businessHours: operations,
      });

      toast.success("Schedule generated successfully!");
      const schedulesData = await getSchedules();
      setSchedules(schedulesData);
    } catch (error) {
      console.error("Error generating schedule:", error.response || error.message);
      toast.error(
        error.response?.data?.message || "Failed to generate schedule. Check the logs for details."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleEditSchedule = (scheduleId) => {
    navigate(`/schedule/edit/${scheduleId}`);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await deleteSchedule(scheduleId);
      const schedulesData = await getSchedules();
      setSchedules(schedulesData);
      toast.success("Schedule deleted successfully!");
    } catch (err) {
      console.error("Error deleting schedule:", err.message);
    }
  };


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Schedules</h1>
      <button
        onClick={() => setIsMonthPickerOpen(true)}
        disabled={creating}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow mb-4"
      >
        {creating ? "Creating..." : "Create New Schedule"}
      </button>
      {isLoading ? (
        <p className="text-gray-500">Loading schedules...</p>
      ) : schedules.length > 0 ? (
        <ScheduleGrid schedules={schedules} onEdit={handleEditSchedule} onDelete={handleDeleteSchedule} />
      ) : (
        <p className="text-gray-500">No schedules available. Create one to get started!</p>
      )}
      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        onSelect={({ month, year }) => handleCreateSchedule({ month, year })}
      />
    </div>
  );
};

export default SchedulesPage;