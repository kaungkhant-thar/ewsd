import Logo from "@/components/ui/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	BarChart2,
	Building2,
	Calendar,
	FileText,
	UserCircle,
	Users,
} from "lucide-react";
import Link from "next/link";
import { NavUser } from "./nav-user";

const linkSections = [
	{
		title: "Overview",
		links: [
			{
				icon: <BarChart2 className="size-4" />,
				text: "System Report",
				href: "",
			},
		],
	},
	{
		title: "Features",
		links: [
			{ icon: <FileText className="size-4" />, text: "Ideas", href: "" },
			{ icon: <Users className="size-4" />, text: "Staff", href: "" },
			{
				icon: <UserCircle className="size-4" />,
				text: "Staff Role",
				href: "",
			},
			{
				icon: <Calendar className="size-4" />,
				text: "Academic Year",
				href: "",
			},
			{ icon: <Building2 className="size-4" />, text: "Department", href: "" },
		],
	},
];

export function AppSidebar() {
	return (
		<Sidebar className="py-2">
			<SidebarHeader>
				<div className="flex justify-between items-center px-2">
					<div className="flex items-center space-x-2 w-full">
						<Logo className="w-8" />
						<div>
							<h1 className="text-sm font-semibold">Synergy</h1>
							<p className="text-xs">v1.0</p>
						</div>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{linkSections.map(({ title, links }) => (
					<SidebarGroup key={title}>
						<SidebarGroupLabel>{title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="px-2">
								{links.map(({ icon, text, href }) => (
									<SidebarMenuItem key={title}>
										<SidebarMenuButton asChild>
											<Link href={href}>
												{icon}
												<span>{text}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{ name: "John Doe", email: "john@synergy.com", avatar: "" }}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
