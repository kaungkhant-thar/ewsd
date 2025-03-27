import { api } from "@/lib/api";
import { AxiosResponse } from "axios";

export const systemReportApi = {
  fetchTopUsers: async (id: string) =>
    api
      .get<AxiosResponse>(`/getTopActiveUserByDepartment/${id}`)
      .then((res) => res.data.data),
};
