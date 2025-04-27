'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import _ from 'lodash';
import { Loader2, Pencil, Plus, Search, Trash2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Staff } from './api';
import { staffApi } from './api';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Role, roleApi } from '../staff-role/api';
import { Department, departmentApi } from '../department/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const columns = ['id', 'userName', 'email', 'phoneNo', 'roleId', 'departmentId', 'remark'];

export default function StaffPage() {
  const [sortBy, setSortBy] = useState(columns[0]);
  const [keyword, setKeyword] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: roleApi.fetchRoles,
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: departmentApi.fetchDepartments,
  });

  const {
    data: staffs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['staffs'],
    queryFn: staffApi.fetchStaffs,
  });

  const deleteMutation = useMutation({
    mutationFn: staffApi.deleteStaff,
    onSuccess: () => {
      toast.success('Staff member deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete staff member');
    },
  });

  const filteredRecords = staffs.filter((staff) =>
    Object.values(staff).some((value) => String(value).toLowerCase().includes(keyword.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-red-600">
        <TriangleAlert className="mr-2" />
        <span>{(error as Error).message || 'An error occurred'}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <h1 className="text-xl lg:text-2xl font-semibold">Manage Staff</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/staff/add">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Staff</span>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2.5 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <Input
            value={keyword}
            className="pl-9 border-[#e4e4e7] w-full"
            placeholder="Type to search..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
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
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone No</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords
                  .sort((a, b) => {
                    if (sortBy === 'id') {
                      return Number(a[sortBy]) - Number(b[sortBy]);
                    }
                    return String(a[sortBy as keyof Staff]).localeCompare(String(b[sortBy as keyof Staff]));
                  })
                  .map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>{staff.id}</TableCell>
                      <TableCell>{staff.userName}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.phoneNo}</TableCell>
                      <TableCell>{roles.find((role) => role.id === staff.roleId)?.roleName}</TableCell>
                      <TableCell>
                        {departments.find((department) => department.id === staff.departmentId)?.departmentName}
                      </TableCell>
                      <TableCell>{staff.remark || '--'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="icon" className="size-8">
                            <Link href={`/staff/${staff.id}`}>
                              <Pencil className="h-4 w-4 text-[#71717a]" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => setDeleteId(staff.id)}>
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
          <div className="lg:hidden space-y-4">
            {filteredRecords
              .sort((a, b) => {
                if (sortBy === 'id') {
                  return Number(a[sortBy]) - Number(b[sortBy]);
                }
                return String(a[sortBy as keyof Staff]).localeCompare(String(b[sortBy as keyof Staff]));
              })
              .map((staff) => {
                const roleName = roles.find((role) => role.id === staff.roleId)?.roleName;
                const departmentName = departments.find(
                  (department) => department.id === staff.departmentId
                )?.departmentName;

                return (
                  <Card key={staff.id} className="bg-[#F9FBFD] border border-[#D1D9E2]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 lg:px-5 lg:py-4">
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-2 py-1.5 lg:py-2 px-2 lg:px-4 bg-muted/50"
                        >
                          <span className="text-xs lg:text-sm font-semibold text-primary">ID: {staff.id}</span>
                        </Badge>
                        <div>
                          <h3 className="text-sm lg:text-base font-semibold">{staff.userName}</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-2.5 lg:px-5 lg:pt-6 space-y-2 lg:space-y-6">
                      <div className="space-y-1">
                        <p className="text-sm lg:text-base text-[#09090B]">
                          <span className="font-medium">Email:</span> {staff.email}
                        </p>
                        <p className="text-sm lg:text-base text-[#09090B]">
                          <span className="font-medium">Phone:</span> {staff.phoneNo}
                        </p>
                        <p className="text-sm lg:text-base text-[#09090B]">
                          <span className="font-medium">Role:</span> {roleName || '--'}
                        </p>
                        <p className="text-sm lg:text-base text-[#09090B]">
                          <span className="font-medium">Department:</span> {departmentName || '--'}
                        </p>
                        {staff.remark && (
                          <p className="text-sm lg:text-base text-[#09090B]">
                            <span className="font-medium">Remark:</span> {staff.remark}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="!text-[#71717a] hover:bg-transparent flex-1"
                        >
                          <Link href={`/staff/${staff.id}`}>
                            <Pencil className="h-4 w-4 mr-1" />
                            <span className="text-xs">Edit</span>
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => setDeleteId(staff.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </>
      ) : (
        <div>
          <h2 className="flex text-base font-medium space-x-2 items-center">
            <TriangleAlert className="text-[#DC2626]" />
            <span>No exact matches found</span>
          </h2>
          <p className="text-sm mt-2">Keep trying! Double-check the spelling or try a broader search.</p>
        </div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your staff and remove your data from our
              servers.
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
              {deleteMutation.isPending ? 'Deleting...' : 'Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
