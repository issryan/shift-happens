import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSchedules, deleteSchedule } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GridComponent, ColumnsDirective, ColumnDirective, Toolbar } from '@syncfusion/ej2-react-grids';
import '@syncfusion/ej2-react-grids/styles/material.css';

const ScheduleGrid = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all schedules on component mount
  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        const data = await getSchedules();
        setSchedules(data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching schedules');
        setLoading(false);
      }
    };

    fetchAllSchedules();
  }, []);

  // Handle schedule deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(id);
        setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule._id !== id));
        toast.success('Schedule deleted successfully');
      } catch (error) {
        toast.error('Error deleting schedule');
      }
    }
  };

  // Define grid actions
  const gridActions = (props) => (
    <div className="flex space-x-2">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => navigate(`/schedules/${props._id}`)}
      >
        View
      </button>
      <button
        className="bg-green-500 text-white px-3 py-1 rounded"
        onClick={() => navigate(`/schedules/${props._id}/edit`)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => handleDelete(props._id)}
      >
        Delete
      </button>
    </div>
  );

  // Toolbar options
  const toolbarOptions = [
    {
      text: 'Create Schedule',
      prefixIcon: 'e-add',
      id: 'createSchedule',
      align: 'Left',
    },
  ];

  const handleToolbarClick = (args) => {
    if (args.item.id === 'createSchedule') {
      navigate('/schedules/new');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Schedules</h1>
      <ToastContainer />
      {loading ? (
        <p>Loading schedules...</p>
      ) : (
        <GridComponent
          dataSource={schedules}
          toolbarClick={handleToolbarClick}
          toolbar={toolbarOptions}
          allowPaging={true}
          pageSettings={{ pageSize: 5 }}
        >
          <ColumnsDirective>
            <ColumnDirective field="name" headerText="Name" width="150" textAlign="Left" />
            <ColumnDirective field="createdAt" headerText="Created At" width="150" textAlign="Left" format="yMd" />
            <ColumnDirective headerText="Actions" template={gridActions} width="200" textAlign="Center" />
          </ColumnsDirective>
        </GridComponent>
      )}
    </div>
  );
};

export default ScheduleGrid;