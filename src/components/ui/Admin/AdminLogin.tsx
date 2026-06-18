"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { Input } from "../Input";
import { Button } from "../Navbar/button";
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Invalid email or password.");
    } else {
      setError(null);
      navigate("/admin/dashboard");
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-4 sm:px-6 lg:px-8 pt-16 sm:pt-10 pb-8">
      {/* Background Medical Pattern */}
      <div className="absolute inset-0 opacity-[0.03] overflow-hidden pointer-events-none">
        <div className="absolute top-[18%] left-[22%] w-10 h-10 rotate-12">
          <div className="w-full h-2.5 bg-emerald-600 rounded-sm"></div>
          <div className="w-2.5 h-full bg-emerald-600 rounded-sm absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="absolute top-[72%] right-[20%] w-8 h-8 -rotate-12">
          <div className="w-full h-2 bg-green-600 rounded-sm"></div>
          <div className="w-2 h-full bg-green-600 rounded-sm absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="absolute top-[45%] left-[8%] w-12 h-12 rotate-45">
          <div className="w-full h-3 bg-teal-600 rounded-sm"></div>
          <div className="w-3 h-full bg-teal-600 rounded-sm absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="absolute top-[30%] right-[12%] w-7 h-7 rotate-[25deg]">
          <div className="w-full h-1.5 bg-emerald-500 rounded-sm"></div>
          <div className="w-1.5 h-full bg-emerald-500 rounded-sm absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="absolute bottom-[15%] left-[35%] w-9 h-9 -rotate-[15deg]">
          <div className="w-full h-2 bg-teal-500 rounded-sm"></div>
          <div className="w-2 h-full bg-teal-500 rounded-sm absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-5">
          {/* Logo */}
          <div className="mb-3 sm:mb-4">
            <img
              src="/KaHealth-Logo-2.png"
              alt="KaHealth Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 tracking-tight">
            KaHealth Admin
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Secure Healthcare Management Portal
          </p>
        </div>
        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white/90 p-5 sm:p-7 lg:p-8 rounded-2xl shadow-xl border border-emerald-100/80 space-y-4 sm:space-y-5 backdrop-blur-md"
        >
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Administrator Login
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm sm:text-base text-center flex items-center justify-center gap-2.5">
              {/* Warning Triangle Icon */}
              <svg
                className="w-5 h-5 text-red-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}
          <div className="space-y-3.5 sm:space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                className="text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                {/* Envelope Icon */}
                <svg
                  className="w-5 h-5 text-emerald-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <span>Email Address</span>
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 sm:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-base sm:text-lg bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                {/* Lock Icon */}
                <svg
                  className="w-5 h-5 text-emerald-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <span>Password</span>
              </label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 sm:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-base sm:text-lg bg-gray-50/50 placeholder:text-gray-400"
              />
            </div>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3.5 sm:py-4 px-6 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-base sm:text-lg flex items-center justify-center gap-2.5"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                {/* Building/Hospital Icon */}
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                  />
                </svg>
                <span>Access Admin Portal</span>
              </>
            )}
          </Button>
          {/* Security Notice */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-sm sm:text-base text-gray-500 text-center flex items-center justify-center gap-2">
              {/* Shield Check Icon */}
              <svg
                className="w-4.5 h-4.5 text-emerald-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
              <span>Secured with end-to-end encryption</span>
            </p>
          </div>
        </form>
        {/* Footer */}
        <div className="text-center mt-4 sm:mt-5">
          <p className="text-sm sm:text-base text-gray-500">
            &copy; 2025 KaHealth. Healthcare data protected &amp; secure.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;