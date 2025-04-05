'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Pencil, Trash2, TriangleAlert, Loader2 } from 'lucide-react';
import { useState } from 'react';
import _ from 'lodash';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Role, roleApi } from './api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function StaffManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState('id');
  const [keyword, setKeyword] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns = ['id', 'roleName', 'remark'];

  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.fetchRoles,
  });

  const filteredRecords =
    roles?.filter((role) =>
      Object.values(role).some((value) => String(value).toLowerCase().includes(keyword.toLowerCase()))
    ) ?? [];

  const deleteMutation = useMutation({
    mutationFn: roleApi.deleteRole,
    onSuccess: () => {
      toast.success('Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete role');
    },
  });

  const handleEdit = (id: number) => {
    router.push(`/staff-role/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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
        <h1 className="text-xl lg:text-2xl font-semibold">Manage Staff Role</h1>
        {/* <Button onClick={() => router.push('/staff-role/new')} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Staff Role</span>
        </Button> */}
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
          <div className="hidden sm:block overflow-x-auto">
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
                {filteredRecords
                  .sort((a, b) => String(a[sortBy as keyof Role]).localeCompare(String(b[sortBy as keyof Role])))
                  .map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.id}</TableCell>
                      <TableCell>{role.roleName}</TableCell>
                      <TableCell>{role.remark || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(role.id)}>
                            <Pencil className="h-4 w-4 text-[#71717a]" />
                          </Button>
                          {/* <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(role.id)}>
                            <Trash2 className="h-4 w-4 text-[#df1212]" />
                          </Button> */}
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
              .sort((a, b) => String(a[sortBy as keyof Role]).localeCompare(String(b[sortBy as keyof Role])))
              .map((role) => (
                <Card key={role.id} className="bg-[#F9FBFD] border border-[#D1D9E2]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5 lg:px-5 lg:py-4">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 py-1.5 lg:py-2 px-2 lg:px-4 bg-muted/50"
                      >
                        <span className="text-xs lg:text-sm font-semibold text-primary">ID: {role.id}</span>
                      </Badge>
                      <div>
                        <h3 className="text-sm lg:text-base font-semibold">{role.roleName}</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-2.5 lg:px-5 lg:pt-6 space-y-2 lg:space-y-6">
                    {role.remark && (
                      <div className="space-y-1">
                        <p className="text-sm lg:text-base text-[#09090B]">
                          <span className="font-medium">Remark:</span> {role.remark}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="!text-[#71717a] hover:bg-transparent w-full"
                        onClick={() => handleEdit(role.id)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        <span className="text-xs">View Details</span>
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
          <p className="text-sm mt-2">Keep trying! Double-check the spelling or try a broader search.</p>
        </div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
