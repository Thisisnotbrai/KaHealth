"use client";

import { useState, useEffect } from "react";
import { Navbar5 } from './Navbar/Navbar';
import Header from './Header';
import News from './News';
import Footer from './Footer';
import RequestMedicineForm from "./RequestMedicineForm";
import { Button } from "./Navbar/button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { ArrowRight, HeartHandshake, LockKeyhole, Newspaper, Pill, ShieldCheck, Sparkles} from "lucide-react";

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.14),transparent_20%),linear-gradient(180deg,#f8fffd_0%,#eefcf7_100%)] text-slate-900 transition-all duration-500 ease-in-out dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.1),transparent_20%),linear-gradient(180deg,#08141d_0%,#102433_100%)] dark:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-200/50 bg-white/95 shadow-lg backdrop-blur-md transition-all duration-300 dark:border-teal-500/20 dark:bg-[#162942]/95">
        <Navbar5 />
      </header>

      <div className="relative overflow-hidden pt-16 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40" aria-hidden="true">
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-emerald-300/25 blur-3xl" />
          <div className="absolute right-10 top-32 h-20 w-20 rounded-full bg-teal-300/25 blur-2xl" />
          <div className="absolute bottom-12 left-1/4 h-28 w-28 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
        <Header />
      </div>

      <main className="relative mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:space-y-12" role="main">
        <section
          id="hero"
          className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/85 shadow-[0_25px_80px_-35px_rgba(15,118,110,0.28)] backdrop-blur-xl transition-all duration-300 dark:border-emerald-500/20 dark:bg-white/5"
          role="banner"
          aria-label="Hero section"
        >
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
            <div className="space-y-6">
              <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Health portal
              </Badge>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                  KaHealth brings community health updates and support into one place.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                  It is a barangay health portal for residents, caregivers, and local health staff who need trusted advisories, health news, and a simple way to act next.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => scrollToSection("announcements")}
                  className="h-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/25"
                >
                  Explore advisories
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => scrollToSection("latest-news")}
                  className="h-11 rounded-full border-emerald-200 bg-white/90 px-5 text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/20 dark:bg-white/10 dark:text-emerald-200"
                >
                  Read health news
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 to-emerald-50 p-5 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-emerald-500/10 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Why use KaHealth</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Trusted support, faster decisions</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900/50">
                  <Pill className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {(() => {
                  const features: { title: string; description: string; tone: string; Icon: React.ComponentType<any> }[] = [
                    { title: "Trusted updates", description: "Announcements and news in a clear layout", tone: "from-emerald-500 to-teal-500", Icon: Newspaper },
                    { title: "Simple actions", description: "Request medicine or explore resources quickly", tone: "from-teal-500 to-cyan-500", Icon: Pill },
                    { title: "Easy to follow", description: "Readable text, clear spacing, and guided steps", tone: "from-slate-500 to-slate-700", Icon: Sparkles },
                  ];

                  return features.map(({ title, description, tone, Icon }) => (
                    <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/30">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone} shadow-sm`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{description}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </section>

        <section
          id="auth-promo"
          className="overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-[1px] shadow-[0_20px_60px_-35px_rgba(15,118,110,0.5)]"
          role="region"
          aria-label="Login and register promotion"
        >
          <div className="grid gap-6 rounded-[calc(2rem-1px)] bg-white/95 p-6 backdrop-blur-xl dark:bg-slate-950/80 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
            <div className="space-y-4">
              <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                <HeartHandshake className="mr-2 h-3.5 w-3.5" />
                Join KaHealth
              </Badge>
              <div className="space-y-3">
                <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  Register or sign in to get the fastest access to advisories, medicine requests, and community support.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Make a free account to save your details, then use the same portal anytime to log in and continue where you left off.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => window.location.href = "/login?tab=register"}
                  className="h-11 rounded-full bg-white px-5 text-emerald-700 shadow-lg shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  Register now
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => window.location.href = "/login?tab=login"}
                  className="h-11 rounded-full border border-white/40 bg-white/10 px-5 text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <LockKeyhole className="h-4 w-4" />
                  Sign in
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Login for returning users",
                  description: "Pick up your saved information and continue faster.",
                },
                {
                  title: "Registration for new users",
                  description: "Create your profile once and use the portal anytime.",
                },
                {
                  title: "Safer support flow",
                  description: "Keep requests and contact details in one account.",
                },
                {
                  title: "Always accessible",
                  description: "Open the portal from any device when you need it.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-white/60 bg-white/90 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        <section
          id="latest-news"
          className="space-y-4"
          role="region"
          aria-labelledby="latest-news-heading"
        >
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <Badge className="w-fit border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
                Local stories
              </Badge>
              <h2 id="latest-news-heading" className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Health news & updates
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Read public health stories and updates that help people make informed choices.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => scrollToSection("health-resources")}
              className="hidden rounded-full px-4 text-blue-700 hover:bg-blue-50 hover:text-blue-800 sm:inline-flex dark:text-blue-200 dark:hover:bg-white/10"
            >
              Resources <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-[2rem] border border-blue-100 bg-white/90 p-4 shadow-[0_20px_60px_-35px_rgba(37,99,235,0.24)] backdrop-blur-xl sm:p-6 lg:p-8 dark:border-blue-500/20 dark:bg-white/5">
            <News />
          </div>
        </section>

      </main>

      <footer className="border-t border-emerald-200/50 bg-gradient-to-r from-white/70 to-emerald-50/40 backdrop-blur-sm will-change-transform dark:border-teal-500/20 dark:from-gray-900/60 dark:to-emerald-900/10" role="contentinfo">
        <Footer />
      </footer>

      {showMedicineForm && (
        <RequestMedicineForm open={showMedicineForm} setOpen={setShowMedicineForm} />
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 group animate-bounce"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <div className="flex items-center justify-center h-full">
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform group-hover:scale-110 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 10l7-7m0 0l7 7m-7-7v18" 
              />
            </svg>
          </div>
          
          {/* Health-themed pulse effect */}
          <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></div>
        </button>
      )}
      
    </div>
  );
};

export default LandingPage;