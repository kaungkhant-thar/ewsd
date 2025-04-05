"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  FileText,
  Loader2,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { academicYearApi } from "../academic-year/api";
import { systemReportApi } from "./api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const QAManagerSystemReport = () => {
  const [academicYear, setAcademicYear] = useState<string | undefined>(
    undefined
  );
  const { isLoading: isAcademicYearsLoading, data: academicYears = [] } =
    useQuery({
      queryKey: ["academicYears"],
      queryFn: () => academicYearApi.fetchAcademicYears(),
    });

  useEffect(() => {
    if (!isAcademicYearsLoading && academicYears?.length) {
      setAcademicYear((prev) => prev ?? academicYears[0].id.toString());
    }
  }, [isAcademicYearsLoading, academicYears]);

  const { data: topUsersData = [] } = useQuery({
    queryKey: ["topUsers", academicYear],
    queryFn: () => systemReportApi.fetchTopUsers(academicYear || ""),
    enabled: !!academicYear,
  });

  const { data: cardsData, isLoading: isCardsDataLoading } = useQuery({
    queryKey: ["cardsData", academicYear],
    queryFn: () => systemReportApi.fetchCardReports(academicYear || ""),
    enabled: !!academicYear,
  });

  const {
    data: annonymousCountsData,
    isLoading: isAnnonymousCountsDataLoading,
  } = useQuery({
    queryKey: ["annonymousCounts", academicYear],
    queryFn: () => systemReportApi.fetchAnnonymousCounts(academicYear || ""),
    enabled: !!academicYear,
  });

  const { data: ideasByDeptData, isLoading: isIdeasByDeptDataLoading } =
    useQuery({
      queryKey: ["ideasByDeptData", academicYear],
      queryFn: () => systemReportApi.fetchChartsData(academicYear || ""),
      enabled: !!academicYear,
    });

  const ideasByDepart =
    ideasByDeptData?.data.map((dept) => ({
      name: dept.departmentName,
      value: dept.ideaCount,
    })) || [];

  const {
    data: contributorsByDepartments,
    isLoading: isContributorsByDepartmentsLoading,
  } = useQuery({
    queryKey: ["contributorsByDepartment", academicYear],
    queryFn: () =>
      systemReportApi.fetchContributorsByDepartment(academicYear || ""),
    enabled: !!academicYear,
  });

  const contributors =
    contributorsByDepartments?.data.map((each) => ({
      name: each.departmentName,
      value: each.contributorCount,
    })) || [];

  const { data: mostViewedIdeas, isLoading: isMostViewedIdeasLoading } =
    useQuery({
      queryKey: ["mostViewIdeas", academicYear],
      queryFn: () => systemReportApi.fetchMostViewedIdeas(academicYear || ""),
      enabled: !!academicYear,
    });

  console.log({ mostViewedIdeas });

  if (
    isAcademicYearsLoading ||
    isCardsDataLoading ||
    isIdeasByDeptDataLoading ||
    isAnnonymousCountsDataLoading ||
    isContributorsByDepartmentsLoading
  ) {
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
          <div className="grid grid-cols-1 md:grid-cols-4  gap-6">
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
                <p className="font-bold text-sm mb-2">Upvotes</p>
                <h2 className="text-3xl font-bold">
                  {cardsData.departmentCount}
                </h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <ThumbsUp size={24} className="" />
              </div>
            </div>

            <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
              <div>
                <p className="font-bold text-sm mb-2">Downvotes</p>
                <h2 className="text-3xl font-bold">
                  {cardsData.departmentCount}
                </h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <ThumbsDown size={24} className="" />
              </div>
            </div>

            <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
              <div>
                <p className="font-bold text-sm mb-2">Ideas without comment</p>
                <h2 className="text-3xl font-bold">
                  {cardsData.departmentCount}
                </h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <FileText size={24} className="" />
              </div>
            </div>

            <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
              <div>
                <p className="font-bold text-sm mb-2">Anonymous comment</p>
                <h2 className="text-3xl font-bold">
                  {annonymousCountsData?.anonymousCommentCount || 0}
                </h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <MessageCircle size={24} className="" />
              </div>
            </div>

            <div className=" rounded-md p-6 flex justify-between items-center border border-input border-solid">
              <div>
                <p className="font-bold text-sm mb-2">Anonymous Idea</p>
                <h2 className="text-3xl font-bold">
                  {annonymousCountsData?.anonymousIdeaCount || 0}
                </h2>
              </div>
              <div className="bg-primary text-white p-2 rounded-full">
                <FileText size={24} className="" />
              </div>
            </div>
          </div>
        )}

        {!!ideasByDeptData?.totalIdeas && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border  border-input rounded-md p-6">
                <p className="text-base font-semibold mb-4">
                  Ideas by Department
                </p>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ideasByDepart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        ticks={[0, 20, 40, 60, 80, 100]}
                      />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border  border-input rounded-md p-6">
                <p className="text-base font-semibold mb-4">
                  Contributors by department
                </p>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contributors}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        ticks={[0, 20, 40, 60, 80, 100]}
                      />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* <div className="border border-input rounded-md p-6 ">
          <p className="text-base font-semibold mb-4">Most view ideas</p>

          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>View Count</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Upvote</TableHead>
                  <TableHead>Downvote</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostViewedIdeas?.map((idea) => {
                  return (
                    <TableRow key={idea.id}>
                      <TableCell>{idea.title}</TableCell>
                      <TableCell>{idea.viewCount}</TableCell>
                      <TableCell>{idea.commentCount || 0}</TableCell>
                      <TableCell>{idea.idea}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="max-w-28"></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div> */}

        {!ideasByDeptData?.totalIdeas && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
