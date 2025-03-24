import { api } from '@/lib/api';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';

export interface AcademicYear {
  id: number;
  academicName: string;
  startDate: string;
  endDate: string;
  closureDate: string;
  finalClosureDate: string;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYearFormData {
  academicName: string;
  startDate: string;
  endDate: string;
  closureDate: string;
  finalClosureDate: string;
  remark: string | null;
}

export interface AcademicYearQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const academicYearApi = {
  fetchAcademicYears: async (params?: AcademicYearQueryParams): Promise<AcademicYear[]> => {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }

    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = `/get/academic-years${queryString ? `?${queryString}` : ''}`;

    return api.get<AxiosResponse<AcademicYear[]>>(url).then((res) => res.data.data);
  },

  fetchAcademicYear: async (id: string): Promise<AcademicYearFormData> =>
    api.get(`/get/academic-year/${id}`).then((res) => res.data.data),

  createAcademicYear: async (data: AcademicYearFormData) => api.post('/add/academic-year', data),

  updateAcademicYear: async ({ id, data }: { id: string; data: AcademicYearFormData }) =>
    api.put(`/update/academic-year/${id}`, data),

  deleteAcademicYear: async (id: number) => api.delete(`/delete/academic-year/${id}`),

  downloadIdeasCsv: async (academicYear: AcademicYear) => {
    try {
      const response = await api.get(`/academic-year/${academicYear.id}/ideas-csv`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideas-in-academic-year-${academicYear.academicName}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Ideas CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to download ideas CSV');
    }
  },

  downloadSubmittedFiles: async (academicYear: AcademicYear) => {
    try {
      const response = await api.get(`/academic-year/${academicYear.id}/submitted-files`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submitted-files-in-academic-year-${academicYear.academicName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Submitted files downloaded successfully');
    } catch (error) {
      toast.error('Failed to download submitted files');
    }
  },
};
