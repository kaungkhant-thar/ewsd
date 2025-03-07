import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

export type Category = {
  id: number;
  categoryName: string;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryFormData = {
  categoryName: string;
  remark: string | null;
};

export const categoryApi = {
  fetchCategories: async (): Promise<Category[]> =>
    api
      .get<AxiosResponse<Category[]>>("/get/categories")
      .then((res) => res.data.data),

  fetchCategory: async (id: string): Promise<Category> =>
    api.get(`/get/category/${id}`).then((res) => res.data.data),

  createCategory: async (data: CategoryFormData) =>
    api.post("/add/category", data),

  updateCategory: async ({
    id,
    data,
  }: {
    id: string;
    data: CategoryFormData;
  }) => api.put(`/update/category/${id}`, data),

  deleteCategory: async (id: number) => api.delete(`/delete/category/${id}`),
};
