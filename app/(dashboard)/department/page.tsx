"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import _ from "lodash";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const records = [
	{ id: "1", department: "Aung Bo Bo Tun", remark: "This is remark" },
	{ id: "2", department: "Min Thu Kyaw", remark: "Senior Developer" },
	{ id: "3", department: "Zaw Myo Htut", remark: "Project Manager" },
	{ id: "4", department: "Aye Myat Mon", remark: "UI/UX Designer" },
	{ id: "5", department: "Kyaw Zin", remark: "Tech Lead" },
	{ id: "6", department: "Thiri Aung", remark: "Product Owner" },
	{ id: "7", department: "Htet Aung Lin", remark: "Backend Developer" },
	{ id: "8", department: "Su Myat Noe", remark: "Frontend Developer" },
	{ id: "9", department: "Phyo Min Htike", remark: "DevOps Engineer" },
	{ id: "10", department: "Moe Moe Aung", remark: "QA Engineer" },
];

const columns = Object.keys(records[0]);

export default function DepartmentPage() {
	const [sortBy, setSortBy] = useState(columns[0]);
	return (
		<div>
			<div className="flex items-center justify-between py-4">
				<h1 className="text-2xl font-medium">Manage Department</h1>
				<Button>
					<Plus />
					<span>Add Department</span>
				</Button>
			</div>
			<div className="flex items-center justify-between mt-2.5 mb-6">
				<div className="relative w-96">
					<Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
					<Input
						className="pl-9 border-[#e4e4e7]"
						placeholder="Type to search"
					/>
				</div>
				<Select onValueChange={setSortBy}>
					<SelectTrigger className="w-28">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						{columns.map((column) => (
							<SelectItem key={column} value={column}>
								{_.startCase(column)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">ID</TableHead>
						<TableHead>Department</TableHead>
						<TableHead>Remark</TableHead>
						<TableHead className="text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{records
						.sort((a, b) =>
							(a[sortBy as never] as string).localeCompare(b[sortBy as never]),
						)
						.map(({ id, department, remark }, i) => (
							<TableRow key={id}>
								<TableCell>{id}</TableCell>
								<TableCell>{department}</TableCell>
								<TableCell>{remark}</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button variant="ghost" size="icon" className="size-8">
											<Pencil className="h-4 w-4 text-[#71717a]" />
										</Button>
										<Button variant="ghost" size="icon" className="size-8">
											<Trash2 className="h-4 w-4 text-[#df1212]" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
