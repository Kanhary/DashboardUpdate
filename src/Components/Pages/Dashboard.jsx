import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pie, Line } from 'react-chartjs-2';
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
import { GetAllComputer } from '../../api/user';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchTotalComputers();
  }, []);

  const computerStatusData = {
    labels: ['Active', 'Inactive', 'Broken'],
    datasets: [
      {
        label: 'Computer Status',
        data: [100, 10, 5], 
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)', // Active
          'rgba(239, 68, 68, 0.7)', // Inactive
          'rgba(234, 179, 8, 0.7)',  // Broken
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 2,
        borderRadius: 12,
        hoverBackgroundColor: [
          'rgba(99, 102, 241, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(234, 179, 8, 0.9)',
        ],
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
        borderRadius: 8,
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
      <h1 className="text-xl font-medium text-blue-800 font-khmer">Dashboard</h1>
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
              <p className="text-3xl font-semibold text-gray-800">{totalComputers}</p>
            )}
            <div className="text-sm text-gray-500">+10 this month</div>
          </div>
          <div className="flex items-center justify-center w-16 h-16 transition-transform transform bg-blue-100 rounded-full hover:scale-105">
            <FiMonitor className="text-blue-500" size={30} />
          </div>
        </motion.div>

        {/* Other Cards... (Active, Inactive, Broken Computers) */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Computer Status Overview</h2>
          <Pie data={computerStatusData} options={chartOptions} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Computer Trend Over Time</h2>
          <Line data={computerTrendData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Recent Activities</h2>
        <ul className="space-y-4">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="flex items-center">
              <div className="mr-3">{activity.icon}</div>
              <div>
                <p className="text-gray-700">{activity.activity}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;