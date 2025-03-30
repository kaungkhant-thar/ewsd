import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

export interface ReportedIdea {
  id: number;
  userId: number;
  ideaId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isBlocked: boolean;
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

  // User blocking API
  blockUser: async (id: number) =>
    api.post(`/blockUser/${id}`),

  unblockUser: async (id: number) =>
    api.post(`/unblockUser/${id}`),

  // Idea API (for hiding posts by deleting)
  deleteIdea: async (id: number) =>
    api.delete(`/delete/idea/${id}`),

  // Additional APIs for fetching related data
  fetchIdea: async (id: number): Promise<Idea> =>
    api.get(`/get/idea/${id}`).then((res) => res.data.data),

  fetchUser: async (id: number): Promise<User> =>
    api.get(`/readUserById/${id}`).then((res) => res.data.data),
}; 