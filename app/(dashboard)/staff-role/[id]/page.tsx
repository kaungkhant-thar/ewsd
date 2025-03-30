'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RoleFormData, roleApi } from '../api';

export default function RoleFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === 'new';

  const { data: role, isLoading } = useQuery({
    queryKey: ['role', params.id],
    queryFn: () => roleApi.fetchRole(params.id as string),
    enabled: !isNew && !!params.id,
  });

  const [formData, setFormData] = useState<RoleFormData>({
    roleName: '',
    remark: '',
  });

  useEffect(() => {
    if (role) {
      setFormData(role);
    }
  }, [role]);

  const mutation = useMutation({
    mutationFn: isNew
      ? roleApi.createRole
      : (data: RoleFormData) => roleApi.updateRole({ id: params.id as string, data }),
    onSuccess: () => {
      toast.success(`Role ${isNew ? 'created' : 'updated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      router.push('/staff-role');
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${isNew ? 'create' : 'update'} role`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (!isNew && isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Staff Role /</div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {isNew ? 'New Role' : formData.roleName}
              </h2>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {isNew ? 'Add a new staff role' : 'Edit staff role details'}. Click save when you're done.
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-end">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-[40rem] w-full">
            <div className="grid gap-2">
              <label htmlFor="roleName" className="text-sm font-medium text-gray-900">
                Role name
              </label>
              <Input
                id="roleName"
                disabled
                value={formData.roleName}
                onChange={(e) => setFormData((prev) => ({ ...prev, roleName: e.target.value }))}
                className="w-full"
                required
              />
              <span className="text-xs text-gray-500">Role name cannot be changed.</span>
            </div>

            <div className="grid gap-2">
              <label htmlFor="remark" className="text-sm font-medium text-gray-900">
                Remark
              </label>
              <Textarea
                id="remark"
                value={formData.remark || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
                className="min-h-[150px] w-full"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push('/staff-role')}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-teal hover:bg-primary-teal/90" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
