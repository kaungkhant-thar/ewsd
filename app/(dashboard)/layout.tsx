import { BarChart2, FileText, Users, UserCircle, Building2, Calendar, LogOut, ChevronLeft } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      <main className="flex-1 bg-[#fafafa]">{children}</main>
    </div>
  );
}
