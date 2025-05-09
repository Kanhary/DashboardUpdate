import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pie, Line } from 'react-chartjs-2';
import { BsFillSendFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Report from './Report';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js';
import { FiMonitor, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { GetAllComputer, GetProduct } from '../../api/user';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

const Dashboard = () => {
  const [totalComputers, setTotalComputers] = useState(null);
  const [allComputer, setAllComputer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchTotalComputers = async () => {
      try {
        const response = await GetAllComputer();
        console.log(response.data.data); // Debugging line
        setTotalComputers(response.data.data); // Set only the data
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false); // Ensure loading is false at the end
      }
    };


  
    const fetchAllComputer = async () => {
      try{
        const response = await GetProduct();
        console.log(response.data.data);
        setAllComputer(response.data.data);
      }catch (err) {
        setError(err.message); 
      } finally{
        setLoading(false);
      }
    };

    fetchAllComputer();
    fetchTotalComputers();
  }, []);

  const statusCounts = allComputer.reduce(
    (acc, device) => {
      if (device.status === "Active") acc.active += 1;
      else if (device.status === "In Maintenance") acc.maintenance += 1;
      else acc.broken += 1; // Assume any other status means "broken"
      return acc;
    },
    { active: 0, maintenance: 0, broken: 0 }
  );

  const assetCounts = allComputer.reduce(
    (acc, device) => {
      const code = device.categoryCode; // e.g., "FA-C" or "MA-C"
      if (code === "FA-C" || code === "MA-C") {
        acc[code] = (acc[code] || 0) + 1;
      }
      return acc;
    },
    { "MA-C": 0, "FA-C": 0 }
  );
  
  const departmentCounts = allComputer.reduce((acc, device) => {
    const department = device.officeCode || 'Unknown';
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {});
  
  const total = Object.values(departmentCounts).reduce((sum, count) => sum + count, 0);
  
  const handleSendClick = () => {
    navigate("/main-dashboard/help"); // Make sure the route "/report" exists in your router
  };

  const computerStatusData = {
    labels: ["Active", "In Maintenance", "Broken"],
    datasets: [
      {
        label: "Computer Status",
        data: [statusCounts.active, statusCounts.maintenance, statusCounts.broken],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)', // Active
          'rgba(234, 179, 8, 0.7)',// Inactive
          'rgba(239, 68, 68, 0.7)',  // Broken
        ],
        
        hoverBackgroundColor: [
          'rgba(99, 102, 241, 0.9)',
          'rgba(234, 179, 8, 0.9)',
          'rgba(239, 68, 68, 0.9)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        // borderRadius: 12,
        
      },
    ],
  };

  const assetStatusData = {
    labels: ["Minor Asset", "Fixed Asset"],
    datasets: [
      {
        label: "Asset Type",
        data: [assetCounts["MA-C"], assetCounts["FA-C"]],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',  // Blue — for Fixed Asset
          'rgba(34, 197, 94, 0.7)',   // Green — for Minor Asset
        ],
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 0.9)',  // Blue
          'rgba(34, 197, 94, 0.9)',   // Green
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',    // Blue
          'rgba(34, 197, 94, 1)',     // Green
        ],
        
        borderWidth: 2,
      },
    ],
  };

  const departmentLabels = Object.keys(departmentCounts);
  const departmentData = Object.values(departmentCounts);

  const departmentDistributionData = {
    labels: departmentLabels,
    datasets: [
      {
        label: 'Computers per Department',
        data: departmentData,
        fill: false,
        backgroundColor: 'rgba(34, 197, 94, 0.7)', // green
        borderColor: 'rgba(34, 197, 94, 1)',
        tension: 0.4,
      },
    ],
  };


  const computerTrendData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Total Computers',
        data: [90, 95, 100, 105, 110, 120], // Example trend data
        fill: false,
        backgroundColor: 'rgba(99, 102, 241, 1)',
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#4B5563',
          font: {
            size: 14,
            family: 'Inter, sans-serif',
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleFont: {
          size: 16,
          family: 'Inter, sans-serif',
          weight: '600',
        },
        bodyFont: {
          size: 14,
          family: 'Inter, sans-serif',
          weight: '400',
        },
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        // borderRadius: 8,
        
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
            weight: '500',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
            weight: '500',
          },
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          dash: [5, 5],
        },
      },
    },
  };

  const recentActivities = [
    {
      id: 1,
      icon: <FiMonitor className="text-indigo-500" size={20} />,
      activity: '5 new computers added to the inventory.',
      time: '2 hours ago',
    },
    {
      id: 2,
      icon: <FiActivity className="text-yellow-500" size={20} />,
      activity: 'Scheduled maintenance completed successfully.',
      time: '1 day ago',
    },
    {
      id: 3,
      icon: <FiMonitor className="text-green-500" size={20} />,
      activity: '10 computers updated to the latest software.',
      time: '3 days ago',
    },
    {
      id: 4,
      icon: <FiAlertCircle className="text-red-500" size={20} />,
      activity: '3 computers marked as broken.',
      time: '5 days ago',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen mt-10">
    <div className="flex items-center justify-between ">
      <h1 className="text-lg font-semibold text-blue-800 font-khmer">
        Dashboard
      </h1>
      <button onClick={handleSendClick} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200">
        <BsFillSendFill className="text-xl" />
        <span className="text-sm" >Send</span>
      </button>
    </div>
      <div className="mt-3 mb-3 border"></div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Computers Card */}
        <motion.div
          className="flex items-center justify-between p-6 transition-all transition-transform duration-300 transform bg-white rounded-lg shadow-xl hover:shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Total Computers</p>
            {loading ? (
              <p className="text-3xl font-semibold text-gray-800">Loading...</p>
            ) : error ? (
              <p className="text-3xl font-semibold text-red-600">{error}</p>
            ) : (
              <p className="text-xl font-semibold text-gray-800">{totalComputers}</p>
            )}
            {/* <div className="text-sm text-gray-500">+10 this month</div> */}
          </div>
          <div className="flex items-center justify-center w-14 h-14 transition-transform transform bg-blue-100 rounded-full hover:scale-105">
            <FiMonitor className="text-blue-500" size={20} />
          </div>
        </motion.div>

        {/* Active Computers */}
        <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
          <div>
            <p className="text-sm text-gray-500">In Active Computers </p>
            {loading ? (
              <p className="text-3xl font-semibold text-gray-800">Loading...</p>
            ) : (
              <p className="text-xl font-semibold text-gray-800">{statusCounts.active}</p>
            )}
          </div>
          <div className='flex items-center justify-center w-14 h-14 transition-transform transform bg-green-100 rounded-full hover:scale-105'>
            <FiMonitor className="text-green-500" size={20} />
          </div>
          
        </div>

        {/* In Maintenance */}
        <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
          <div>
            <p className="text-sm text-gray-500">In Maintenance</p>
            {loading ? (
              <p className="text-3xl font-semibold text-gray-800">Loading...</p>
            ) : (
              <p className="text-xl font-semibold text-gray-800">{statusCounts.maintenance}</p>
            )}
          </div>
          <div className='flex items-center justify-center w-14 h-14 transition-transform transform bg-yellow-100 rounded-full hover:scale-105'>
            <FiMonitor className="text-yellow-500" size={20} />
          </div>
          
        </div>

        {/* Broken Computers */}
        <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-lg">
          <div>
            <p className="text-sm text-gray-500">Broken Computers</p>
            {loading ? (
              <p className="text-3xl font-semibold text-gray-800">Loading...</p>
            ) : (
              <p className="text-xl font-semibold text-gray-800">{statusCounts.broken}</p>
            )}
          </div>
          <div className='flex items-center justify-center w-14 h-14 transition-transform transform bg-red-100 rounded-full hover:scale-105'>
            <FiMonitor className="text-red-500" size={20} />
          </div>
          
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Computer Status Overview</h2>
          <Pie data={computerStatusData} options={chartOptions} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Computer Status Overview</h2>
          <Pie data={assetStatusData} options={chartOptions} />
        </div>

        
      </div>
      {/* <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Department Distribution of Computers
        </h2>
        <div className="space-y-3">
          {Object.entries(departmentCounts).map(([department, count]) => {
            const percent = ((count / total) * 100).toFixed(1);
            return (
              <div key={department}>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>{department}</span>
                  <span>{count} ({percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;