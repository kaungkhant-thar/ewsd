'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle } from 'lucide-react';
import React from 'react';

export default function Page() {
  const [formData, setFormData] = React.useState({
    roleName: '',
    remark: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };
  return (
    <main className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Staff Role /</div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Thet Aung Tun</h2>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-6">Add your staff role details here. Click save when you're done</div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-end">
          <form onSubmit={handleSubmit} className="space-y-6 min-w-[40rem]">
            <div className="grid gap-2">
              <label htmlFor="roleName" className="text-sm font-medium text-gray-900">
                Role name
              </label>
              <Input
                id="roleName"
                value={formData.roleName}
                onChange={(e) => setFormData((prev) => ({ ...prev, roleName: e.target.value }))}
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="remark" className="text-sm font-medium text-gray-900">
                Remark
              </label>
              <Textarea
                id="remark"
                value={formData.remark}
                onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
                className="min-h-[150px] w-full"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-primary-teal hover:bg-primary-teal/90">
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
