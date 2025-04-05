import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

type TopUser = {
  userId: number;
  userName: string;
  email: string;
  ideaCount: number;
  viewCount: number;
  commentCount: number;
};

export interface CardReport {
  commentCount: number;
  ideaCount: number;
  departmentCount: number;
}

export interface ChartsData {
  academicYearId: string;
  academicName: string;
  totalIdeas: number;
  data: Array<{
    departmentId: number;
    departmentName: string;
    ideaCount: number;
    percentage: number;
  }>;
}

export type ContributorsByDepartment = {
  academicYearId: string;
  academicName: string;
  data: Array<{
    departmentId: number;
    departmentName: string;
    contributorCount: number;
  }>;
};

export type AnnonymousCounts = {
  anonymousIdeaCount: number;
  anonymousCommentCount: number;
};

export type Ideas = Array<{
  id: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  viewCount: number;
  popularity: number;
  userId: number;
  categoryId: number;
  academicYearId: number;
  remark: string;
  createdAt: string;
  updatedAt: string;
}>;
export const systemReportApi = {
  fetchTopUsers: async (academicYear: string) =>
    api
      .get<AxiosResponse<TopUser[]>>(
        `/getTopActiveUserByAcademicYear/${academicYear}`
      )
      .then((res) => res.data.data),
  fetchCardReports: async (academicYear: string) =>
    api
      .get<AxiosResponse<CardReport>>(
        `get/system-report-counts/${academicYear}`
      )
      .then((res) => res.data.data),
  fetchChartsData: async (academicYear: string) =>
    api
      .get<ChartsData>(
        `/getIdeasByDepartmentAccordingToAcademicYear/${academicYear}`
      )
      .then((res) => res.data),

  fetchAnnonymousCounts: async (academicYear: string) =>
    api
      .get<AxiosResponse<AnnonymousCounts>>(
        `/getAnonymousCountsByAcademicYearForManager/${academicYear}`
      )
      .then((res) => res.data.data),

  fetchContributorsByDepartment: async (academicYear: string) =>
    api
      .get<AxiosResponse<ContributorsByDepartment>>(
        `/getContributorByDepartment/${academicYear}`
      )
      .then((res) => res.data.data),

  fetchMostViewedIdeas: async (academicYear: string) =>
    api
      .get<AxiosResponse<Ideas>>(`/getMostViewedIdeas/${academicYear}`)
      .then((res) => res.data.data),
};
