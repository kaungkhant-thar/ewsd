"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoryFormData, categoryApi } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const categorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  remark: z.string().nullable(),
});

export default function CategoryFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      remark: null,
    },
  });

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", params.id],
    queryFn: () => categoryApi.fetchCategory(params.id as string),
    enabled: !isNew && !!params.id,
  });

  useEffect(() => {
    if (category) {
      form.reset(category);
    }
  }, [category, form]);

  const mutation = useMutation({
    mutationFn: isNew
      ? categoryApi.createCategory
      : (data: CategoryFormData) =>
          categoryApi.updateCategory({ id: params.id as string, data }),
    onSuccess: () => {
      toast.success(`Category ${isNew ? "created" : "updated"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.push("/category");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || `Failed to ${isNew ? "create" : "update"} category`
      );
    },
  });

  const handleSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
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
              <div className="text-sm text-gray-500">Category /</div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {isNew
                  ? "New Category"
                  : category?.categoryName || "Loading..."}
              </h2>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {isNew
            ? "Add a new category here. Click save when you're done."
            : "Make changes to category details here. Click save when you're done."}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field, formState }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Category name
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Input
                          {...field}
                          error={formState.errors.categoryName?.message}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem className="flex flex-col lg:flex-row gap-4 lg:items-start">
                    <FormLabel className="text-sm font-medium text-gray-900 lg:basis-1/3 lg:text-right">
                      Remark
                    </FormLabel>
                    <div className="lg:basis-2/3">
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          className="min-h-[150px]"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/category")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-teal hover:bg-primary-teal/90"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
