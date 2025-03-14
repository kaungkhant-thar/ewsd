import Image from "next/image";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ideaApi } from "./ideas/api";
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

interface IdeaDocument {
  id: number;
  fileName: string;
  publicFileUrl: string;
  ideaId: number;
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
  createdAt,
  ...rest
}: IdeaProps) {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const viewTimerRef = useRef<NodeJS.Timeout>(null);
  const hasViewedRef = useRef(false);

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
    mutationFn: ideaApi.reportIdea,
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

  return (
    <>
      <Card ref={cardRef} className="mx-auto bg-[#F9FBFD] border border-[#D1D9E2]">
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
              <DropdownMenuItem 
                onClick={() => setShowReportDialog(true)}
              >
                <Flag className="h-4 w-4 mr-2" />
                Report Idea
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Idea
              </DropdownMenuItem>
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
                        src={`http://localhost${publicFileUrl}`}
                        className="size-full"
                      />
                    ) : (
                      <img
                        src={`http://localhost${publicFileUrl}`}
                        className="object-cover size-full"
                      />
                    )}
                    <div className="absolute top-1.5 right-1.5 flex space-x-1 z-10 ">
                      <a
                        href={`http://localhost${publicFileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-slate-200 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <SquareArrowOutUpRight className="size-3" />
                      </a>
                      {/* Download not work since it's cross origin */}
                      <a
                        href={`http://localhost${publicFileUrl}`}
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
            onClick={() => {
              console.log("clicked");
            }}
            className="flex items-center space-x-2"
          >
            <ThumbsUp className="h-5 w-5" />
            <span className="text-base/none">{popularity}</span>
          </button>

          <button
            onClick={() => {
              console.log("clicked");
            }}
            className="flex items-center space-x-2"
          >
            <ThumbsDown className="h-5 w-5" />
            <span className="text-base/none">0</span>
          </button>

          <button
            onClick={() => {
              console.log("clicked");
            }}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-base/none">0</span>
          </button>
        </CardFooter>
      </Card>

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
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
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
              We will conduct a thorough review of the Community Guidelines to assess whether the reported content or activity violates our policies and warrants a ban
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => reportMutation.mutate(id)}
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
