"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import {
  Ban,
  Clipboard,
  Eye,
  EyeOff,
  Loader2,
  MoreVertical,
  Search,
  TriangleAlert,
  Unlock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { reportedIdeaApi, User } from "./api";

// Combined interface for the reports table
interface ReportedIdeaRow {
  id: number; // reportedIdea id
  reportTitle: string; // idea title
  staffName: string; // reporting user name
  reportedDate: string; // createdAt formatted
  ideaId: number; // For reference
  userId: number; // For reference
  author: User;
}

export default function ManageIdeasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("id");
  const [keyword, setKeyword] = useState("");
  const [reportedRows, setReportedRows] = useState<
    ReportedIdeaRow[] | undefined
  >(undefined);
  const [confirmAction, setConfirmAction] = useState<
    "hide" | "block" | "unhide" | "activate" | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = [
    "id",
    "reportTitle",
    "staffName",
    "authorName",
    "reportedDate",
  ];

  // Fetch reported ideas
  const {
    data: reportedIdeas = [],
    isLoading: isLoadingReportedIdeas,
    error: reportedIdeasError,
  } = useQuery({
    queryKey: ["reportedIdeas"],
    queryFn: reportedIdeaApi.fetchReportedIdeas,
    placeholderData: (prev) => prev,
  });

  // Mutations for different actions
  const hidePostMutation = useMutation({
    mutationFn: reportedIdeaApi.hidePost,
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

  const unhidePostMutation = useMutation({
    mutationFn: reportedIdeaApi.unhidePost,
    onSuccess: () => {
      toast.success("Post unhidden successfully");
      queryClient.invalidateQueries({ queryKey: ["reportedIdeas"] });
      setConfirmAction(null);
      setSelectedId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unhide post");
      setConfirmAction(null);
      setSelectedId(null);
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: reportedIdeaApi.activateUser,
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["reportedIdeas"] });
      setConfirmAction(null);
      setSelectedId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate user");
      setConfirmAction(null);
      setSelectedId(null);
    },
  });

  // Action handlers
  const handleView = (ideaId: number) => {
    router.push(`/ideas/${ideaId}?isManagerView=true`);
  };

  const handleHidePost = (reportId: number, ideaId: number) => {
    setSelectedId(ideaId);
    setConfirmAction("hide");
  };

  const handleUnhidePost = (reportId: number, ideaId: number) => {
    setSelectedId(ideaId);
    setConfirmAction("unhide");
  };

  const handleBlockUser = (userId: number) => {
    setSelectedId(userId);
    setConfirmAction("block");
  };

  const handleActivateUser = (userId: number) => {
    setSelectedId(userId);
    setConfirmAction("activate");
  };

  const confirmHidePost = () => {
    if (selectedId) {
      hidePostMutation.mutate(selectedId);
    }
  };

  const confirmBlockUser = () => {
    if (selectedId) {
      blockUserMutation.mutate(selectedId);
    }
  };

  const confirmUnhidePost = () => {
    if (selectedId) {
      unhidePostMutation.mutate(selectedId);
    }
  };

  const confirmActivateUser = () => {
    if (selectedId) {
      activateUserMutation.mutate(selectedId);
    }
  };

  // Filter records based on search
  const filteredReportedIdeas =
    reportedIdeas
      .filter((reportedIdea) =>
        `${reportedIdea.idea.title} ${reportedIdea.reporter.userName} ${reportedIdea.author.userName} ${reportedIdea.createdAt}`
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "id") {
          return a.id - b.id;
        } else if (sortBy === "reportTitle") {
          return a.idea.title.localeCompare(b.idea.title);
        } else if (sortBy === "staffName") {
          return a.reporter.userName.localeCompare(b.reporter.userName);
        } else if (sortBy === "authorName") {
          return a.author.userName.localeCompare(b.author.userName);
        } else if (sortBy === "reportedDate") {
          return a.createdAt.localeCompare(b.createdAt);
        }
        return 0;
      }) ?? [];

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
        <h1 className="text-xl lg:text-2xl font-semibold">
          Manage Reported Ideas
        </h1>
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
          <SelectTrigger className="w-full sm:w-40">
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
      {filteredReportedIdeas.length > 0 ? (
        <>
          {/* Table view for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">ID</TableHead>
                  <TableHead>Report title</TableHead>
                  <TableHead>Reported by</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Reported Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReportedIdeas.map((reportedIdea) => (
                  <TableRow key={reportedIdea.id}>
                    <TableCell className="w-8">{reportedIdea.id}</TableCell>
                    <TableCell className="min-w-[200px]">
                      {reportedIdea.idea.title}
                    </TableCell>
                    <TableCell>{reportedIdea.reporter.userName}</TableCell>
                    <TableCell>{reportedIdea.author.userName}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(reportedIdea.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          reportedIdea.idea.isHidden ||
                          reportedIdea.author.isDisable
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {reportedIdea.author.isDisable
                          ? "Blocked"
                          : reportedIdea.idea.isHidden
                          ? "Hidden"
                          : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                            >
                              <MoreVertical className="h-4 w-4 text-[#71717a]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleView(reportedIdea.ideaId)}
                            >
                              <Clipboard className="mr-2 h-4 w-4" />
                              View Detail
                            </DropdownMenuItem>

                            {reportedIdea.idea.isHidden ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUnhidePost(
                                    reportedIdea.id,
                                    reportedIdea.ideaId
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Unhide Post
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleHidePost(
                                    reportedIdea.id,
                                    reportedIdea.ideaId
                                  )
                                }
                              >
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide Post
                              </DropdownMenuItem>
                            )}
                            {reportedIdea.author.isDisable ? (
                              <DropdownMenuItem
                                className="!text-brand"
                                onClick={() =>
                                  handleActivateUser(reportedIdea.author.id)
                                }
                              >
                                <Unlock className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="!text-destructive"
                                onClick={() =>
                                  handleBlockUser(reportedIdea.author.id)
                                }
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Block User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card view for mobile screens */}
          <div className="sm:hidden space-y-4">
            {filteredReportedIdeas.map((reportedIdea) => (
              <Card
                key={reportedIdea.id}
                className="bg-[#F9FBFD] border border-[#D1D9E2]"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 lg:px-5 lg:py-4">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-2 py-1.5 lg:py-2 px-2 lg:px-4 bg-muted/50"
                    >
                      <span className="text-xs lg:text-sm font-semibold text-primary">
                        ID: {reportedIdea.id}
                      </span>
                    </Badge>
                    <div>
                      <p className="text-sm">
                        Reported by{" "}
                        <span className="font-semibold">
                          {reportedIdea.reporter.userName}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-2.5 lg:px-5 lg:pt-6 space-y-2 lg:space-y-6">
                  <div>
                    <h1 className="text-lg lg:text-2xl font-semibold mb-2">
                      {reportedIdea.idea.title}
                    </h1>
                    <p className="text-sm lg:text-base text-[#09090B]">
                      Author:{" "}
                      <span className="font-medium">
                        {reportedIdea.author.userName}
                      </span>
                    </p>
                    <p className="text-sm lg:text-base text-[#09090B]">
                      Email:{" "}
                      <span className="font-medium">
                        {reportedIdea.author.email}
                      </span>
                    </p>
                    <p className="text-sm lg:text-base text-[#09090B]">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          reportedIdea.idea.isHidden ||
                          reportedIdea.author.isDisable
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {reportedIdea.author.isDisable
                          ? "Blocked"
                          : reportedIdea.idea.isHidden
                          ? "Hidden"
                          : "Active"}
                      </span>
                    </p>
                    <p className="text-sm lg:text-lg text-[#09090B] mb-6">
                      Reported on: {reportedIdea.createdAt}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="h-4 w-4 text-[#71717a]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleView(reportedIdea.ideaId)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleHidePost(reportedIdea.id, reportedIdea.ideaId)
                          }
                        >
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide Post
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUnhidePost(
                              reportedIdea.id,
                              reportedIdea.ideaId
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Unhide Post
                        </DropdownMenuItem>
                        {reportedIdea.author.isDisable ? (
                          <DropdownMenuItem
                            className="!text-brand"
                            onClick={() =>
                              handleActivateUser(reportedIdea.author.id)
                            }
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="!text-destructive"
                            onClick={() =>
                              handleBlockUser(reportedIdea.author.id)
                            }
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh]">
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
              disabled={hidePostMutation.isPending}
            >
              {hidePostMutation.isPending ? "Processing..." : "Hide Post"}
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

      {/* Confirmation Dialog for Unhide Post */}
      <Dialog
        open={confirmAction === "unhide"}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unhide Post Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to unhide this post? This action will make
              the post visible to the public again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmUnhidePost}
              disabled={unhidePostMutation.isPending}
            >
              {unhidePostMutation.isPending ? "Processing..." : "Unhide Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Activate User */}
      <Dialog
        open={confirmAction === "activate"}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate User Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to activate this user? This action will
              restore the user's access to the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmActivateUser}
              disabled={activateUserMutation.isPending}
            >
              {activateUserMutation.isPending
                ? "Processing..."
                : "Activate User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
