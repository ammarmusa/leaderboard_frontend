"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthProvider } from "@/contexts/AuthContext";

type AuthMode = "login" | "register";

interface AuthPageProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
}

const AuthPageContent: React.FC<AuthPageProps> = ({
  initialMode = "login",
  onSuccess,
}) => {
  const [currentMode, setCurrentMode] = useState<AuthMode>(initialMode);

  const switchToLogin = () => setCurrentMode("login");
  const switchToRegister = () => setCurrentMode("register");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Leaderboard
          </h1>
          <p className="text-gray-600">Track and manage job assignments</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentMode === "login" ? (
            <LoginForm
              key="login"
              onSwitchToRegister={switchToRegister}
              onSuccess={onSuccess}
            />
          ) : (
            <RegisterForm
              key="register"
              onSwitchToLogin={switchToLogin}
              onSuccess={onSuccess}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>© 2025 Job Leaderboard. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export const AuthPage: React.FC<AuthPageProps> = (props) => {
  return (
    <AuthProvider>
      <AuthPageContent {...props} />
    </AuthProvider>
  );
};
