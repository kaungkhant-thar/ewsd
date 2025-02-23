"use client";
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
	Building,
	Calendar,
	ClipboardList,
	LayoutGrid,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";

const linkSections = [
	{
		title: "Overview",
		links: [
			{
				icon: <LayoutGrid className="size-4" />,
				text: "System Report",
				href: "/system-report",
			},
		],
	},
	{
		title: "Features",
		links: [
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
];

export function AppSidebar() {
	const pathname = usePathname();

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
									<SidebarMenuItem key={text}>
										<SidebarMenuButton
											asChild
											isActive={pathname.includes(href)}
										>
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
