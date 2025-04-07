"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  FileText,
  Loader2,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { academicYearApi } from "../academic-year/api";
import { systemReportApi } from "./api";
import { useCurrentUser } from "../app-sidebar";

export const QaCoordinatorSystemReport = () => {
  const user = useCurrentUser();
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
      setAcademicYear((prev) => prev ?? academicYears[0].id.toString());
    }
  }, [isAcademicYearsLoading, academicYears]);

  const { data: coordinatorData } = useQuery({
    queryKey: ["coordinatorData", academicYear],
    queryFn: () =>
      systemReportApi.fetchCoordinatorData(
        academicYear || "",
        user?.departmentId?.toString() || ""
      ),
    enabled: !!academicYear && !!user?.departmentId,
  });

  const handleViewIdea = (id: number) => {
    router.push(`/ideas/detail/${id}`);
  };

  if (isAcademicYearsLoading || !coordinatorData) {
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total ideas */}
          <div className="rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Total ideas submitted</p>
              <h2 className="text-3xl font-bold">
                {coordinatorData.ideaCount}
              </h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <FileText size={24} className="" />
            </div>
          </div>

          <div className="rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Total comments</p>
              <h2 className="text-3xl font-bold">
                {coordinatorData.commentCount}
              </h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <MessageCircle size={24} className="" />
            </div>
          </div>

          <div className="rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Upvotes</p>
              <h2 className="text-3xl font-bold">
                {coordinatorData.upVoteCount}
              </h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <ThumbsUp size={24} className="" />
            </div>
          </div>

          <div className="rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Downvotes</p>
              <h2 className="text-3xl font-bold">
                {coordinatorData.downVoteCount}
              </h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <ThumbsDown size={24} className="" />
            </div>
          </div>

          <div className="rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Ideas without comment</p>
              <h2 className="text-3xl font-bold">
                {coordinatorData.ideaWithoutCommentCount}
              </h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <FileText size={24} className="" />
            </div>
          </div>

          <div className="rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Anonymous comment</p>
              <h2 className="text-3xl font-bold">
                {coordinatorData.anonymousCommentCount}
              </h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <MessageCircle size={24} className="" />
            </div>
          </div>

          <div className="rounded-md p-6 flex justify-between items-center border border-input border-solid">
            <div>
              <p className="font-bold text-sm mb-2">Anonymous Idea</p>
              <h2 className="text-3xl font-bold">
                {coordinatorData.anonymousIdeaCount}
              </h2>
            </div>
            <div className="bg-primary text-white p-2 rounded-full">
              <FileText size={24} className="" />
            </div>
          </div>
        </div>

        <div className="border border-input rounded-md p-6">
          <p className="text-base font-semibold mb-4">Most viewed ideas</p>

          {/* Table view for larger screens */}
          <div className="hidden lg:block w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>View Count</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Upvote</TableHead>
                  <TableHead>Downvote</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinatorData.mostViewedIdeas?.map((idea) => (
                  <TableRow key={idea.id}>
                    <TableCell className="font-medium">{idea.title}</TableCell>
                    <TableCell>{idea.view_count}</TableCell>
                    <TableCell>{idea.comment_count}</TableCell>
                    <TableCell>{idea.upvote_count}</TableCell>
                    <TableCell>{idea.downvote_count}</TableCell>
                    <TableCell>{idea.author}</TableCell>
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
            {coordinatorData.mostViewedIdeas?.map((idea) => (
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
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="grid grid-cols-2 gap-3 p-2.5 lg:p-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{idea.view_count}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Comments</p>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{idea.comment_count}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reactions</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{idea.upvote_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {idea.downvote_count}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Engagement</p>
                    <p className="font-medium">{idea.total_engagement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {!coordinatorData.mostViewedIdeas?.length && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
