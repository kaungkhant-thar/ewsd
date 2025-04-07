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
  FileText,
  Loader2,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Eye,
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
import { PieChartCard } from "./PieChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const QaManagerSystemReport = () => {
  const router = useRouter();
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
      setAcademicYear(
        (prev) =>
          prev ??
          academicYears.find((ay) => ay.status === "current")?.id.toString()
      );
    }
  }, [isAcademicYearsLoading, academicYears]);

  const { data: mostUsedBrowsers, isLoading: isMostUsedBrowsersLoading } =
    useQuery({
      queryKey: ["mostUserdBrowsers"],
      queryFn: () => systemReportApi.fetchMostUsedBrowsers(),
    });

  const totalBrowsers =
    mostUsedBrowsers?.logs.reduce((sum, b) => sum + b.count, 0) || 0;

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

  const { data: upDownVoteCounts, isLoading: isUpDownVoteCountsLoading } =
    useQuery({
      queryKey: ["upDownVoteCounts", academicYear],
      queryFn: () =>
        systemReportApi.fetchQaManagerUpDownVoteCounts(academicYear || ""),
      enabled: !!academicYear,
    });

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
  console.log({ upDownVoteCounts });

  const handleViewIdea = (id: number) => {
    router.push(`/ideas/detail/${id}`);
  };

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
                  {upDownVoteCounts?.upvoteCount}
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
                  {upDownVoteCounts?.downvoteCount}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <PieChartCard
            title="Percentages of ideas by each Department"
            data={
              ideasByDeptData?.data.map((dept) => ({
                label: dept.departmentName,
                value: dept.ideaCount,
                percent: dept.percentage,
              })) || []
            }
            totalValue={ideasByDeptData?.totalIdeas}
            totalLabel="visitors"
          />
          <PieChartCard
            title="Most used browsers"
            data={(mostUsedBrowsers?.logs || []).map((browser) => {
              const percent =
                totalBrowsers > 0
                  ? Math.round((browser.count / totalBrowsers) * 100)
                  : 0;
              return {
                label: browser.browser,
                value: browser.count,
                percent,
              };
            })}
            totalLabel="logins"
            totalValue={totalBrowsers}
          />
        </div>
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
                      <XAxis
                        dataKey="name"
                        tick={({ x, y, payload }) => {
                          const words = payload.value.split(" ");
                          return (
                            <text
                              x={x}
                              y={y + 10}
                              textAnchor="end"
                              transform={`rotate(-45, ${x}, ${y + 10})`}
                              fontSize={12}
                              fill="#666"
                            >
                              {words.map((word: string, index: number) => (
                                <tspan
                                  key={index}
                                  x={x}
                                  dy={index === 0 ? 0 : 14}
                                >
                                  {word}
                                </tspan>
                              ))}
                            </text>
                          );
                        }}
                        height={100}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
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
                      <XAxis
                        dataKey="name"
                        tick={({ x, y, payload }) => {
                          const words = payload.value.split(" ");
                          return (
                            <text
                              x={x}
                              y={y + 10}
                              textAnchor="end"
                              transform={`rotate(-45, ${x}, ${y + 10})`}
                              fontSize={12}
                              fill="#666"
                            >
                              {words.map((word: string, index: number) => (
                                <tspan
                                  key={index}
                                  x={x}
                                  dy={index === 0 ? 0 : 14}
                                >
                                  {word}
                                </tspan>
                              ))}
                            </text>
                          );
                        }}
                        height={100}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="border border-input rounded-md p-6 ">
          <p className="text-base font-semibold mb-4">Most view ideas</p>

          {/* Table view for larger screens */}
          <div className="hidden lg:block w-full overflow-x-auto">
            <Table>
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
                {mostViewedIdeas?.map((idea) => (
                  <TableRow key={idea.id}>
                    <TableCell className="font-medium">{idea.title}</TableCell>
                    <TableCell>{idea.categoryName}</TableCell>
                    <TableCell>{idea.viewCount}</TableCell>
                    <TableCell>{idea.commentCount || 0}</TableCell>
                    <TableCell>{idea.upvoteCount || 0}</TableCell>
                    <TableCell>{idea.downvoteCount || 0}</TableCell>
                    <TableCell>{idea.authorName}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => handleViewIdea(idea.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card view for mobile screens */}
          <div className="lg:hidden space-y-4">
            {mostViewedIdeas?.map((idea) => (
              <Card
                key={idea.id}
                className="bg-[#F9FBFD] border border-[#D1D9E2]"
                onClick={() => handleViewIdea(idea.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 lg:px-5 lg:py-4">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 py-1.5 lg:py-2 px-2 lg:px-4 bg-muted/50"
                    >
                      <span className="text-xs lg:text-sm font-semibold text-primary">
                        ID: {idea.id}
                      </span>
                    </Badge>
                    <div>
                      <h3 className="text-sm lg:text-base font-semibold">
                        {idea.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        By {idea.authorName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="grid grid-cols-2 gap-3 p-2.5 lg:p-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{idea.categoryName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{idea.viewCount}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comments</p>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{idea.commentCount || 0}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reactions</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {idea.upvoteCount || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {idea.downvoteCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {!ideasByDeptData?.totalIdeas && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
