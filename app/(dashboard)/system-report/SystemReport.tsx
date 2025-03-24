"use client";
import {
  ChevronDown,
  FileText,
  MessageSquare,
  Building,
  Eye,
  MessageCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const SystemReport = () => {
  // Mock data for the pie chart
  const departmentData = [
    { name: "Engineering Department", value: 20, color: "#F4A261" },
    { name: "Marketing Department", value: 20, color: "#E9C46A" },
    { name: "HR Department", value: 20, color: "#264653" },
    { name: "Networking Department", value: 20, color: "#2A9D8F" },
    { name: "Student Department", value: 20, color: "#E76F51" },
  ];

  // Mock data for the bar chart
  const ideasByDeptData = [
    { name: "Department Title", value: 55 },
    { name: "Department Title", value: 65 },
    { name: "Department Title", value: 75 },
    { name: "Department Title", value: 78 },
    { name: "Department Title", value: 68 },
    { name: "Department Title", value: 45 },
  ];

  // Mock data for top active users
  const topUsers = Array(7)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      name: "Olivia Martin",
      email: "oliver@gmail.com",
      ideas: index === 2 ? 10 : 1,
      views: index === 3 ? 8 : 1,
      comments: index === 1 ? 4 : 1,
      avatar: "/lovable-uploads/6a34b16d-102d-41ff-b4f3-255b0af44206.png",
    }));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      <div className="border border-dashed border-blue-400 rounded-md p-6 mb-4">
        <h1 className="text-2xl font-bold">System report</h1>
      </div>

      {/* Date Selector */}
      <div className="border border-dashed border-blue-400 rounded-md p-6 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Dec 2023 - Dec 2024 (KMD Final year)</span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="border border-dashed border-blue-400 rounded-md p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total ideas */}
          <div className="border border-dashed border-blue-400 rounded-md p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total ideas submitted</p>
              <h2 className="text-3xl font-bold">230</h2>
            </div>
            <div className="bg-blue-100 p-2 rounded-md">
              <FileText size={24} className="text-blue-700" />
            </div>
          </div>

          {/* Total comments */}
          <div className="border-0 p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total comments</p>
              <h2 className="text-3xl font-bold">450</h2>
            </div>
            <div className="bg-blue-100 p-2 rounded-md">
              <MessageSquare size={24} className="text-blue-700" />
            </div>
          </div>

          {/* Total Departments */}
          <div className="border-0 p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Department</p>
              <h2 className="text-3xl font-bold">12</h2>
            </div>
            <div className="bg-blue-100 p-2 rounded-md">
              <Building size={24} className="text-blue-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Pie Chart */}
        <div className="border border-dashed border-blue-400 rounded-md p-6">
          <p className="text-sm text-blue-500 mb-2">258 × 128 Hug</p>
          <p className="text-sm font-medium mb-4">
            Percentages of ideas by each Department
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-28 -translate-y-6 text-center">
              <div className="text-2xl font-bold">1,125</div>
              <div className="text-xs text-gray-500">visitors</div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: dept.color }}
                ></div>
                <span className="text-sm">{dept.name} (50%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="border border-dashed border-blue-400 rounded-md p-6">
          <p className="text-sm font-medium mb-4">Ideas by Department</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ideasByDeptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Activity Table */}
      <div className="border border-dashed border-blue-400 rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Top active users</h3>
          <div className="flex space-x-2">
            <FileText size={16} className="text-gray-500" />
            <Eye size={16} className="text-gray-500" />
            <MessageCircle size={16} className="text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {topUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-2">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-2 px-4">{user.ideas}</td>
                  <td className="text-center py-2 px-4">{user.views}</td>
                  <td className="text-center py-2 px-4">{user.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
