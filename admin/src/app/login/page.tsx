"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(password);
    } catch (err: any) {
      setError(err.message || "Invalid password");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4 border border-orange-100">
            <Lock className="w-6 h-6 text-[#f05a28]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            Enter your secure password to access the Synergy dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f05a28] hover:bg-[#d64a1d] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
