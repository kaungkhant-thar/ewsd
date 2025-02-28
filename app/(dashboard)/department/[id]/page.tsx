"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building, UserCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DepartmentFormData, departmentApi } from "../api";

export default function DepartmentFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";

  const { data: department, isLoading } = useQuery({
    queryKey: ["department", params.id],
    queryFn: () => departmentApi.fetchDepartment(params.id as string),
    enabled: !isNew && !!params.id,
  });

  const [formData, setFormData] = useState<DepartmentFormData>({
    departmentName: "",
    remark: "",
  });

  useEffect(() => {
    if (department) {
      setFormData(department);
    }
  }, [department]);

  const mutation = useMutation({
    mutationFn: isNew
      ? departmentApi.createDepartment
      : (data: DepartmentFormData) =>
          departmentApi.updateDepartment({ id: params.id as string, data }),
    onSuccess: () => {
      toast.success(`Department ${isNew ? "created" : "updated"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      router.push("/department");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || `Failed to ${isNew ? "create" : "update"} department`
      );
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
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Department /</div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {isNew ? "New Department" : formData.departmentName}
              </h2>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {isNew
            ? "Add your department details here"
            : "Make changes to your department here"}
          . Click save when you're done.
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-end">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-[40rem] w-full"
          >
            <div className="grid gap-2">
              <label
                htmlFor="departmentName"
                className="text-sm font-medium text-gray-900"
              >
                Department name
              </label>
              <Input
                id="departmentName"
                value={formData.departmentName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    departmentName: e.target.value,
                  }))
                }
                className="w-full"
                required
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="remark"
                className="text-sm font-medium text-gray-900"
              >
                Remark
              </label>
              <Textarea
                id="remark"
                value={formData.remark || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, remark: e.target.value }))
                }
                className="min-h-[150px] w-full"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/department")}
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
        </div>
      </div>
    </main>
  );
}
