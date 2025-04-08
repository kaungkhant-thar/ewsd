import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

export interface User {
  id: number;
  userName: string;
  email: string;
  departmentId?: number;
  isDisable: boolean;
}

export interface Idea {
  id: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  viewCount: number;
  popularity: number;
  reportCount: number;
  isHidden: boolean;
  userId: number;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  comments?: any[]; // Comments if available
}

export interface ReportedIdea {
  id: number;
  userId: number;
  ideaId: number;
  createdAt: string;
  updatedAt: string;
  idea: Idea;
  author: User;
  reporter: User;
}

export const reportedIdeaApi = {
  fetchReportedIdeas: async (): Promise<ReportedIdea[]> =>
    api
      .get<AxiosResponse<ReportedIdea[]>>("/get/reportedIdeas")
      .then((res) => res.data.data),

  fetchReportedIdeasByUserId: async (userId: number): Promise<ReportedIdea[]> =>
    api
      .get<AxiosResponse<ReportedIdea[]>>(`/get/reportedIdeaByUserId/${userId}`)
      .then((res) => res.data.data),

  reportIdea: async (userId: number, ideaId: number) =>
    api.post("/report/idea", { userId, ideaId }),

  deleteReportedIdea: async (id: number) =>
    api.delete(`/delete/reportedIdea/${id}`),

  // User blocking/unblocking API - using existing endpoints from UserController
  blockUser: async (id: number) =>
    api.post(`/blockUser/${id}`),

  activateUser: async (id: number) =>
    api.post(`/unblockUser/${id}`),

  // Idea API (for hiding posts by deleting ideas)
  deleteIdea: async (id: number) =>
    api.delete(`/delete/idea/${id}`),
    
  // Updated to use the new hide/show API endpoints
  hidePost: async (id: number) =>
    api.post(`/hide/idea/${id}`),
    
  unhidePost: async (id: number) =>
    api.post(`/show/idea/${id}`),

  // Additional API for fetching individual idea details
  fetchIdeaDetails: async (id: number): Promise<Idea & { comments: any[] }> =>
    api.get(`/get/idea/${id}/details`).then((res) => res.data.data),
}; 