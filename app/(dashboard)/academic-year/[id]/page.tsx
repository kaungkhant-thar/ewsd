"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Download, FileDown, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AcademicYearFormData, academicYearApi, AcademicYear } from "../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCurrentUser } from "@/app/(dashboard)/app-sidebar";

const formSchema = z
  .object({
    academicName: z.string().min(1, "Academic name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    closureDate: z.string().min(1, "Closure date is required"),
    finalClosureDate: z.string().min(1, "Final closure date is required"),
    remark: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    // Validate endDate is after startDate
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.endDate) <= new Date(data.startDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }

    // Validate closureDate is between startDate and endDate
    if (data.startDate && data.closureDate) {
      if (new Date(data.closureDate) <= new Date(data.startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Closure date must be after start date",
          path: ["closureDate"],
        });
      }

      if (
        data.endDate &&
        new Date(data.closureDate) >= new Date(data.endDate)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Closure date must be before end date",
          path: ["closureDate"],
        });
      }
    }

    // Validate finalClosureDate is after closureDate and before or equal to endDate
    if (data.closureDate && data.finalClosureDate) {
      if (new Date(data.finalClosureDate) <= new Date(data.closureDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Final closure date must be after closure date",
          path: ["finalClosureDate"],
        });
      }

      if (
        data.endDate &&
        new Date(data.finalClosureDate) > new Date(data.endDate)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Final closure date must be before or equal to end date",
          path: ["finalClosureDate"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function AcademicYearFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";

  const currentUser = useCurrentUser();

  const readOnly = !["admin", "manager"].includes(currentUser?.roleName || "");

  // Setup react-hook-form with zod validation first with empty defaults
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    disabled: readOnly,
    defaultValues: {
      academicName: "",
      startDate: "",
      endDate: "",
      closureDate: "",
      finalClosureDate: "",
      remark: "",
    },
  });

  // Then fetch the data
  const { data: academicYear, isLoading } = useQuery({
    queryKey: ["academicYear", params.id],
    queryFn: () => academicYearApi.fetchAcademicYear(params.id as string),
    enabled: !isNew && !!params.id,
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (!isNew && academicYear) {
      form.reset({
        academicName: academicYear.academicName,
        startDate: academicYear.startDate?.split("T")[0] || "",
        endDate: academicYear.endDate?.split("T")[0] || "",
        closureDate: academicYear.closureDate?.split("T")[0] || "",
        finalClosureDate: academicYear.finalClosureDate?.split("T")[0] || "",
        remark: academicYear.remark || "",
      });
    }
  }, [academicYear, form, isNew]);

  const mutation = useMutation({
    mutationFn: isNew
      ? academicYearApi.createAcademicYear
      : (data: AcademicYearFormData) =>
          academicYearApi.updateAcademicYear({
            id: params.id as string,
            data,
          }),
    onSuccess: async () => {
      toast.success(
        `Academic year ${isNew ? "created" : "updated"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
      await queryClient.invalidateQueries({
        queryKey: ["currentAcademicYear"],
      });
      router.push("/academic-year");
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
          `Failed to ${isNew ? "create" : "update"} academic year`
      );
    },
  });

  function onSubmit(values: FormValues) {
    const submissionData: AcademicYearFormData = {
      academicName: values.academicName,
      startDate: values.startDate,
      endDate: values.endDate,
      closureDate: values.closureDate,
      finalClosureDate: values.finalClosureDate,
      remark: values.remark,
    };
    mutation.mutate(submissionData);
  }

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const ableToDownload = ["past", "final_closed"].includes(
    academicYear?.status || ""
  );

  return (
    <main className="flex-1 overflow-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-[#3173ED]">Academic Year /</div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              {isNew
                ? "New Academic Year"
                : form.getValues("academicName") || "Loading..."}
            </h2>
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="text-sm text-gray-500 mb-8 font-medium">
          {isNew
            ? "Add your academic year details here"
            : "Make changes to your academic year here"}
          . Click save when you're done.
        </div>
      )}

      {!isNew && !readOnly && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() =>
              academicYearApi.downloadIdeasCsv(academicYear as AcademicYear)
            }
            className="flex items-center text-left gap-3"
            disabled={!ableToDownload}
          >
            <FileDown className="h-4 w-4" />
            <div>
              Download Ideas CSV
              {!ableToDownload && (
                <p className="text-xs text-gray-500">
                  Can be downloaded after final closure date.
                </p>
              )}
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              academicYearApi.downloadSubmittedFiles(
                academicYear as AcademicYear
              )
            }
            className="flex items-center text-left gap-3"
            disabled={!ableToDownload}
          >
            <Download className="h-4 w-4" />
            <div>
              Download Submitted Files
              {!ableToDownload && (
                <p className="text-xs text-gray-500">
                  Can be downloaded after final closure date.
                </p>
              )}
            </div>
          </Button>
        </div>
      )}

      <div className="border border-[#E4E4E7] rounded-lg shadow-sm p-4 sm:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="academicName"
              render={({ field }) => (
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">
                    Academic name*
                  </FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">
                    Start date*
                  </FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">
                    End date*
                  </FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="closureDate"
              render={({ field }) => (
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">
                    Closure date*
                  </FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="finalClosureDate"
              render={({ field }) => (
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">
                    Final closure date*
                  </FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:justify-end gap-2 sm:gap-0">
                  <FormLabel className="text-sm font-medium text-gray-900 sm:w-40 sm:text-right">
                    Remark
                  </FormLabel>
                  <div className="w-full sm:max-w-[50rem]">
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        className="min-h-[150px] w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              )}
            />

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/academic-year")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-teal hover:bg-primary-teal/90 w-full sm:w-auto"
                disabled={mutation.isPending || readOnly}
              >
                {mutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
