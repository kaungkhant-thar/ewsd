import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

export interface Department {
  id: number;
  departmentName: string;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentFormData {
  departmentName: string;
  remark: string | null;
}

export const departmentApi = {
  fetchDepartments: async (): Promise<Department[]> =>
    api
      .get<AxiosResponse<Department[]>>("/get/departments")
      .then((res) => res.data.data),

  fetchDepartment: async (id: string): Promise<DepartmentFormData> =>
    api.get(`/get/departments/${id}`).then((res) => res.data.data),

  createDepartment: async (data: DepartmentFormData) =>
    api.post("/add/department", data),

  updateDepartment: async ({
    id,
    data,
  }: {
    id: string;
    data: DepartmentFormData;
  }) => api.put(`/update/department/${id}`, data),

  deleteDepartment: async (id: number) =>
    api.delete(`/delete/department/${id}`),
};
