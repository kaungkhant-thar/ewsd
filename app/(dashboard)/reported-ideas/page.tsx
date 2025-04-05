"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { Eye, Loader2, Plus, Search, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { reportedIdeaApi, ReportedIdea, Idea, User } from "./api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Combined interface for the reports table
interface ReportedIdeaRow {
  id: number; // reportedIdea id
  reportTitle: string; // idea title
  staffName: string; // reporting user name
  reportedDate: string; // createdAt formatted
  ideaId: number; // For reference
  userId: number; // For reference
}

export default function ManageIdeasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("id");
  const [keyword, setKeyword] = useState("");
  const [reportedRows, setReportedRows] = useState<ReportedIdeaRow[]>([]);
  const [confirmAction, setConfirmAction] = useState<"hide" | "block" | null>(
    null
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = ["id", "reportTitle", "staffName", "reportedDate"];

  // Fetch reported ideas
  const {
    data: reportedIdeas,
    isLoading: isLoadingReportedIdeas,
    error: reportedIdeasError,
  } = useQuery({
    queryKey: ["reportedIdeas"],
    queryFn: reportedIdeaApi.fetchReportedIdeas,
  });

  // Process reported ideas to get full data
  useEffect(() => {
    if (reportedIdeas && reportedIdeas.length > 0) {
      const fetchRelatedData = async () => {
        const rows: ReportedIdeaRow[] = [];

        for (const report of reportedIdeas) {
          try {
            const [idea, user] = await Promise.all([
              reportedIdeaApi.fetchIdea(report.ideaId),
              reportedIdeaApi.fetchUser(report.userId),
            ]);

            rows.push({
              id: report.id,
              reportTitle: idea.title || "Untitled",
              staffName: (user as any).userName || "Unknown User",
              reportedDate: new Date(report.createdAt).toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              ideaId: report.ideaId,
              userId: idea.userId,
            });
          } catch (error) {
            console.error("Error fetching related data:", error);
          }
        }

        setReportedRows(rows);
      };

      fetchRelatedData();
    }
  }, [reportedIdeas]);

  // Mutations for different actions
  const deleteIdeaMutation = useMutation({
    mutationFn: reportedIdeaApi.deleteIdea,
    onSuccess: () => {
      toast.success("Post hidden successfully");
      queryClient.invalidateQueries({ queryKey: ["reportedIdeas"] });
      setConfirmAction(null);
      setSelectedId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to hide post");
      setConfirmAction(null);
      setSelectedId(null);
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: reportedIdeaApi.blockUser,
    onSuccess: () => {
      toast.success("User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["reportedIdeas"] });
      setConfirmAction(null);
      setSelectedId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to block user");
      setConfirmAction(null);
      setSelectedId(null);
    },
  });

  // Action handlers
  const handleView = (ideaId: number) => {
    router.push(`/ideas/${ideaId}`);
  };

  const handleHidePost = (reportId: number, ideaId: number) => {
    setSelectedId(ideaId);
    setConfirmAction("hide");
  };

  const handleBlockUser = (reportId: number, userId: number) => {
    setSelectedId(userId);
    setConfirmAction("block");
  };

  const confirmHidePost = () => {
    if (selectedId) {
      deleteIdeaMutation.mutate(selectedId);
    }
  };

  const confirmBlockUser = () => {
    if (selectedId) {
      blockUserMutation.mutate(selectedId);
    }
  };

  // Filter records based on search
  const filteredRecords =
    reportedRows?.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(keyword.toLowerCase())
      )
    ) ?? [];

  if (isLoadingReportedIdeas) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <h1 className="text-xl lg:text-2xl font-semibold">Manage Reported Ideas</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2.5 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <Input
            value={keyword}
            className="pl-9 border-[#e4e4e7] w-full"
            placeholder="Type a command or search..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Select onValueChange={setSortBy} defaultValue="id">
          <SelectTrigger className="w-full sm:w-28">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {_.startCase(column)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filteredRecords.length > 0 ? (
        <>
          {/* Table view for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Report title</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Reported Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords
                  .sort((a, b) =>
                    `${a[sortBy as keyof typeof a]}`.localeCompare(
                      `${b[sortBy as keyof typeof b]}`
                    )
                  )
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell className="min-w-[200px]">{row.reportTitle}</TableCell>
                      <TableCell>{row.staffName}</TableCell>
                      <TableCell className="whitespace-nowrap">{row.reportedDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="!text-[#025964] px-0 hover:bg-transparent"
                            onClick={() => handleView(row.ideaId)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleHidePost(row.id, row.ideaId)}
                          >
                            Hide Post
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Card view for mobile screens */}
          <div className="sm:hidden space-y-4">
            {filteredRecords
              .sort((a, b) =>
                `${a[sortBy as keyof typeof a]}`.localeCompare(
                  `${b[sortBy as keyof typeof b]}`
                )
              )
              .map((row) => (
                <Card key={row.id} className="bg-[#F9FBFD] border border-[#D1D9E2]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 lg:px-5 lg:py-4">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 py-1.5 lg:py-2 px-2 lg:px-4 bg-muted/50"
                      >
                        <span className="text-xs lg:text-sm font-semibold text-primary">
                          ID: {row.id}
                        </span>
                      </Badge>
                      <div>
                        <p className="text-sm">
                          Reported by{" "}
                          <span className="font-semibold">
                            {row.staffName}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-2.5 lg:px-5 lg:pt-6 space-y-2 lg:space-y-6">
                    <div>
                      <h1 className="text-lg lg:text-2xl font-semibold mb-2">{row.reportTitle}</h1>
                      <p className="text-sm lg:text-lg text-[#09090B] mb-6">Reported on: {row.reportedDate}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="!text-[#025964] px-0 hover:bg-transparent max-lg:flex-1"
                        onClick={() => handleView(row.ideaId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="max-lg:flex-1"
                        onClick={() => handleHidePost(row.id, row.ideaId)}
                      >
                        Hide Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </>
      ) : (
        <div>
          <h2 className="flex text-base font-medium space-x-2 items-center">
            <TriangleAlert className="text-[#DC2626]" />
            <span>No reported ideas found</span>
          </h2>
          <p className="text-sm mt-2">
            There are no reported ideas to review at this time.
          </p>
        </div>
      )}

      {/* Confirmation Dialog for Hide Post */}
      <Dialog
        open={confirmAction === "hide"}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hide Post Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to hide this post? This action will remove
              the post from public view.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmHidePost}
              disabled={deleteIdeaMutation.isPending}
            >
              {deleteIdeaMutation.isPending ? "Processing..." : "Hide Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Block User */}
      <Dialog
        open={confirmAction === "block"}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to block this user? This action will prevent
              the user from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBlockUser}
              disabled={blockUserMutation.isPending}
            >
              {blockUserMutation.isPending ? "Processing..." : "Block User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
