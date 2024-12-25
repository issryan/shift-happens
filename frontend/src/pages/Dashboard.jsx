import React, { useState, useEffect } from "react";
import { getEmployees, getAnalytics, deleteEmployee, updateEmployee } from "../utils/api";
import EmployeeList from "../components/EmployeeList";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject as ChartInject,
  ColumnSeries,
  Category,
  Tooltip,
  Legend,
  DataLabel,
} from "@syncfusion/ej2-react-charts";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    staffingStatus: [],
    alerts: 0,
  });

  const fetchAnalytics = async () => {
    try {
      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Error fetching analytics:", err.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData);
      fetchAnalytics(); // Fetch analytics whenever employees change
    } catch (err) {
      console.error("Error fetching employees:", err.message);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        fetchAnalytics(); // Fetch analytics whenever employees change
      } catch (err) {
        console.error("Error fetching employees:", err.message);
      }
    };
  
    fetchEmployees();
  }, []);

  // Handle employee deletion
  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      fetchEmployees(); // Refresh both employees and analytics after deletion
    } catch (err) {
      console.error("Error deleting employee:", err.message);
    }
  };

  // Handle employee editing
  const handleEdit = async (id, updatedData) => {
    try {
      await updateEmployee(id, updatedData);
      fetchEmployees(); // Refresh both employees and analytics after editing
    } catch (err) {
      console.error("Error updating employee:", err.message);
    }
  };

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
          <p className="text-2xl font-bold">{analytics.totalEmployees}</p>
        </div>
        <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">Understaffed Days</h3>
          <p className="text-2xl font-bold">
            {analytics.staffingStatus.filter((day) => day.status === "understaffed").length}
          </p>
        </div>
        <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">Sufficiently Staffed</h3>
          <p className="text-2xl font-bold">
            {analytics.staffingStatus.filter((day) => day.status === "sufficient").length}
          </p>
        </div>
        <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center">
          <h3 className="text-lg font-semibold">Alerts</h3>
          <p className="text-2xl font-bold">{analytics.alerts}</p>
        </div>
      </div>

      {/* Weekly Staffing Overview */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Staffing Overview</h3>
        <ChartComponent
          id="charts"
          primaryXAxis={{ valueType: "Category", title: "Days" }}
          primaryYAxis={{ title: "Employees" }}
          legendSettings={{ visible: true }} // Enable legend
          tooltip={{ enable: true }}
        >
          <ChartInject services={[ColumnSeries, Category, Tooltip, Legend, DataLabel]} />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={analytics.staffingStatus}
              xName="day"
              yName="staffCount"
              name="Actual Staff"
              type="Column"
              marker={{ dataLabel: { visible: true } }}
            />
            <SeriesDirective
              dataSource={analytics.staffingStatus}
              xName="day"
              yName="needed"
              name="Required Staff"
              type="Column"
              marker={{ dataLabel: { visible: true } }}
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