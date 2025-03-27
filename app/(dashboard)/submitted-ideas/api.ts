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
  totalLikes: number;
  totalUnlikes: number;
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

type Reaction = {
  id: number;
  user_id: number;
  idea_id: number;
  reaction: 'like' | 'unlike';
  remark: string | null;
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

export const reactionApi = {
  createReaction: async (ideaId: number, userId: number, reaction: 'like' | 'unlike') => {
    const { data } = await api.post('/createReaction', {
      ideaId,
      userId,
      reaction,
      remark: null
    });
    return data;
  },

  getTotalLikes: async (ideaId: number) => {
    const { data } = await api.get(`/getTotalLike/${ideaId}`);
    return data;
  },

  getTotalUnlikes: async (ideaId: number) => {
    const { data } = await api.get(`/getTotalUnLike/${ideaId}`);
    return data;
  },

  getReactionsByIdeaId: async (ideaId: number) => {
    const { data } = await api.get<AxiosResponse<Reaction[]>>(`/readReactionByIdeaId/${ideaId}`);
    return data.data;
  }
};
