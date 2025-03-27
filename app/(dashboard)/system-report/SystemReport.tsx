"use client";
import {
  FileText,
  Eye,
  MessageCircle,
  Building,
  ActivitySquare,
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
import { academicYearApi } from "../academic-year/api";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ReportPieChart, SystemReportPie } from "./PieChart";
import { systemReportApi } from "./api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActiveUsers } from "./ActiveUsers";

export const SystemReport = () => {
  const {
    data: academicYears = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["academicYears"],
    queryFn: () => academicYearApi.fetchAcademicYears(),
  });

  const {
    data: topUsersData = [],
    isLoading: isLoadingTopUsers,
    error: topUsersError,
    refetch: refetchTopUsers,
  } = useQuery({
    queryKey: ["topUsers"],
    queryFn: () => systemReportApi.fetchTopUsers("1"),
  });

  console.log({ topUsersData });

  const [academicYear, setAcademicYear] = useState<string | undefined>(
    undefined
  );

  // Mock data for the bar chart
  const ideasByDeptData = [
    { name: "Department 1", value: 55 },
    { name: "Department 2", value: 65 },
    { name: "Department 3", value: 75 },
    { name: "Department 4", value: 78 },
    { name: "Department 5", value: 68 },
    { name: "Department 6", value: 45 },
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
    }));

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-10">System report</h1>

      <div className="space-y-6">
        <Select value={academicYear} onValueChange={setAcademicYear}>
          <SelectTrigger className="w-[500px]">
            <SelectValue placeholder="Please select academic year" />
          </SelectTrigger>
          <SelectContent>
            {academicYears.map((year) => (
              <SelectItem key={year.id} value={year.id.toString()}>
                {year.startDate} - {year.endDate} ({year.academicName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-1 md:grid-cols-3  max-w-4xl gap-6">
          {/* Total ideas */}
          <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Total ideas submitted</p>
              <h2 className="text-3xl font-bold">230</h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <FileText size={24} className="" />
            </div>
          </div>

          <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Total comments</p>
              <h2 className="text-3xl font-bold">450</h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <MessageCircle size={24} className="" />
            </div>
          </div>

          <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Total Department</p>
              <h2 className="text-3xl font-bold">12</h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <Building size={24} className="" />
            </div>
          </div>
        </div>

        <div className=" max-w-2xl">
          <SystemReportPie />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Bar Chart */}
          <div className="border  border-input rounded-md p-6">
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
          {/* User Activity Table */}
          <div className="border  border-input rounded-md p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th colSpan={2} className="py-2">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium">
                          Top active users
                        </h3>
                      </div>
                    </th>
                    <th className="text-center ">
                      <FileText size={16} className="text-gray-500 mx-auto" />
                    </th>
                    <th className="text-center ">
                      <Eye size={16} className="text-gray-500 mx-auto" />
                    </th>
                    <th className="text-center ">
                      <MessageCircle
                        size={16}
                        className="text-gray-500 mx-auto"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td colSpan={2} className="py-2">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{user.ideas}</td>
                      <td className="text-center">{user.views}</td>
                      <td className="text-center">{user.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
