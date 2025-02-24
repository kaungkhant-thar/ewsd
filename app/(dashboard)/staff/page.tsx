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
import Link from "next/link";
import { useState } from "react";

const records = [
  {
    id: "1",
    username: "Thet Aung Tun",
    email: "testing@gmail.com",
    number: "09123456",
    role: "QA manager",
    department: "QA Department",
    remark: "Lorem ipsum",
  },
  {
    id: "2",
    username: "Thet Aung Tun",
    email: "testing@gmail.com",
    number: "09123456",
    role: "QA manager",
    department: "QA Department",
    remark: "Lorem ipsum",
  },
  {
    id: "3",
    username: "Thet Aung Tun",
    email: "testing@gmail.com",
    number: "09123456",
    role: "QA manager",
    department: "QA Department",
    remark: "Lorem ipsum",
  },
  {
    id: "4",
    username: "Thet Aung Tun",
    email: "testing@gmail.com",
    number: "09123456",
    role: "QA manager",
    department: "QA Department",
    remark: "Lorem ipsum",
  },
  {
    id: "5",
    username: "Thet Aung Tun",
    email: "testing@gmail.com",
    number: "09123456",
    role: "QA manager",
    department: "QA Department",
    remark: "Lorem ipsum",
  },
];

const columns = [
  "id",
  "username",
  "email",
  "number",
  "role",
  "department",
  "remark",
];

export default function DepartmentPage() {
  const [sortBy, setSortBy] = useState(columns[0]);
  const [keyword, setKeyword] = useState("");

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(keyword.toLowerCase())
    )
  );

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-medium">Manage Staff</h1>
        <Button asChild>
          <Link href="/staff/add">
            <Plus />
            <span>Add Staff</span>
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between mt-2.5 mb-6">
        <div className="relative w-96">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <Input
            value={keyword}
            className="pl-9 border-[#e4e4e7]"
            placeholder="Type a command or search..."
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
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Role</TableHead>
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
              .map(
                ({ id, username, email, number, role, department, remark }) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{username}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{number}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell>{department}</TableCell>
                    <TableCell>{remark}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Link href={`/staff/${1}`}>
                            <Pencil className="h-4 w-4 text-[#71717a]" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Trash2 className="h-4 w-4 text-[#df1212]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
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
