import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  MessageCircle,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  MoreHorizontal,
  SquareArrowOutUpRight,
  DownloadIcon,
  Flag,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ideaApi, reactionApi } from "./submitted-ideas/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { BE_HOST } from "@/lib/api";
import { useRouter } from "next/navigation";

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

  console.log(currentUserReaction);

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
      router.push(`/ideas/detail/${id}`);
    }
  };

  return (
    <>
      <div onClick={handleCardClick}>
        <Card
          ref={cardRef}
          className="mx-auto bg-[#F9FBFD] border border-[#D1D9E2] hover:shadow-md transition-shadow cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 py-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage />
                <AvatarFallback>
                  {isAnonymous
                    ? "AN"
                    : userName
                        .split(" ", 2)
                        .map((n) => n[0])
                        .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">
                  Posted by{" "}
                  <span className="font-semibold">
                    {isAnonymous ? "Anonymous" : userName}
                  </span>
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
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
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="flex items-center gap-2 py-2 px-4 bg-muted/50"
              >
                <Tag className="size-3.5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {categoryName}
                </span>
              </Badge>
              <div className="flex items-center gap-2">
                <Eye className="size-6" />
                <span className="text-base text-[#3F3F46]">{viewCount}</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-2">{title}</h1>
              <p className="text-base text-[#09090B]">{content}</p>
            </div>

            {ideaDocuments.length > 0 && (
              <div className="flex space-x-4 overflow-x-auto">
                {ideaDocuments.map(({ id, publicFileUrl }) => {
                  const isPDF = publicFileUrl.endsWith(".pdf");
                  return (
                    <div
                      key={id}
                      className="object-cover w-full max-w-80 rounded-xl overflow-hidden relative group border border-slate-200"
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
                        className="absolute top-1.5 right-1.5 flex space-x-1 z-10 "
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
          <CardFooter className="flex items-center pt-2 space-x-8 text-[#3F3F46]">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 fill-yellow-400 stroke-none" />
              <span className="text-muted-foreground">{formattedDate}</span>
            </div>

            <button
              onClick={() => handleReaction("like")}
              className={`flex items-center space-x-2 ${
                currentUserReaction?.reaction === "like" ? "text-blue-500" : ""
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="text-base/none">{totalLikes}</span>
            </button>

            <button
              onClick={() => handleReaction("unlike")}
              className={`flex items-center space-x-2 ${
                currentUserReaction?.reaction === "unlike" ? "text-red-500" : ""
              }`}
            >
              <ThumbsDown className="h-5 w-5" />
              <span className="text-base/none">{totalUnlikes}</span>
            </button>

            <button
              onClick={() => {
                console.log("clicked");
              }}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-base/none">{commentsCount}</span>
            </button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
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
        <DialogContent>
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
