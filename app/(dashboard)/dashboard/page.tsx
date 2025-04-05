"use client";

import React from "react";
import { AdminSystemReport } from "./AdminSystemReport";
import { useCurrentUser } from "../app-sidebar";
import { Loader2 } from "lucide-react";
import { StaffRoleName } from "../staff/api";
import { QAManagerSystemReport } from "./QaManagerSystemReport";

const reports: Record<StaffRoleName, React.ReactNode> = {
  admin: <AdminSystemReport />,
  manager: <QAManagerSystemReport />,
  coordinator: <AdminSystemReport />,
  staff: "staff",
};
const Page = () => {
  const user = useCurrentUser();
  if (!user)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );

  return reports[user.roleName] || <div>Unauthorized</div>;
};

export default Page;
