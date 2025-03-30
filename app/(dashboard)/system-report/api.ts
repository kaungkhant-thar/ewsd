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
};
