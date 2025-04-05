'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffSchema, type StaffFormData } from '../schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { staffApi } from '../api';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Role } from '../../staff-role/api';
import { roleApi } from '../../staff-role/api';
import type { Department } from '../../department/api';
import { departmentApi } from '../../department/api';

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = id !== 'add';

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      userName: '',
      email: '',
      phoneNo: '',
      roleId: undefined,
      departmentId: undefined,
      remark: null,
      password: '',
    },
  });

  const {
    data: staff,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffApi.fetchStaff(id as string),
    enabled: isEdit,
  });

  useEffect(() => {
    if (staff) {
      form.reset({
        ...staff,
        password: '',
      });
    }
  }, [staff, form]);

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: roleApi.fetchRoles,
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: departmentApi.fetchDepartments,
  });

  const mutation = useMutation({
    mutationFn: isEdit
      ? (data: StaffFormData) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...updateData } = data;
          return staffApi.updateStaff({ id: id as string, data: updateData });
        }
      : (data: StaffFormData) => {
          return staffApi.createStaff(data);
        },
    onSuccess: () => {
      toast.success(`Staff ${isEdit ? 'updated' : 'created'} successfully`);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      router.push('/staff');
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} staff`);
    },
  });

  const handleSubmit = async (data: StaffFormData) => {
    mutation.mutate(data);
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center">
            <UserCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-[#3173ED]">Staff /</div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              {isEdit ? staff?.userName || 'Loading...' : 'Add New Staff'}
            </h2>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-8 font-medium">
        {isEdit ? 'Make changes to staff details here' : 'Add new staff details here'}. Click save when you're done.
      </div>

      <div className="border border-[#E4E4E7] rounded-lg shadow-sm p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
            <FormField
              control={form.control}
              name="userName"
              render={({ field, formState }) => (
                <FormItem className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">Username*</FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input {...field} error={formState.errors.userName?.message} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, formState }) => (
                <FormItem className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">Email*</FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input {...field} type="email" error={formState.errors.email?.message} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormField
                control={form.control}
                name="password"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                    <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">Password*</FormLabel>
                    <div className="w-full sm:max-w-[50rem]">
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          error={formState.errors.password?.message}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field, formState }) => (
                <FormItem className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">
                    Phone Number*
                  </FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input {...field} error={formState.errors.phoneNo?.message} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">Role*</FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Select
                        value={field.value !== undefined ? String(field.value) : ''}
                        onValueChange={(value) => {
                          if (value) {
                            const numValue = Number(value);
                            field.onChange(numValue);
                          }
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-full border-[#e4e4e7]',
                            field.value === undefined && 'text-muted-foreground'
                          )}
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              {role.roleName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">Department*</FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Select
                        value={field.value !== undefined ? String(field.value) : ''}
                        onValueChange={(value) => {
                          if (value) {
                            const numValue = Number(value);
                            field.onChange(numValue);
                          }
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-full border-[#e4e4e7]',
                            field.value === undefined && 'text-muted-foreground'
                          )}
                        >
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={String(department.id)}>
                              {department.departmentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">Remark</FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} className="min-h-[150px] w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/staff')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-teal hover:bg-primary-teal/90 w-full sm:w-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
