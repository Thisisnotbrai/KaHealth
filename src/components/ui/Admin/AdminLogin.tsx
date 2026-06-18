"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { Input } from "../Input";
import { Button } from "../Navbar/button";

type Tab = "login" | "register";
type RegStep = 1 | 2;

const AdminLogin = () => {
  const [tab, setTab] = useState<Tab>("login");
  const [regStep, setRegStep] = useState<RegStep>(1);

  // ── Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── Register – Step 1 (auth.users)
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // ── Register – Step 2 (end_user + profiles)
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const switchTab = (t: Tab) => {
    setTab(t);
    setError(null);
    setSuccess(null);
    setRegStep(1);
  };

  // ── Login: sign in then check role → redirect accordingly
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Check role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .single();

    if (profileError || !profile) {
      setError("Could not retrieve user role. Please contact support.");
      setLoading(false);
      return;
    }

    if (profile.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }

    setLoading(false);
  };

  // ── Step 1: client-side validation only, no Supabase call yet
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setRegStep(2);
  };

  // ── Step 2: create auth user → insert profiles → insert end_user
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (signUpError) throw new Error(signUpError.message);

      const userId = authData.user?.id;
      if (!userId) throw new Error("User creation failed. Please try again.");

      // 3. Insert into end_user
      const { error: endUserError } = await supabase.from("end_user").insert({
        id: userId,
        full_name: fullName,
        age: age ? parseInt(age) : null,
        sex: sex || null,
        contact,
        address,
      });
      if (endUserError) throw new Error("End user creation failed: " + endUserError.message);

      setSuccess("Registration successful! Please check your email to confirm your account, then sign in.");
      setRegEmail(""); setRegPassword(""); setRegConfirm("");
      setFullName(""); setAge(""); setSex(""); setContact(""); setAddress("");
      setRegStep(1);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  // ── Shared feedback banner
  const FeedbackBanner = () => (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5 mb-4">
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5 mb-4">
          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="font-medium">{success}</span>
        </div>
      )}
    </>
  );

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
        {/* Header */}
        <div className="text-center mb-4 sm:mb-5">
          <div className="mb-3 sm:mb-4">
            <img
              src="/KaHealth-Logo-2.png"
              alt="KaHealth Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 tracking-tight">
            KaHealth
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Secure Healthcare Management Portal
          </p>
        </div>

        <div className="bg-white/90 p-5 sm:p-7 lg:p-8 rounded-2xl shadow-xl border border-emerald-100/80 backdrop-blur-md">
          {/* Tab Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-5 sm:mb-6">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                tab === "login"
                  ? "bg-white text-gray-800 shadow-sm border border-gray-200/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                tab === "register"
                  ? "bg-white text-gray-800 shadow-sm border border-gray-200/80"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          <FeedbackBanner />

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="login-email" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  Email Address
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-base text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-base text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-base flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div><span>Signing in...</span></>
                ) : (
                  <><svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" /></svg><span>Sign In</span></>
                )}
              </Button>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === "register" && (
            <>
              {/* Step indicator */}
              <div className="flex items-center mb-5">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    regStep === 1 ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {regStep > 1 ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    ) : "1"}
                  </div>
                  <span className={`text-sm ${regStep === 1 ? "font-medium text-gray-800" : "text-gray-400"}`}>Account</span>
                </div>
                <div className="w-8 h-px bg-gray-200 mx-1" />
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    regStep === 2 ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}>2</div>
                  <span className={`text-sm ${regStep === 2 ? "font-medium text-gray-800" : "text-gray-400"}`}>Profile</span>
                </div>
              </div>

              {/* Step 1 — credentials */}
              {regStep === 1 && (
                <form onSubmit={handleStep1} className="space-y-3.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">
                    Create your account
                  </p>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g. juan@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Confirm password <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="Repeat your password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-200/50 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                  </Button>
                </form>
              )}

              {/* Step 2 — profile */}
              {regStep === 2 && (
                <form onSubmit={handleStep2} className="space-y-3.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-100">
                    Your profile
                  </p>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Juan dela Cruz"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Age</label>
                      <Input
                        type="number"
                        placeholder="e.g. 32"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min={0}
                        max={120}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Sex</label>
                      <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Contact number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 09XX-XXX-XXXX"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-200/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div><span>Creating account...</span></>
                    ) : (
                      <><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg><span>Complete registration</span></>
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setRegStep(1); setError(null); }}
                    className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    ← Back
                  </button>
                </form>
              )}
            </>
          )}

          {/* Security notice */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              Secured with end-to-end encryption
            </p>
          </div>
        </div>

        <div className="text-center mt-4 sm:mt-5">
          <p className="text-sm text-gray-500">
            &copy; 2025 KaHealth. Healthcare data protected &amp; secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;