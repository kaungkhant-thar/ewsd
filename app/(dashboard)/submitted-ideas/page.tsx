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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Search, TriangleAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ideaApi, categoryApi } from "../ideas/api";
import IdeaCard from "../IdeaCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { staffApi } from "../staff/api";

export default function SubmittedIdeasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("createdAt");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const sortOptions = [
    { value: "createdAt", label: "Date" },
    { value: "popularity", label: "Popularity" },
  ];

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.fetchCategories,
  });

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.categoryName,
    })),
  ];

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: staffApi.fetchLoggedInUser,
  });

  const {
    data: ideasResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userIdeas", user?.id, sortBy, category, keyword, currentPage],
    queryFn: () => user ? ideaApi.fetchIdeasByUserId(user.id, sortBy, category, keyword, currentPage) : null,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: ideaApi.deleteIdea,
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["userIdeas"] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      setDeleteId(null);
      toast.error(error.message || "Failed to delete idea");
    },
  });

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { ideaList, pagination } = ideasResponse!;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl lg:text-2xl font-medium">My Submitted Ideas</h1>
        <Button onClick={() => router.push("/ideas/new")} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span>Submit New Idea</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            className="pl-9 w-full"
            placeholder="Search my ideas..."
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={(value) => {
            setSortBy(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={`${category}`} onValueChange={(value) => {
            setCategory(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(({ value, label }) => (
                <SelectItem key={value} value={`${value}`}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {ideaList.length && ideaList.length > 0 ? (
        <>
          <div className="space-y-6">
            {ideaList.map((idea) => (
              <IdeaCard
                key={idea.id}
                {...(idea as any)}
                isReportable={false}
                currentUserId={user.id}
                onDelete={() => setDeleteId(idea.id)}
              />
            ))}
          </div>
          
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </div>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8 p-0 text-sm sm:h-9 sm:w-9"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.lastPage}
                className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <TriangleAlert className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">No ideas found</h2>
          <p className="text-muted-foreground">
            You haven't submitted any ideas yet. Try submitting your first idea!
          </p>
        </div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              idea and all associated documents from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Idea"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
