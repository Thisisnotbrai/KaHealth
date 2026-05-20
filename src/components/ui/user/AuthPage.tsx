"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Navbar/button";
import { Textarea } from "@/components/ui/Textarea";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
} from "lucide-react";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    age: "",
    sex: "",
    contact: "",
    address: "",
    email: "",
    password: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");

    if (tab === "login" || tab === "register" || tab === "forgot") {
      setActiveTab(tab);
      return;
    }

    setActiveTab("login");
  }, [location.search]);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Login successful!");

    window.location.href = "/dashboard";
  };

  const handleRegister = async () => {
    const {
      full_name,
      age,
      sex,
      contact,
      address,
      email,
      password,
    } = registerForm;

    if (
      !full_name ||
      !contact ||
      !address ||
      !email ||
      !password
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name,
          age: age ? Number(age) : null,
          sex,
          contact,
          address,
        });

      if (profileError) {
        setLoading(false);
        toast.error(profileError.message);
        return;
      }
    }

    setLoading(false);

    toast.success("Registration successful! Please check your email.");

    setRegisterForm({
      full_name: "",
      age: "",
      sex: "",
      contact: "",
      address: "",
      email: "",
      password: "",
    });
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      forgotEmail,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <HeartPulse className="text-white" size={30} />
          </div>

          <div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              KaHealth
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Community Healthcare Medicine Request System
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full h-12 rounded-xl bg-gray-100">
              <TabsTrigger value="login" className="rounded-lg">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg">
                Register
              </TabsTrigger>
              <TabsTrigger value="forgot" className="rounded-lg">
                Forgot Password
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 rounded-xl"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-12 rounded-xl"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Input
                    placeholder="Enter full name"
                    className="pl-10 h-12 rounded-xl"
                    value={registerForm.full_name}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        full_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    placeholder="Age"
                    className="h-12 rounded-xl"
                    value={registerForm.age}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        age: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sex</Label>
                  <select
                    className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={registerForm.sex}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        sex: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contact Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Input
                    placeholder="09XX XXX XXXX"
                    className="pl-10 h-12 rounded-xl"
                    value={registerForm.contact}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        contact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Textarea
                    placeholder="Enter complete address"
                    className="pl-10 rounded-xl min-h-24"
                    value={registerForm.address}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Input
                    type="email"
                    placeholder="Enter email"
                    className="pl-10 h-12 rounded-xl"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Input
                    type="password"
                    placeholder="Create password"
                    className="pl-10 h-12 rounded-xl"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="forgot" className="mt-6 space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                Enter your email address and we will send a password reset link.
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 rounded-xl"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Sending reset link...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
