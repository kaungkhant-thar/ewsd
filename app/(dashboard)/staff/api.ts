import { api } from "@/lib/api";
import type { AxiosResponse } from "axios";

export type Staff = {
  id: number;
  userName: string;
  email: string;
  phoneNo: string;
  roleId: number;
  departmentId: number;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StaffFormData = {
  userName: string;
  password: string;
  email: string;
  phoneNo: string;
  roleId: number;
  departmentId: number;
  remark: string | null;
};

export type StaffUpdateFormData = Omit<StaffFormData, "password">;

export const staffApi = {
  fetchStaffs: async (): Promise<Staff[]> =>
    api.get<AxiosResponse<Staff[]>>("/readUsers").then((res) => res.data.data),

  fetchStaff: async (id: string): Promise<Staff> =>
    api.get(`/readUserById/${id}`).then((res) => res.data.data),

  createStaff: async (data: StaffFormData) => api.post("/createUser", data),

  updateStaff: async ({
    id,
    data,
  }: {
    id: string;
    data: StaffUpdateFormData;
  }) => api.post("/updateUser", { ...data, id }),

  deleteStaff: async (id: number) => api.post(`/deleteUser/${id}`),

  getCurrentUser: async (): Promise<Staff> =>
    api.get("/user").then((res) => res.data.data),
};
