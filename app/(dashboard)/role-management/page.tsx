"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function StaffManagementPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#18181b]">
          Manage Staff Role
        </h2>
        <Button
          onClick={() => redirect("/role-management/new")}
          className="bg-[#025964] hover:bg-[#025964]/90"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add staff
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 flex justify-between items-center border-b border-[#e4e4e7]">
          <div className="relative w-[300px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
            <Input
              placeholder="Type a command or search..."
              className="pl-9 border-[#e4e4e7]"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="role">Role</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Role Name</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>1</TableCell>
                  <TableCell>Thet Aung Tun</TableCell>
                  <TableCell>Lorem ipsum</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4 text-[#71717a]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-[#df1212]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
