import { SidebarProvider } from "@/components/ui/sidebar";
import {
	BarChart2,
	Building2,
	Calendar,
	FileText,
	LogOut,
	UserCircle,
	Users,
} from "lucide-react";
import { AppSidebar } from "./app-sidebar";

const linkSections = [
	{
		title: "Overview",
		links: [
			{
				icon: <BarChart2 className="h-5 w-5" />,
				text: "System Report",
				href: "",
			},
		],
	},
	{
		title: "Features",
		links: [
			{ icon: <FileText className="h-5 w-5" />, text: "Ideas", href: "" },
			{ icon: <Users className="h-5 w-5" />, text: "Staff", href: "" },
			{
				icon: <UserCircle className="h-5 w-5" />,
				text: "Staff Role",
				href: "",
			},
			{
				icon: <Calendar className="h-5 w-5" />,
				text: "Academic Year",
				href: "",
			},
			{ icon: <Building2 className="h-5 w-5" />, text: "Department", href: "" },
		],
	},
	{
		title: "Setting",
		links: [{ icon: <LogOut className="h-5 w-5" />, text: "Logout", href: "" }],
	},
];

export default function DashboardLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1">{children}</main>
		</SidebarProvider>
	);
}
