type Department = "Engineering" | "Marketing" | "HR" | "Networking" | "Student";

type SystemReportStats = {
  totalIdeas: number;
  totalComments: number;
  totalDepartments: number;
};

type DepartmentData = {
  name: Department;
  percentage: number;
  ideasCount: number;
};

type TopUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ideasSubmitted: number;
  ideasViewed: number;
  commentsCount: number;
};

type SystemReportData = {
  stats: SystemReportStats;
  departmentData: DepartmentData[];
  topUsers: TopUser[];
  dateRange: {
    start: string;
    end: string;
  };
};

export type {
  Department,
  SystemReportStats,
  DepartmentData,
  TopUser,
  SystemReportData,
};
