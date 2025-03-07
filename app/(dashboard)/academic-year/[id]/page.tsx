'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AcademicYearFormData, academicYearApi } from '../api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define Zod schema for form validation
const formSchema = z
  .object({
    academicName: z.string().min(1, 'Academic name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    closureDate: z.string().min(1, 'Closure date is required'),
    finalClosureDate: z.string().min(1, 'Final closure date is required'),
    remark: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    // Validate endDate is after startDate
    if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['endDate'],
      });
    }

    // Validate closureDate is between startDate and endDate
    if (data.startDate && data.closureDate) {
      if (new Date(data.closureDate) <= new Date(data.startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Closure date must be after start date',
          path: ['closureDate'],
        });
      }

      if (data.endDate && new Date(data.closureDate) >= new Date(data.endDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Closure date must be before end date',
          path: ['closureDate'],
        });
      }
    }

    // Validate finalClosureDate is after closureDate and before or equal to endDate
    if (data.closureDate && data.finalClosureDate) {
      if (new Date(data.finalClosureDate) <= new Date(data.closureDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Final closure date must be after closure date',
          path: ['finalClosureDate'],
        });
      }

      if (data.endDate && new Date(data.finalClosureDate) > new Date(data.endDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Final closure date must be before or equal to end date',
          path: ['finalClosureDate'],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function AcademicYearFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === 'new';

  // Setup react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academicName: '',
      startDate: '',
      endDate: '',
      closureDate: '',
      finalClosureDate: '',
      remark: '',
    },
  });

  const { data: academicYear, isLoading } = useQuery({
    queryKey: ['academicYear', params.id],
    queryFn: () => academicYearApi.fetchAcademicYear(params.id as string),
    enabled: !isNew && !!params.id,
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (academicYear) {
      form.reset({
        academicName: academicYear.academicName,
        startDate: academicYear.startDate?.split('T')[0] || '', // Format for date input
        endDate: academicYear.endDate?.split('T')[0] || '',
        closureDate: academicYear.closureDate?.split('T')[0] || '',
        finalClosureDate: academicYear.finalClosureDate?.split('T')[0] || '',
        remark: academicYear.remark || '',
      });
    }
  }, [academicYear, form]);

  const mutation = useMutation({
    mutationFn: isNew
      ? academicYearApi.createAcademicYear
      : (data: AcademicYearFormData) =>
          academicYearApi.updateAcademicYear({
            id: params.id as string,
            data,
          }),
    onSuccess: () => {
      toast.success(`Academic year ${isNew ? 'created' : 'updated'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      router.push('/academic-year');
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${isNew ? 'create' : 'update'} academic year`);
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
    return <div>Loading...</div>;
  }

  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Academic Year /</div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {isNew ? 'New Academic Year' : form.getValues('academicName') || 'Loading...'}
              </h2>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          {isNew ? 'Add your academic year details here' : 'Make changes to your academic year here'}. Click save when
          you're done.
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-[40rem] w-full">
              <FormField
                control={form.control}
                name="academicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closure date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="finalClosureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final closure date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remark</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[150px]" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.push('/academic-year')}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-teal hover:bg-primary-teal/90"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
