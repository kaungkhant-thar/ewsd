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
export const systemReportApi = {
  fetchTopUsers: async (id: string) =>
    api
      .get<AxiosResponse<TopUser[]>>(`/getTopActiveUserByDepartment/${id}`)
      .then((res) => res.data.data),
};
