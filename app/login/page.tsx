"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginImage from "./login.jpg";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api, AUTH_TOKEN_KEY } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosResponse } from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<AxiosResponse<LoginResponse>>(
    "/login",
    credentials
  );
  localStorage.setItem(AUTH_TOKEN_KEY, response.data.data.token);
  return response.data.data;
};

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response: LoginResponse) => {
      toast.success("Login successful");
      // push to /dashboard page
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to login");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    loginMutation.mutate({ email, password });
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
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center p-8"
      >
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-blue-950">
              Sign in to your account
            </h1>
            <p className="text-gray-600">
              Enter your credentials to access student discussions, events, and
              more.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="john@example.com"
                type="email"
                className="w-full"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                type="password"
                className="w-full"
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-teal hover:bg-primary-teal/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
