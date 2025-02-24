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
import { UserCircle } from "lucide-react";
import React from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema, type Staff } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export default function Page() {
  const { id } = useParams();

  const isEdit = id !== "add";

  const form = useForm<Staff>({
    resolver: zodResolver(staffSchema),
    defaultValues: isEdit
      ? {
          username: "Pedro Duarte",
          email: "@peduarte",
          phoneNumber: "@peduarte",
          role: "QA manager",
          department: "QA Department",
          remark: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        }
      : {
          username: "",
          email: "",
          phoneNumber: "",
          role: "",
          department: "",
          remark: "",
        },
  });

  const handleSubmit = (data: Staff) => {
    console.log("Form submitted:", data);
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
                {isEdit ? "Thet Aung Tun" : "Add"}
              </h2>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {isEdit
            ? "Make changes to your profile here. Click save when you're done."
            : "Add your staff details here. Click save when you're done."}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(
                          formState.errors.username && "border-red-500"
                        )}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(
                          formState.errors.email && "border-red-500"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(
                          formState.errors.phoneNumber && "border-red-500"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Role
                    </FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger
                          className={cn(
                            formState.errors.role && "border-red-500"
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QA manager">QA manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Department
                    </FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger
                          className={cn(
                            formState.errors.department && "border-red-500"
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QA Department">
                            QA Department
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                    <FormControl>
                      <Textarea
                        {...field}
                        className={cn(
                          formState.errors.remark && "border-red-500"
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary-teal hover:bg-primary-teal/90"
                >
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
