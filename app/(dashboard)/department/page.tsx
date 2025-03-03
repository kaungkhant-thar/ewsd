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
import _ from "lodash";
import { Pencil, Plus, Search, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Department, departmentApi } from "./api";

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
      toast.error(error.message || "Failed to delete department");
    },
  });

  const handleEdit = (id: number) => {
    router.push(`/department/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-medium">Manage Department</h1>
        <Button>
          <Plus />
          <span>Add Department</span>
        </Button>
      </div>
      <div className="flex items-center justify-between mt-2.5 mb-6">
        <div className="relative w-96">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <Input
            value={keyword}
            className="pl-9 border-[#e4e4e7]"
            placeholder="Type to search"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Select onValueChange={setSortBy}>
          <SelectTrigger className="w-28">
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
                (a[sortBy as never] as string).localeCompare(b[sortBy as never])
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
    </div>
  );
}
