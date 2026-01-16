"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ArrowRight } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-[440]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg" />
            <span className="text-white tracking-tight">Jeopardy</span>
          </div>

          <p className="text-neutral-400">Host your game or join others</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300 text-sm">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-700 transition-all duration-200"
                  required
                />
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={false}
                  animate={{
                    boxShadow:
                      focusedField === "email"
                        ? "0 0 0 1px rgba(139, 92, 246, 0.3)"
                        : "0 0 0 0px rgba(139, 92, 246, 0)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-neutral-300 text-sm">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:bg-neutral-900 focus:border-neutral-700 transition-all duration-200"
                  required
                />
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={false}
                  animate={{
                    boxShadow:
                      focusedField === "password"
                        ? "0 0 0 1px rgba(139, 92, 246, 0.3)"
                        : "0 0 0 0px rgba(139, 92, 246, 0)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-white hover:bg-neutral-100 text-neutral-950 group relative overflow-hidden transition-colors duration-200"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-neutral-950 px-4 text-neutral-600">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300 hover:border-neutral-700 transition-all duration-200"
            >
              <svg className="size-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 bg-transparent border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300 hover:border-neutral-700 transition-all duration-200"
            >
              <svg
                className="size-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </Button>
          </div>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-neutral-600 mt-8"
        >
          Don't have an account?{" "}
          <a
            href="#"
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Sign up
          </a>
        </motion.p>
      </div>
    </div>
  );
}
