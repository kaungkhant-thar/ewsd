import { api } from "@/lib/api";
import { Axios, AxiosResponse } from "axios";

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

export type MostUsedBrowsers = {
  message: string;
  logs: Array<{
    browser: string;
    count: number;
  }>;
};

export type Ideas = Array<{
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
  remark: string;
  createdAt: string;
  updatedAt: string;
  totalLikes: number;
  totalUnlikes: number;
  commentsCount: number;
}>;

export type CoordinatorData = {
  ideaCount: number;
  commentCount: number;
  upVoteCount: number;
  downVoteCount: number;
  ideaWithoutCommentCount: number;
  anonymousCommentCount: number;
  anonymousIdeaCount: number;

  mostViewedIdeas: Array<{
    id: number;
    title: string;
    view_count: number;
    comment_count: number;
    upvote_count: string;
    downvote_count: string;
    total_engagement: string;
    author: string;
  }>;
};

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

  fetchMostUsedBrowsers: async () =>
    api.get<MostUsedBrowsers>("/logged-in-browsers").then((res) => res.data),

  fetchCoordinatorData: async (academicYearId: string, departmentId: string) =>
    api
      .get<AxiosResponse<CoordinatorData>>(
        `/getCountsByAYForQACoordinator/${academicYearId}/${departmentId}`
      )
      .then((res) => res.data.data),
};
