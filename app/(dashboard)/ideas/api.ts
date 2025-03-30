import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

export interface IdeaDocument {
  id: number;
  fileName: string;
  publicFileUrl: string;
  ideaId: number;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  viewCount: number;
  popularity: number;
  userId: number;
  userName: string;
  categoryId: number;
  academicYearId: number;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
  ideaDocuments: IdeaDocument[];
}

export interface IdeaFormData {
  title: string;
  content: string;
  isAnonymous?: boolean;
  userId: number;
  categoryId: number;
  remark?: string | null;
  files?: File[];
}

export interface PaginationData {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  from: number;
  to: number;
}

export interface IdeaListResponse {
  pagination: PaginationData;
  ideaList: Idea[];
}

export interface Category {
  id: number;
  categoryName: string;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  phoneNo: string;
  roleId: number;
  departmentId: number;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  desc: string;
  userId: number;
  userName: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaDetail {
  id: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  viewCount: number;
  popularity: number;
  userId: number;
  userName: string;
  categoryId: number;
  categoryName: string;
  academicYearId: number;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
  ideaDocuments: IdeaDocument[];
  totalLikes: number;
  totalUnlikes: number;
  commentsCount: number;
  comments: Comment[];
}

export const ideaApi = {
  fetchIdeas: async (sortBy: string, categoryId: string, keyword: string, page: number = 1): Promise<IdeaListResponse> =>
    api
      .get<AxiosResponse<IdeaListResponse>>("/get/ideas", { 
        params: { 
          sortBy,
          categoryId,
          keyword,
          page 
        } 
      })
      .then((res) => res.data.data),

  fetchIdeasByUserId: async (userId: number, sortBy: string, categoryId: string, keyword: string, page: number = 1): Promise<IdeaListResponse> =>
    api
      .get<AxiosResponse<IdeaListResponse>>(`/get/ideas/user/${userId}`, { 
        params: { 
          sortBy,
          categoryId,
          keyword,
          page 
        } 
      })
      .then((res) => res.data.data),

  fetchIdea: async (id: string): Promise<Idea> =>
    api.get(`/get/idea/${id}`).then((res) => res.data.data),

  createIdea: async (data: IdeaFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'files' && value) {
        Array.from(value).forEach(file => {
          formData.append('files[]', file as never);
        });
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return api.post("/submit/idea", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteIdea: async (id: number) => {
    const { data } = await api.delete(`/delete/idea/${id}`);
    return data;
  },

  reportIdea: async (id: number) => {
    const { data } = await api.post(`/report/idea/${id}`);
    return data;
  },

  increaseViewCount: async (id: number) => {
    const response = await api.post(`/view/idea/${id}`);
    
    return response.data;
  },

  blockUser: async (id: number) => {
    const { data } = await api.post(`/blockUser/${id}`);
    return data;
  },

  fetchIdeaDetails: async (id: number): Promise<IdeaDetail> => {
    const { data } = await api.get<AxiosResponse<IdeaDetail>>(`/get/idea/${id}/details`);
    return data.data;
  },
  
  submitComment: async (ideaId: number, content: string, userId: number, isAnonymous: boolean = false) => {
    const { data } = await api.post(`/add/ideas/${ideaId}/comment`, {
      desc:content,
      userId,
      isAnonymous
    });
    return data;
  },
};

export const categoryApi = {
  fetchCategories: async (): Promise<Category[]> =>
    api
      .get<AxiosResponse<Category[]>>("/get/categories")
      .then((res) => res.data.data),

  fetchCategory: async (id: number): Promise<Category> =>
    api
      .get<AxiosResponse<Category>>(`/get/category/${id}`)
      .then((res) => res.data.data),

  createCategory: async (data: { categoryName: string; remark?: string | null }) =>
    api.post("/create/category", data),

  updateCategory: async (id: number, data: { categoryName: string; remark?: string | null }) =>
    api.put(`/update/category/${id}`, data),

  deleteCategory: async (id: number) =>
    api.delete(`/delete/category/${id}`),
};

export const userApi = {
  getCurrentUser: async (): Promise<User> =>
    api
      .get<AxiosResponse<User>>("/user")
      .then((res) => res.data.data),
};

export const academicYearApi = {
  getCurrentAcademicYear: async () => {
    const { data } = await api.get('/get/academic-years');
    // Find the current academic year (where current date falls between start and end date)
    const currentAY = data.data.find((ay: any) => {
      const startDate = new Date(ay.startDate);
      const endDate = new Date(ay.endDate);
      const now = new Date();
      return now >= startDate && now <= endDate;
    });
    return currentAY;
  }
};
