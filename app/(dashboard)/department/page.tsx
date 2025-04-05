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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { Loader2, Pencil, Plus, Search, Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { departmentApi } from "./api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DepartmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("id");
  const [keyword, setKeyword] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns = ["id", "departmentName", "remark"];

  const {
    data: departments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentApi.fetchDepartments,
  });

  const filteredRecords =
    departments?.filter((dept) =>
      Object.values(dept).some((value) =>
        String(value).toLowerCase().includes(keyword.toLowerCase())
      )
    ) ?? [];

  const deleteMutation = useMutation({
    mutationFn: departmentApi.deleteDepartment,
    onSuccess: () => {
      toast.success("Department deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      setDeleteId(null)
      toast.error(error.message || "Failed to delete department");
    },
  });

  const handleEdit = (id: number) => {
    router.push(`/department/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <h1 className="text-xl lg:text-2xl font-semibold">Manage Department</h1>
        <Button onClick={() => router.push('/department/new')} className="w-full sm:w-auto">
          <Plus />
          <span>Add Department</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2.5 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <Input
            value={keyword}
            className="pl-9 border-[#e4e4e7] w-full"
            placeholder="Type to search"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Select onValueChange={setSortBy} defaultValue="id">
          <SelectTrigger className="w-full sm:w-28">
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
      {filteredRecords.length > 0 ? (
        <>
          {/* Table view for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords
                  .sort((a, b) =>
                    (`${a[sortBy as never]}`).localeCompare(`${b[sortBy as never]}`)
                  )
                  .map(({ id, departmentName, remark }, i) => (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{departmentName}</TableCell>
                      <TableCell>{remark}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            onClick={() => handleEdit(id)}
                          >
                            <Pencil className="h-4 w-4 text-[#71717a]" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            onClick={() => handleDelete(id)}
                          >
                            <Trash2 className="h-4 w-4 text-[#df1212]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Card view for mobile screens */}
          <div className="sm:hidden space-y-4">
            {filteredRecords
              .sort((a, b) =>
                (`${a[sortBy as never]}`).localeCompare(`${b[sortBy as never]}`)
              )
              .map(({ id, departmentName, remark }) => (
                <Card key={id} className="bg-[#F9FBFD] border border-[#D1D9E2]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 lg:px-5 lg:py-4">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 py-1.5 lg:py-2 px-2 lg:px-4 bg-muted/50"
                      >
                        <span className="text-xs lg:text-sm font-semibold text-primary">
                          ID: {id}
                        </span>
                      </Badge>
                      <div>
                        <h3 className="text-sm lg:text-base font-semibold">{departmentName}</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-2.5 lg:px-5 lg:pt-6 space-y-2 lg:space-y-6">
                    <div>
                      <p className="text-sm lg:text-base text-[#09090B]">
                        <span className="font-medium">Remark:</span> {remark}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="!text-[#71717a] px-0 hover:bg-transparent max-lg:flex-1"
                        onClick={() => handleEdit(id)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        <span className="text-xs">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="max-lg:flex-1"
                        onClick={() => handleDelete(id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </>
      ) : (
        <div>
          <h2 className="flex text-base font-medium space-x-2 items-center">
            <TriangleAlert className="text-[#DC2626]" />
            <span>No exact matches found</span>
          </h2>
          <p className="text-sm mt-2">
            Keep trying! Double-check the spelling or try a broader search.
          </p>
        </div>
      )}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              department and remove your data from our servers.
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
              {deleteMutation.isPending ? "Deleting..." : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
