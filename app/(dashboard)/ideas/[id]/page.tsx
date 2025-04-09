"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useStaff } from "@/hooks/use-staff";
import { BE_HOST } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Ban,
  DownloadIcon,
  Eye,
  EyeOff,
  Flag,
  Loader2,
  SquareArrowOutUpRight,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Unlock,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { reportedIdeaApi } from "../../reported-ideas/api";
import { academicYearApi, ideaApi } from "../api";

// Add this interface to extend IdeaDetail with additional properties
interface ExtendedIdeaDetail {
  isHidden?: boolean;
  isUserBlocked?: boolean;
}

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useStaff();
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "hide" | "block" | "unhide" | "activate" | null
  >(null);

  const isManager = user?.roleName === "manager";
  const isManagerView = searchParams.get("isManagerView") === "true";
  const isUserBlocked = user?.isDisable;

  const { data: idea, isLoading } = useQuery({
    queryKey: ["idea", params.id],
    queryFn: () => ideaApi.fetchIdeaDetails(Number(params.id)),
  });

  const { data: currentAY } = useQuery({
    queryKey: ["currentAcademicYear"],
    queryFn: academicYearApi.getCurrentAcademicYear,
  });

  const isFinalClosureDatePassed = currentAY
    ? new Date(currentAY.finalClosureDate) < new Date()
    : true;

  const submitCommentMutation = useMutation({
    mutationFn: () =>
      ideaApi.submitComment(Number(params.id), comment, user!.id, isAnonymous),
    onSuccess: () => {
      toast.success("Comment submitted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["idea", params.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit comment");
    },
  });

  const reportMutation = useMutation({
    mutationFn: () => reportedIdeaApi.reportIdea(user!.id, Number(params.id)),
    onSuccess: () => {
      toast.success("Idea reported successfully");
      setShowReportDialog(false);
      queryClient.invalidateQueries({ queryKey: ["idea", params.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to report idea");
      setShowReportDialog(false);
    },
  });

  const hidePostMutation = useMutation({
    mutationFn: reportedIdeaApi.hidePost,
    onSuccess: () => {
      toast.success("Post hidden successfully");
      queryClient.invalidateQueries({ queryKey: ["idea", params.id] });
      setConfirmAction(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to hide post");
      setConfirmAction(null);
    },
  });

  const unhidePostMutation = useMutation({
    mutationFn: reportedIdeaApi.unhidePost,
    onSuccess: () => {
      toast.success("Post unhidden successfully");
      queryClient.invalidateQueries({ queryKey: ["idea", params.id] });
      setConfirmAction(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unhide post");
      setConfirmAction(null);
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: reportedIdeaApi.blockUser,
    onSuccess: () => {
      toast.success("User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["idea", params.id] });
      setConfirmAction(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to block user");
      setConfirmAction(null);
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: reportedIdeaApi.activateUser,
    onSuccess: () => {
      toast.success("User activated successfully");
      queryClient.invalidateQueries({ queryKey: ["idea", params.id] });
      setConfirmAction(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to activate user");
      setConfirmAction(null);
    },
  });

  const handleReport = () => {
    setShowReportDialog(true);
  };

  const confirmHidePost = () => {
    hidePostMutation.mutate(Number(params.id));
  };

  const confirmUnhidePost = () => {
    unhidePostMutation.mutate(Number(params.id));
  };

  const confirmBlockUser = () => {
    blockUserMutation.mutate(idea!.userId);
  };

  const confirmActivateUser = () => {
    activateUserMutation.mutate(idea!.userId);
  };

  if (isLoading || !idea) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl">
      <div className="flex justify-between items-center mb-4 lg:mb-8">
        <Button size="sm" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        {isManagerView ? (
          <div className="flex gap-2">
            {(idea as any).isHidden ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmAction("unhide")}
              >
                <Eye className="h-4 w-4 mr-1" />
                Unhide Post
              </Button>
            ) : (
              <Button
                size="sm"
                variant="destructiveOutline"
                onClick={() => setConfirmAction("hide")}
              >
                <EyeOff className="h-4 w-4 mr-1" />
                Hide Post
              </Button>
            )}
            {idea.userIsDisable ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmAction("activate")}
                className="!text-brand border-brand hover:bg-brand/10"
              >
                <Unlock className="h-4 w-4 mr-1" />
                Activate User
              </Button>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmAction("block")}
              >
                <Ban className="h-4 w-4 mr-1" />
                Block User
              </Button>
            )}
          </div>
        ) : (
          user?.id !== idea.userId && (
            <Button
              size="sm"
              variant="destructiveOutline"
              onClick={handleReport}
            >
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          )
        )}
      </div>

      <Card className="bg-[#F9FBFD] border border-[#D1D9E2]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 lg:px-5 lg:py-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>
                {!isManager && idea.isAnonymous
                  ? "AN"
                  : idea.userName
                      .split(" ", 2)
                      .map((n) => n[0])
                      .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                Posted by{" "}
                <span className="font-semibold">
                  {user?.id === idea.userId
                    ? "You"
                    : !isManager && idea.isAnonymous
                    ? "Anonymous"
                    : idea.userName}
                </span>
              </p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-2.5 lg:px-5 lg:pt-6 space-y-2 lg:space-y-6">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="flex items-center gap-2 py-1.5 lg:py-2 px-2 lg:px-4 bg-muted/50"
            >
              <Tag className="size-3.5 text-primary" />
              <span className="text-xs lg:text-sm font-semibold text-primary">
                {idea.categoryName}
              </span>
            </Badge>
            <div className="flex items-center gap-2">
              <Eye className="size-6" />
              <span className="text-sm lg:text-base text-[#3F3F46]">
                {idea.viewCount}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-lg lg:text-2xl font-semibold mb-2">
              {idea.title}
            </h1>
            <p className="text-base lg:text-lg text-[#09090B]">
              {idea.content}
            </p>
          </div>

          {idea.ideaDocuments.length > 0 && (
            <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-1 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
              {idea.ideaDocuments.map(({ id, publicFileUrl }) => {
                const isPDF = publicFileUrl.endsWith(".pdf");
                return (
                  <div
                    key={id}
                    className="object-cover w-full max-w-[200px] sm:max-w-80 rounded-xl overflow-hidden relative group border border-slate-200 flex-shrink-0"
                  >
                    {isPDF ? (
                      <iframe
                        src={`${BE_HOST}${publicFileUrl}`}
                        className="size-full"
                      />
                    ) : (
                      <img
                        src={`${BE_HOST}${publicFileUrl}`}
                        className="object-cover size-full"
                      />
                    )}
                    <div
                      role="button"
                      className="absolute top-1.5 right-1.5 flex space-x-1 z-10"
                    >
                      <a
                        href={`${BE_HOST}${publicFileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-slate-200 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <SquareArrowOutUpRight className="size-3" />
                      </a>
                      {/* Download not work since it's cross origin */}
                      <a
                        href={`${BE_HOST}${publicFileUrl}`}
                        download
                        className="bg-white border border-slate-200 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <DownloadIcon className="size-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap items-center pt-2 space-x-4 sm:space-x-8 text-[#3F3F46] px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 stroke-none" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {formatDate(idea.createdAt)}
            </span>
          </div>

          <button className={`flex items-center space-x-1.5 sm:space-x-2`}>
            <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base/none">{idea.totalLikes}</span>
          </button>

          <button className={`flex items-center space-x-1.5 sm:space-x-2`}>
            <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base/none">
              {idea.totalUnlikes}
            </span>
          </button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg lg:text-xl font-semibold mb-4">
          Comments ({idea.comments.length})
        </h2>

        <Card className="bg-background mb-8">
          <CardContent className="max-lg:p-2.5 lg:pt-6">
            <Textarea
              placeholder="Enter a description..."
              className="min-h-[100px] mb-4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Comment as an anonymous
                </label>
              </div>
              <Button
                onClick={() => submitCommentMutation.mutate()}
                disabled={
                  submitCommentMutation.isPending ||
                  isUserBlocked ||
                  isFinalClosureDatePassed
                }
                className="bg-[#0F766E] hover:bg-[#0B5854]"
              >
                {submitCommentMutation.isPending ? "Commenting..." : "Comment"}
              </Button>
            </div>
            {isFinalClosureDatePassed ? (
              <p className="text-red-500 text-sm mt-4">
                The commenting for this academic year is closed. Please
                contact admin for assistance.
              </p>
            ) : isUserBlocked ? (
              <p className="text-red-500 text-sm mt-4">
                Your account is blocked. Please contact admin for assistance.
              </p>
            ) : (
              ""
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {idea.comments.filter((comment) => !comment.userIsDisable).map((comment) => (
            <Card key={comment.id} className="bg-background">
              <CardHeader className="flex flex-row items-start space-y-0 max-lg:p-2.5 lg:pb-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="size-8">
                    <AvatarImage />
                    <AvatarFallback>
                      {comment.userId === user?.id
                        ? "Y"
                        : !isManager && comment.isAnonymous
                        ? "AN"
                        : comment.userName
                            .split(" ", 2)
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {comment.userId === user?.id
                        ? "You"
                        : !isManager && comment.isAnonymous
                        ? "Anonymous"
                        : comment.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="max-lg:p-2.5">
                <p className="text-sm">{comment.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-4">Report Idea</DialogTitle>
            <DialogDescription>
              We will conduct a thorough review of the Community Guidelines to
              assess whether the reported content or activity violates our
              policies and warrants action.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => reportMutation.mutate()}
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? "Reporting..." : "Report Idea"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
