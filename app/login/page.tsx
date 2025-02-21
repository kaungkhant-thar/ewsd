'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import loginImage from './login.jpg';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    // Handle form submission
    console.log('Form submitted:', email, password);

    redirect('/role-management');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 lg:p-6">
      {/* Image container - shown differently on mobile vs desktop */}
      <div className="relative min-h-80 lg:h-full">
        <Image
          src={loginImage}
          alt="University library interior"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Form container */}
      <form onSubmit={handleSubmit} className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#020617]">Sign in to your account</h1>
            <p className="text-[#475569]">Enter your credentials to access student discussions, events, and more.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="john@example.com" type="email" className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                type="password"
                className="w-full"
              />
            </div>
            <Button className="w-full bg-[#0284c7] hover:bg-[#0284c7]/90">Sign In</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
