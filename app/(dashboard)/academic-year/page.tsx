'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import _ from 'lodash';
import { Pencil, Plus, Search, Trash2, TriangleAlert, MoreVertical, Download, FileDown, EyeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { AcademicYear, academicYearApi, AcademicYearQueryParams, AcademicYearStatus } from './api';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cva } from 'class-variance-authority';
import { useCurrentUser } from '@/app/(dashboard)/app-sidebar';
import { StaffRoleName } from '@/app/(dashboard)/staff/api';

const statusClasses = cva('capitalize pointer-events-none shadow-none', {
  variants: {
    status: {
      current: 'bg-emerald-200 text-emerald-800',
      closed: 'bg-red-200 text-red-800',
      past: 'bg-amber-200 text-amber-800',
      final_closed: 'bg-gray-200 text-gray-800',
      future: 'bg-purple-200 text-purple-800',
    },
  },
  defaultVariants: {
    status: 'current',
  },
});

export default function AcademicYearPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState('academicName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [keyword, setKeyword] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns = ['academicName', 'startDate', 'endDate', 'closureDate', 'finalClosureDate', 'status'];

  const queryParams: AcademicYearQueryParams = {};

  const {
    data: academicYears = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['academicYears'],
    queryFn: () => academicYearApi.fetchAcademicYears(queryParams),
  });

  // Filter and sort data on the frontend
  const filteredAndSortedAcademicYears = _.orderBy(
    _.filter(academicYears, (year) => {
      if (!keyword) return true;
      const searchTerm = keyword.toLowerCase();
      return (
        year.academicName.toLowerCase().includes(searchTerm) ||
        year.status.toLowerCase().includes(searchTerm) ||
        formatDate(year.startDate).includes(searchTerm) ||
        formatDate(year.endDate).includes(searchTerm) ||
        formatDate(year.closureDate).includes(searchTerm) ||
        formatDate(year.finalClosureDate).includes(searchTerm)
      );
    }),
    [sortBy],
    [sortOrder]
  );

  const deleteMutation = useMutation({
    mutationFn: academicYearApi.deleteAcademicYear,
    onSuccess: () => {
      toast.success('Academic year deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete academic year');
    },
  });

  const handleEdit = (id: number) => {
    router.push(`/academic-year/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleAdd = () => {
    router.push('/academic-year/new');
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const currentUser = useCurrentUser();

  const readOnly = !['admin', 'manager'].includes(currentUser?.roleName || '');

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-medium">{readOnly ? 'View Academic Year' : 'Manage Academic Year'}</h1>
        {!readOnly && (
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add academic year</span>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between mt-2.5 mb-6">
        <div className="relative w-96">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <Input
            value={keyword}
            className="pl-9 border-[#e4e4e7]"
            placeholder="Type to search..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
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
          <Button variant="outline" size="icon" onClick={toggleSortOrder} className="w-10 h-10">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-teal"></div>
        </div>
      ) : filteredAndSortedAcademicYears.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Academic Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Closure Date</TableHead>
              <TableHead>Final Closure Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedAcademicYears.map((academicYear) => {
              const ableToDownload = ['past', 'final_closed'].includes(academicYear.status);

              return (
                <TableRow key={academicYear.id}>
                  <TableCell>{academicYear.id}</TableCell>
                  <TableCell className="font-medium">{academicYear.academicName}</TableCell>
                  <TableCell>{formatDate(academicYear.startDate)}</TableCell>
                  <TableCell>{formatDate(academicYear.endDate)}</TableCell>
                  <TableCell>{formatDate(academicYear.closureDate)}</TableCell>
                  <TableCell>{formatDate(academicYear.finalClosureDate)}</TableCell>
                  <TableCell className="max-w-28">
                    <Badge className={statusClasses({ status: academicYear.status })}>
                      {academicYear.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  {readOnly ? (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="p-0 h-8 text-primary"
                          onClick={() => handleEdit(academicYear.id)}
                        >
                          <EyeIcon className="h-6 w-6" /> View
                        </Button>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => handleEdit(academicYear.id)}
                        >
                          <Pencil className="h-4 w-4 text-[#71717a]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => handleDelete(academicYear.id)}
                        >
                          <Trash2 className="h-4 w-4 text-[#df1212]" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreVertical className="h-4 w-4 text-[#71717a]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={!ableToDownload}
                              onClick={() => academicYearApi.downloadIdeasCsv(academicYear)}
                            >
                              <FileDown className="mr-2 h-4 w-4" />
                              <div>
                                Download Ideas CSV
                                {!ableToDownload && (
                                  <p className="text-xs text-gray-500">Can be downloaded after final closure date.</p>
                                )}
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={!ableToDownload}
                              onClick={() => academicYearApi.downloadSubmittedFiles(academicYear)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              <div>
                                Download Submitted Files
                                {!ableToDownload && (
                                  <p className="text-xs text-gray-500">Can be downloaded after final closure date.</p>
                                )}
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div>
          <h2 className="flex text-base font-medium space-x-2 items-center">
            <TriangleAlert className="text-[#DC2626]" />
            <span>No exact matches found</span>
          </h2>
          <p className="text-sm mt-2">Keep trying! Double-check the spelling or try a broader search.</p>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this academic year?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the academic year and remove its data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
