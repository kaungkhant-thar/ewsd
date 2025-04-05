'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Building, Eye, FileText, Loader2, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { academicYearApi } from '../academic-year/api';
import { SystemReportPie } from './PieChart';
import { systemReportApi } from './api';

export const SystemReport = () => {
  const [academicYear, setAcademicYear] = useState<string | undefined>(undefined);
  const { isLoading: isAcademicYearsLoading, data: academicYears = [] } = useQuery({
    queryKey: ['academicYears'],
    queryFn: () => academicYearApi.fetchAcademicYears(),
  });

  useEffect(() => {
    if (!isAcademicYearsLoading && academicYears?.length) {
      setAcademicYear((prev) => prev ?? academicYears[0].id.toString());
    }
  }, [isAcademicYearsLoading, academicYears]);

  const { data: topUsersData = [] } = useQuery({
    queryKey: ['topUsers', academicYear],
    queryFn: () => systemReportApi.fetchTopUsers(academicYear || ''),
    enabled: !!academicYear,
  });

  const { data: cardsData, isLoading: isCardsDataLoading } = useQuery({
    queryKey: ['cardsData', academicYear],
    queryFn: () => systemReportApi.fetchCardReports(academicYear || ''),
    enabled: !!academicYear,
  });

  const { data: ideasByDeptData, isLoading: isIdeasByDeptDataLoading } = useQuery({
    queryKey: ['ideasByDeptData', academicYear],
    queryFn: () => systemReportApi.fetchChartsData(academicYear || ''),
    enabled: !!academicYear,
  });

  const ideasByDepart = ideasByDeptData?.data.map((dept) => ({
    name: dept.departmentName,
    value: dept.ideaCount,
  }));

  if (isAcademicYearsLoading || isCardsDataLoading || isIdeasByDeptDataLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-10">Dashboard</h1>

      <div className="space-y-6">
        <Select value={academicYear} onValueChange={setAcademicYear}>
          <SelectTrigger className="lg:w-[500px]">
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
        {cardsData && (
          <div className="grid grid-cols-1 md:grid-cols-3  max-w-4xl gap-6">
            {/* Total ideas */}
            <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
              <div>
                <p className="font-bold text-sm mb-2">Total ideas submitted</p>
                <h2 className="text-3xl font-bold">{cardsData.ideaCount}</h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <FileText size={24} className="" />
              </div>
            </div>

            <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
              <div>
                <p className="font-bold text-sm mb-2">Total comments</p>
                <h2 className="text-3xl font-bold">{cardsData.commentCount}</h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <MessageCircle size={24} className="" />
              </div>
            </div>

            <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
              <div>
                <p className="font-bold text-sm mb-2">Total Department</p>
                <h2 className="text-3xl font-bold">{cardsData.departmentCount}</h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <Building size={24} className="" />
              </div>
            </div>
          </div>
        )}

        {!!ideasByDeptData?.totalIdeas && (
          <>
            <div className=" max-w-2xl">
              <SystemReportPie chartData={ideasByDeptData} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border  border-input rounded-md p-6">
                <p className="text-sm font-medium mb-4">Ideas by Department</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ideasByDepart}>
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
                            <h3 className="text-sm font-medium">Top active users</h3>
                          </div>
                        </th>
                        <th className="text-center ">
                          <FileText size={16} className="text-gray-500 mx-auto" />
                        </th>
                        <th className="text-center ">
                          <Eye size={16} className="text-gray-500 mx-auto" />
                        </th>
                        <th className="text-center ">
                          <MessageCircle size={16} className="text-gray-500 mx-auto" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topUsersData.map((user) => (
                        <tr key={user.userId} className="border-b border-gray-100">
                          <td colSpan={2} className="py-2">
                            <div className="flex items-center space-x-3">
                              <div>
                                <p className="text-sm font-medium">{user.userName}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">{user.ideaCount}</td>
                          <td className="text-center">{user.viewCount}</td>
                          <td className="text-center">{user.commentCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {!ideasByDeptData?.totalIdeas && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
