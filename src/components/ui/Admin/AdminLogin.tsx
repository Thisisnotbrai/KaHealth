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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-4 sm:px-6 lg:px-8">
      {/* Background Medical Pattern */}
      <div className="absolute inset-0 opacity-[0.02] overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rotate-45">
          <div className="w-full h-2 bg-emerald-600 rounded"></div>
          <div className="w-2 h-full bg-emerald-600 rounded absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 rotate-45">
          <div className="w-full h-1.5 bg-green-600 rounded"></div>
          <div className="w-1.5 h-full bg-green-600 rounded absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <div className="absolute top-1/2 left-1/6 w-10 h-10 rotate-45">
          <div className="w-full h-2.5 bg-teal-600 rounded"></div>
          <div className="w-2.5 h-full bg-teal-600 rounded absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Logo Placeholder */}
          <div className="mb-4 sm:mb-6">
            <img 
              src="/KaHealth-Logo-2.png" 
              alt="KaHealth Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto object-contain"
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            KaHealth Admin
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Secure Healthcare Management Portal
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl border border-emerald-100 space-y-4 sm:space-y-6 backdrop-blur-sm"
        >
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Administrator Login
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto rounded-full"></div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center flex items-center justify-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-emerald-600">📧</span>
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="admin@kahealth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-emerald-600">🔒</span>
                <span>Password</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm sm:text-base"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base flex items-center justify-center space-x-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>🏥</span>
                <span>Access Admin Portal</span>
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 text-center flex items-center justify-center space-x-1">
              <span className="text-emerald-500">🛡️</span>
              <span>Secured with end-to-end encryption</span>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-500">
            © 2024 KaHealth. Healthcare data protected & secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;