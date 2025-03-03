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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema, type StaffFormData } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { staffApi } from "../api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Role } from "../../staff-role/api";
import { roleApi } from "../../staff-role/api";
import type { Department } from "../../department/api";
import { departmentApi } from "../../department/api";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = id !== "add";

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      userName: "",
      email: "",
      phoneNo: "",
      roleId: undefined,
      departmentId: undefined,
      remark: null,
      password: "",
    },
  });

  const { data: staff, refetch } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => staffApi.fetchStaff(id as string),
    enabled: isEdit,
  });

  useEffect(() => {
    if (staff) {
      form.reset({
        ...staff,
        password: "",
      });
    }
  }, [staff, form]);

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: roleApi.fetchRoles,
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["departments"],
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
      toast.success(`Staff ${isEdit ? "updated" : "created"} x`);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      router.push("/staff");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || `Failed to ${isEdit ? "update" : "create"} staff`
      );
    },
  });

  const handleSubmit = async (data: StaffFormData) => {
    mutation.mutate(data);
  };

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Staff /</div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {isEdit ? staff?.userName || "Loading..." : "Add"}
              </h2>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {isEdit
            ? "Make changes to staff details here. Click save when you're done."
            : "Add new staff details here. Click save when you're done."}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="userName"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Username
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Input
                          {...field}
                          error={formState.errors.userName?.message}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Email
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          error={formState.errors.email?.message}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              {!isEdit && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, formState }) => (
                    <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                      <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                        Password
                      </FormLabel>
                      <div className="lg:basis-2/3">
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            error={formState.errors.password?.message}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Phone Number
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Input
                          {...field}
                          error={formState.errors.phoneNo?.message}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Role
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => {
                            if (value) {
                              const numValue = Number(value);
                              field.onChange(numValue);
                            }
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "border-[#e4e4e7]",
                              field.value === undefined &&
                                "text-muted-foreground"
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
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Department
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => {
                            if (value) {
                              const numValue = Number(value);
                              field.onChange(numValue);
                            }
                          }}
                        >
                          <SelectTrigger
                            className={cn(
                              "border-[#e4e4e7]",
                              field.value === undefined &&
                                "text-muted-foreground"
                            )}
                          >
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={String(department.id)}
                              >
                                {department.departmentName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remark"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Remark
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          className={cn(
                            formState.errors.remark && "border-red-500"
                          )}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/staff")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-teal hover:bg-primary-teal/90"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEdit ? "Update" : "Create"}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
