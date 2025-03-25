import { useQuery } from "@tanstack/react-query";
import { staffApi } from "@/app/(dashboard)/staff/api";

interface Staff {
  id: number;
  userName: string;
  email: string;
  roleId: number;
  roleName: string;
  departmentId: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useStaff() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: staffApi.fetchLoggedInUser,
  });

  return {
    user,
    isLoading,
  };
} 