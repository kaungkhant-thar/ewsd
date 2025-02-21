import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart2,
  FileText,
  Users,
  UserCircle,
  Building2,
  Calendar,
  LogOut,
  ChevronLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
} from 'lucide-react';

export default function StaffManagementPage() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e4e4e7] flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <ChevronLeft className="h-5 w-5 text-[#025964]" />
            <h1 className="text-xl font-semibold text-[#025964]">Synergy</h1>
          </div>

          <nav className="space-y-8">
            <div>
              <p className="text-sm text-[#71717a] mb-3">Overview</p>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#3f3f46] hover:bg-[#f5f7f9] rounded-md">
                  <BarChart2 className="h-5 w-5" />
                  <span>System Report</span>
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#71717a] mb-3">Features</p>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#3f3f46] hover:bg-[#f5f7f9] rounded-md">
                  <FileText className="h-5 w-5" />
                  <span>Ideas</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#3f3f46] hover:bg-[#f5f7f9] rounded-md">
                  <Users className="h-5 w-5" />
                  <span>Staff</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#025964] bg-[#f5f7f9] rounded-md">
                  <UserCircle className="h-5 w-5" />
                  <span>Staff Role</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#3f3f46] hover:bg-[#f5f7f9] rounded-md">
                  <Calendar className="h-5 w-5" />
                  <span>Academic Year</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#3f3f46] hover:bg-[#f5f7f9] rounded-md">
                  <Building2 className="h-5 w-5" />
                  <span>Department</span>
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#71717a] mb-3">Setting</p>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#3f3f46] hover:bg-[#f5f7f9] rounded-md">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-[#e4e4e7]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#025964] flex items-center justify-center text-white">S</div>
            <div>
              <p className="font-medium text-[#18181b]">Staff name (user role)</p>
              <p className="text-sm text-[#71717a]">@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#fafafa]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-[#18181b]">Manage Staff Role</h2>
            <Button className="bg-[#025964] hover:bg-[#025964]/90">
              <Plus className="h-5 w-5 mr-2" />
              Add staff
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 flex justify-between items-center border-b border-[#e4e4e7]">
              <div className="relative w-[300px]">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <Input placeholder="Type a command or search..." className="pl-9 border-[#e4e4e7]" />
              </div>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>1</TableCell>
                      <TableCell>Thet Aung Tun</TableCell>
                      <TableCell>Lorem ipsum</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4 text-[#71717a]" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-[#df1212]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
