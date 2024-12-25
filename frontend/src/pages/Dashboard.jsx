import React, { useState, useEffect } from "react";
import { getEmployees, deleteEmployee, updateEmployee } from "../utils/api";
import EmployeeList from "../components/EmployeeList";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject as ChartInject,
  ColumnSeries,
  Category,
} from "@syncfusion/ej2-react-charts";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    onLeave: 0,
    staffed: 0,
    alerts: 0,
  });

  const fetchEmployees = async () => {
    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData);

      // Calculate stats
      const total = employeesData.length;
      const onLeave = employeesData.filter((e) => e.status === "On Leave").length;
      const staffed = employeesData.filter((e) => e.status === "Available").length;
      const alerts = 3; // Placeholder for alert logic to be implemented later
      setStats({ totalEmployees: total, onLeave, staffed, alerts });
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle employee deletion
  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      fetchEmployees(); // Refresh employee list after deletion
    } catch (err) {
      console.error("Error deleting employee:", err.message);
    }
  };

  // Handle employee editing
  const handleEdit = async (id, updatedData) => {
    try {
      await updateEmployee(id, updatedData);
      fetchEmployees(); // Refresh employee list after editing
    } catch (err) {
      console.error("Error updating employee:", err.message);
    }
  };

  const staffingChartData = [
    { day: "Mon", Assigned: 8, Required: 10 },
    { day: "Tue", Assigned: 9, Required: 10 },
    { day: "Wed", Assigned: 10, Required: 10 },
    { day: "Thu", Assigned: 7, Required: 10 },
    { day: "Fri", Assigned: 8, Required: 10 },
    { day: "Sat", Assigned: 5, Required: 5 },
    { day: "Sun", Assigned: 3, Required: 5 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Action Buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            View Schedule
          </button>
          <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            Export Schedule
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl font-bold">{stats.totalEmployees}</p>
        </div>
        <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">On Leave</h3>
          <p className="text-2xl font-bold">{stats.onLeave}</p>
        </div>
        <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">Staffed</h3>
          <p className="text-2xl font-bold">{stats.staffed}</p>
        </div>
        <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">Alerts</h3>
          <p className="text-2xl font-bold">{stats.alerts}</p>
        </div>
      </div>

      {/* Weekly Staffing Overview */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Staffing Overview</h3>
        <ChartComponent
          id="charts"
          primaryXAxis={{ valueType: "Category", title: "Days" }}
          primaryYAxis={{ title: "Employees" }}
          tooltip={{ enable: true }}
        >
          <ChartInject services={[ColumnSeries, Category]} />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={staffingChartData}
              xName="day"
              yName="Assigned"
              name="Assigned"
              type="Column"
            />
            <SeriesDirective
              dataSource={staffingChartData}
              xName="day"
              yName="Required"
              name="Required"
              type="Column"
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>

      {/* Employee List */}
      <EmployeeList
        employees={employees}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        fetchEmployees={fetchEmployees}
      />
    </div>
  );
};

export default Dashboard;