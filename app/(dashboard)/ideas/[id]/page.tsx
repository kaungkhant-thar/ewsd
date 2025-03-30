"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ideaApi } from "../api";
import { useParams, useRouter } from "next/navigation";
import { Eye, ThumbsDown, ThumbsUp } from "lucide-react";
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

  const { data: idea, isLoading } = useQuery({
    queryKey: ["idea", params.id],
    queryFn: () => ideaApi.fetchIdeaDetails(Number(params.id)),
  });

  const submitCommentMutation = useMutation({
    mutationFn: () =>
      ideaApi.submitComment(Number(params.id), comment, user!.id, false),
    onSuccess: () => {
      toast.success("Comment submitted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["idea", params.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit comment");
    },
  });

  const hidePostMutation = useMutation({
    mutationFn: () => ideaApi.deleteIdea(Number(params.id)),
    onSuccess: () => {
      toast.success("Post hidden successfully");
      router.push("/ideas");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to hide post");
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: () => ideaApi.blockUser(idea?.userId || 0),
    onSuccess: () => {
      toast.success("User blocked successfully");
      router.push("/ideas");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to block user");
    },
  });

  if (isLoading || !idea) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-5xl py-8">
      <Link
        href="/ideas"
        className="text-sm text-muted-foreground hover:text-primary mb-8 block"
      >
        ← Back to ideas
      </Link>

      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className="bg-[#E5F6F3] text-[#0F766E] border-none">
          {idea.categoryName}
        </Badge>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{idea.viewCount}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{idea.title}</h1>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => hidePostMutation.mutate()}
              disabled={hidePostMutation.isPending}
            >
              Hide post
            </Button>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => blockUserMutation.mutate()}
              disabled={blockUserMutation.isPending}
            >
              Block user
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage />
            <AvatarFallback>
              {idea.userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="text-sm">Posted by</span>
            <span className="text-sm font-medium">{idea.userName}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {new Date(idea.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p>{idea.content}</p>
        </div>

        {idea.ideaDocuments.length > 0 && (
          <div className="mt-4">
            {idea.ideaDocuments.map(({ id, publicFileUrl }) => (
              <div key={id} className="rounded-lg overflow-hidden">
                <img
                  src={`${BE_HOST}${publicFileUrl}`}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
            <span>{idea.totalLikes}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown className="h-5 w-5" />
            <span>{idea.totalUnlikes}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">
          Responses ({idea.comments.length})
        </h2>

        <div className="mb-6">
          <Textarea
            placeholder="Enter a description..."
            className="min-h-[100px] mb-4 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => submitCommentMutation.mutate()}
              disabled={!comment.trim() || submitCommentMutation.isPending}
              className="bg-[#0F766E] hover:bg-[#0B5854]"
            >
              {submitCommentMutation.isPending ? "Responding..." : "Respond"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {idea.comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage />
                  <AvatarFallback>
                    {comment.userName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {comment.userName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm">{comment.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}