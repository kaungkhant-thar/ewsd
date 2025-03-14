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
import { Loader2, Plus, Search, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ideaApi,categoryApi } from "./api";
import IdeaCard from "../IdeaCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function IdeaPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("createdAt");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const sortOptions = [
    { value: "createdAt", label: "Date" },
    { value: "viewCount", label: "Views" },
    { value: "popularity", label: "Popularity" },
    { value: "title", label: "Title" },
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

  const {
    data: ideasResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ideas"],
    refetchInterval: 1000,
    queryFn: ideaApi.fetchIdeas,
  });

  const filteredRecords =
    ideasResponse?.ideaList.filter((idea) => {
      const matchesKeyword = Object.values(idea).some((value) =>
        String(value).toLowerCase().includes(keyword.toLowerCase())
      );
      const matchesCategory = category === "all" || idea.categoryId === parseInt(category);
      return matchesKeyword && matchesCategory;
    }) ?? [];

  const deleteMutation = useMutation({
    mutationFn: ideaApi.deleteIdea,
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      setDeleteId(null);
      toast.error(error.message || "Failed to delete idea");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Ideas</h1>
        <Button onClick={() => router.push("/ideas/new")}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Submit New Idea</span>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            className="pl-9"
            placeholder="Search ideas..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
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
        <Select value={`${category}`} onValueChange={setCategory}>
          <SelectTrigger className="w-60">
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

      {filteredRecords.length > 0 ? (
        <div className="space-y-6">
          {filteredRecords
            .sort((a, b) => {
              if (sortBy === "createdAt") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              }
              return String(a[sortBy as keyof typeof a]).localeCompare(
                String(b[sortBy as keyof typeof b])
              );
            })
            .map((idea) => (
              <IdeaCard
                key={idea.id}
                {...idea as any}
                // onDelete={() => setDeleteId(idea.id)}
              />
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <TriangleAlert className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">No ideas found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
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
