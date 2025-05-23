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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useStaff } from "@/hooks/use-staff";
import { BE_HOST } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  DownloadIcon,
  Eye,
  EyeOff,
  Flag,
  MessageCircle,
  MoreHorizontal,
  SquareArrowOutUpRight,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ideaApi, reactionApi } from "./submitted-ideas/api";

interface IdeaDocument {
  id: number;
  fileName: string;
  publicFileUrl: string;
  ideaId: number;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Reaction {
  id: number;
  userId: number;
  ideaId: number;
  reaction: "like" | "unlike";
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IdeaProps {
  id: number;
  title: string;
  content: string;
  isManagerView: boolean;
  isAnonymous: boolean;
  viewCount: number;
  popularity: number;
  userId: number;
  userName: string;
  categoryId: number;
  academicYearId: number;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  ideaDocuments: IdeaDocument[];
  currentUserId?: number;
  totalLikes: number;
  totalUnlikes: number;
  commentsCount: number;
}

export default function IdeaCard({
  id,
  title,
  content,
  viewCount,
  isAnonymous,
  isManagerView,
  categoryName,
  ideaDocuments,
  popularity,
  userName,
  userId,
  createdAt,
  currentUserId,
  totalLikes,
  totalUnlikes,
  commentsCount,
  ...rest
}: IdeaProps) {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const viewTimerRef = useRef<NodeJS.Timeout>(null);
  const hasViewedRef = useRef(false);

  // Fetch reactions for this idea
  const { data: reactions = [] } = useQuery({
    queryKey: ["reactions", id],
    queryFn: () => reactionApi.getReactionsByIdeaId(id),
  });

  // Get current user's reaction
  const currentUserReaction = reactions.find(
    (r) => r.user_id === currentUserId
  );

  const deleteMutation = useMutation({
    mutationFn: ideaApi.deleteIdea,
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete idea");
      setShowDeleteDialog(false);
    },
  });

  const reportMutation = useMutation({
    mutationFn: () => {
      if (!currentUserId) {
        throw new Error("You must be logged in to report an idea");
      }
      return reactionApi.reportIdea({
        userId: currentUserId,
        ideaId: id,
      });
    },
    onSuccess: () => {
      toast.success("Idea reported successfully");
      setShowReportDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to report idea");
      setShowReportDialog(false);
    },
  });

  const viewMutation = useMutation({
    mutationFn: () => ideaApi.increaseViewCount(id),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record view");
    },
  });

  const reactionMutation = useMutation({
    mutationFn: ({ reaction }: { reaction: "like" | "unlike" }) =>
      reactionApi.createReaction(id, currentUserId!, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", id] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to react to idea");
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasViewedRef.current) {
            // Start timer when post enters viewport
            viewTimerRef.current = setTimeout(() => {
              viewMutation.mutate();
              hasViewedRef.current = true;
            }, 500);
          } else if (!entry.isIntersecting && viewTimerRef.current) {
            // Clear timer if post leaves viewport before 1s
            clearTimeout(viewTimerRef.current);
          }
        });
      },
      {
        threshold: 0.5, // 50% of the element must be visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
      }
      observer.disconnect();
    };
  }, [id]);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isOwnIdea = currentUserId === userId;

  const handleReaction = (reaction: "like" | "unlike") => {
    if (!currentUserId) {
      toast.error("Please login to react to ideas");
      return;
    }

    // If user already reacted with the same reaction, do nothing
    if (currentUserReaction?.reaction === reaction) {
      return;
    }

    reactionMutation.mutate({ reaction });
  };

  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements

    console.log(e.target);

    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a") ||
      (e.target as HTMLElement).closest('[role="button"]') ||
      (e.target as HTMLElement).closest('[id="prevent"]')
    ) {
      // e.preventDefault();
    } else {
      router.push(`/ideas/${id}`);
    }
  };

  return (
    <>
      <div onClick={handleCardClick}>
        <Card
          ref={cardRef}
          className="mx-auto bg-[#F9FBFD] border border-[#D1D9E2] hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage />
                <AvatarFallback>
                  {!isManagerView && isAnonymous
                    ? "AN"
                    : userName
                        .split(" ", 2)
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs sm:text-sm">
                  Posted by{" "}
                  <span className="font-semibold">
                    {!isManagerView && isAnonymous ? "Anonymous" : userName}
                  </span>
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isOwnIdea && (
                  <DropdownMenuItem
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowReportDialog(true);
                    }}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Idea
                  </DropdownMenuItem>
                )}
                {isOwnIdea && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Idea
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 px-4 sm:px-5">
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-0">
              <Badge
                variant="outline"
                className="flex items-center gap-2 py-1.5 sm:py-2 px-3 sm:px-4 bg-muted/50 w-fit"
              >
                <Tag className="size-3 sm:size-3.5 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  {categoryName}
                </span>
              </Badge>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Eye className="size-5 sm:size-6" />
                <span className="text-sm sm:text-base text-[#3F3F46]">
                  {viewCount}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-[#09090B]">{content}</p>
            </div>

            {ideaDocuments.length > 0 && (
              <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-1 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
                {ideaDocuments.map(({ id, publicFileUrl }) => {
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
                {formattedDate}
              </span>
            </div>

            <button
              onClick={() => handleReaction("like")}
              className={`flex items-center space-x-1.5 sm:space-x-2 ${
                currentUserReaction?.reaction === "like" ? "text-blue-500" : ""
              }`}
            >
              <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base/none">{totalLikes}</span>
            </button>

            <button
              onClick={() => handleReaction("unlike")}
              className={`flex items-center space-x-1.5 sm:space-x-2 ${
                currentUserReaction?.reaction === "unlike" ? "text-red-500" : ""
              }`}
            >
              <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base/none">{totalUnlikes}</span>
            </button>

            <button
              onClick={() => {
                console.log("clicked");
              }}
              className="flex items-center space-x-1.5 sm:space-x-2"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base/none">{commentsCount}</span>
            </button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-4">Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              idea and all associated documents from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Idea"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-4">Report ?</DialogTitle>
            <DialogDescription>
              We will conduct a thorough review of the Community Guidelines to
              assess whether the reported content or activity violates our
              policies and warrants a ban
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
    </>
  );
}
