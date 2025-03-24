'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import _ from 'lodash';
import { Pencil, Plus, Search, Trash2, TriangleAlert, MoreVertical, Download, FileDown } from 'lucide-react';
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
import { AcademicYear, academicYearApi, AcademicYearQueryParams } from './api';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AcademicYearPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns = ['id', 'academicName', 'startDate', 'endDate', 'closureDate', 'finalClosureDate', 'remark'];

  const queryParams: AcademicYearQueryParams = {
    search: debouncedKeyword,
    sortBy,
    sortOrder,
  };

  const {
    data: academicYears = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['academicYears', queryParams],
    queryFn: () => academicYearApi.fetchAcademicYears(queryParams),
  });

  // Refetch when search or sort changes
  useEffect(() => {
    refetch();
  }, [debouncedKeyword, sortBy, sortOrder, refetch]);

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

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-medium">Manage Academic Year</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Add academic year</span>
        </Button>
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
      ) : academicYears.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Academic Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Closure Date</TableHead>
              <TableHead>Final Closure Date</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {academicYears.map((academicYear) => (
              <TableRow key={academicYear.id}>
                <TableCell>{academicYear.id}</TableCell>
                <TableCell className="font-medium">{academicYear.academicName}</TableCell>
                <TableCell>{formatDate(academicYear.startDate)}</TableCell>
                <TableCell>{formatDate(academicYear.endDate)}</TableCell>
                <TableCell>{formatDate(academicYear.closureDate)}</TableCell>
                <TableCell>{formatDate(academicYear.finalClosureDate)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{academicYear.remark}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEdit(academicYear.id)}>
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
                        <DropdownMenuItem onClick={() => academicYearApi.downloadIdeasCsv(academicYear)}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Download Ideas CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => academicYearApi.downloadSubmittedFiles(academicYear)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Submitted Files
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
