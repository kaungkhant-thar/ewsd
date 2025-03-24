import CategoryIcon from "@/icons/Category";
import {
  LayoutGrid,
  ClipboardList,
  User,
  Menu,
  Users,
  Calendar,
  Building,
  Bell,
} from "lucide-react";

type MenuItem = {
  icon: React.ReactNode;
  text: string;
  href: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type RoleMenuConfig = {
  [key: string]: MenuSection[];
};

export const menuConfig: RoleMenuConfig = {
  admin: [
    {
      title: "Overview",
      items: [
        {
          icon: <LayoutGrid className="size-4" />,
          text: "System Report",
          href: "/system-report",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          icon: <ClipboardList className="size-4" />,
          text: "Ideas",
          href: "/ideas",
        },
        {
          icon: <User className="size-4" />,
          text: "Staff",
          href: "/staff",
        },
        {
          icon: <Menu className="size-4" />,
          text: "Category",
          href: "/category",
        },
        {
          icon: <Users className="size-4" />,
          text: "Staff Role",
          href: "/staff-role",
        },
        {
          icon: <Calendar className="size-4" />,
          text: "Academic Year",
          href: "/academic-year",
        },
        {
          icon: <Building className="size-4" />,
          text: "Department",
          href: "/department",
        },
      ],
    },
  ],
  manager: [
    {
      title: "Overview",
      items: [
        {
          icon: <LayoutGrid className="size-4" />,
          text: "System Report",
          href: "/system-report",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          icon: <ClipboardList className="size-4" />,
          text: "Ideas",
          href: "/ideas",
        },
        {
          icon: <CategoryIcon className="size-4" />,
          text: "Category",
          href: "/category",
        },
        {
          icon: <Users className="size-4" />,
          text: "Reported Ideas",
          href: "/reported-ideas",
        },
        {
          icon: <Calendar className="size-4" />,
          text: "Academic Year",
          href: "/academic-year",
        },
      ],
    },
  ],
  coordinator: [
    {
      title: "Overview",
      items: [
        {
          icon: <LayoutGrid className="size-4" />,
          text: "System Report",
          href: "/system-report",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          icon: <ClipboardList className="size-4" />,
          text: "Ideas",
          href: "/ideas",
        },
        {
          icon: <Bell className="size-4" />,
          text: "Announcement",
          href: "/announcement",
        },
      ],
    },
  ],
  staff: [
    {
      title: "Overview",
      items: [
        {
          icon: <LayoutGrid className="size-4" />,
          text: "System Report",
          href: "/system-report",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          icon: <ClipboardList className="size-4" />,
          text: "Ideas",
          href: "/ideas",
        },
        {
          icon: <ClipboardList className="size-4" />,
          text: "Submitted Ideas",
          href: "/submitted-ideas",
        },
      ],
    },
  ],
};
