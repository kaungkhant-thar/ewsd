"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ideaApi } from "../../api";
import { useParams, useRouter } from "next/navigation";
import { Eye, MessageCircle, Star, Tag, ThumbsDown, ThumbsUp, ArrowLeft, DownloadIcon, SquareArrowOutUpRight   } from "lucide-react";
import { BE_HOST } from "@/lib/api";
import { useStaff } from "@/hooks/use-staff";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useStaff();
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const isManager = user?.roleName === "manager";

  const { data: idea, isLoading } = useQuery({
    queryKey: ["idea", params.id],
    queryFn: () => ideaApi.fetchIdeaDetails(Number(params.id)),
  });

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

  if (isLoading || !idea) {
    return <div>Loading...</div>;
  }

  const formattedDate = new Date(idea.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  console.log(isManager)

  return (
    <div className="container max-w-5xl">
      <Link
        href="/ideas"
        className="text-sm text-muted-foreground hover:text-primary mb-4 lg:mb-8 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to ideas
      </Link>

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
                    {user?.id === idea.userId ? "You" : !isManager && idea.isAnonymous ? "Anonymous" : idea.userName}
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
              <span className="text-sm lg:text-base text-[#3F3F46]">{idea.viewCount}</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg lg:text-2xl font-semibold mb-2">{idea.title}</h1>
            <p className="text-base lg:text-lg text-[#09090B]">{idea.content}</p>
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
              <span className="text-xs sm:text-sm text-muted-foreground">{formattedDate}</span>
            </div>

            <button
            
              className={`flex items-center space-x-1.5 sm:space-x-2`}
            >
              <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base/none">{idea.totalLikes}</span>
            </button>

            <button
              className={`flex items-center space-x-1.5 sm:space-x-2`}
            >
              <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base/none">{idea.totalUnlikes}</span>
            </button>

          </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg lg:text-xl font-semibold mb-4">
          Responses ({idea.comments.length})
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
                disabled={!comment.trim() || submitCommentMutation.isPending}
              >
                {submitCommentMutation.isPending ? "Responding..." : "Respond"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {idea.comments.map((comment) => (
            <Card key={comment.id} className="bg-background">
              <CardHeader className="flex flex-row items-start space-y-0 max-lg:p-2.5 lg:pb-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="size-8">
                    <AvatarImage />
                    <AvatarFallback>
                      {comment.userId===user?.id ? "Y" : !isManager && comment.isAnonymous
                        ? "AN"
                        : comment.userName
                            .split(" ", 2)
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {comment.userId===user?.id ? "You" : !isManager && comment.isAnonymous ? "Anonymous" : comment.userName}
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
    </div>
  );
}