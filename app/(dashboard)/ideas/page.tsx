"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import IdeaCard from "../IdeaCard";
import { staffApi } from "../staff/api";
import { academicYearApi, categoryApi, ideaApi } from "./api";

export default function IdeaPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("createdAt");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch current academic year
  const { data: currentAY } = useQuery({
    queryKey: ["currentAcademicYear"],
    queryFn: academicYearApi.getCurrentAcademicYear,
  });

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

  const {
    data: ideasResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ideas", sortBy, category, keyword, currentPage],
    queryFn: () => ideaApi.fetchIdeas(sortBy, category, keyword, currentPage),
    placeholderData: (prev) => prev,
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: staffApi.fetchLoggedInUser,
  });

  const isReportable = user?.roleName === "staff";

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

  const { ideaList, pagination } = ideasResponse!;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isManagerView = user?.roleName === "manager";
  const isClosureDatePassed = currentAY
    ? new Date(currentAY.closureDate) < new Date()
    : true;

  console.log(isClosureDatePassed, currentAY);

  return (
    <>
      {currentAY && (
        <div className="sticky top-0 z-50 w-full bg-[#E6FCEF] rounded-[6px]">
          <div className="container flex items-center gap-x-4 h-24 px-4 sm:px-6">
            <p className="text-[#007633] text-sm font-medium">
              <span className="font-semibold">Notice:</span> <br />
              The idea posting for this academic year{" "}
              <span className="font-semibold">{currentAY.name}</span> is{" "}
              {formatDate(currentAY.startDate)} -{" "}
              {formatDate(currentAY.endDate)}
            </p>
          </div>
        </div>
      )}
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl lg:text-2xl font-medium">Ideas</h1>
          <Button
            onClick={() => {
              if (isClosureDatePassed) {
                toast.error(
                  "The idea posting for this academic year is closed"
                );
              } else {
                router.push("/ideas/new");
              }
            }}
            className="w-full sm:w-auto"
          >
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
              placeholder="Search ideas..."
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
            >
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
            <Select
              value={`${category}`}
              onValueChange={(value) => {
                setCategory(value);
                setCurrentPage(1);
              }}
            >
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
                  isReportable={isReportable}
                  currentUserId={user?.id}
                  isManagerView={isManagerView}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Showing {pagination.from} to {pagination.to} of{" "}
                {pagination.total} results
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
                  {Array.from(
                    { length: pagination.lastPage },
                    (_, i) => i + 1
                  ).map((page) => (
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
              Try adjusting your search or filters to find what you're looking
              for.
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
    </>
  );
}
