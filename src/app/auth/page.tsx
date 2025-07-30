"use client";

import { AuthPage } from "@/components/auth/AuthPage";
import { useRouter } from "next/navigation";

export default function AuthPageRoute() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    // Redirect to home page after successful authentication
    router.push("/");
  };

  return <AuthPage onSuccess={handleAuthSuccess} />;
}
