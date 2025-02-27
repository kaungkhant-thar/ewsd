import { api } from '@/lib/api';
import { AxiosResponse } from 'axios';

export interface Role {
  id: number;
  roleName: string;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormData {
  roleName: string;
  remark: string | null;
}

export const roleApi = {
  fetchRoles: async (): Promise<Role[]> => api.get<AxiosResponse<Role[]>>('/get/roles').then((res) => res.data.data),

  fetchRole: async (id: string): Promise<RoleFormData> => api.get(`/get/roles/${id}`).then((res) => res.data.data),

  createRole: async (data: RoleFormData) => api.post('/add/role', data),

  updateRole: async ({ id, data }: { id: string; data: RoleFormData }) => api.put(`/update/role/${id}`, data),

  deleteRole: async (id: number) => api.delete(`/delete/role/${id}`),
};
