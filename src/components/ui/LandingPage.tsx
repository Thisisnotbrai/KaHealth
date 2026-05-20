"use client";

import { useState, useEffect } from "react";
import { Navbar5 } from './Navbar/Navbar';
import Header from './Header';
import Announcement from './Announcement'; 
import FeedbackForm from "./FeedbackForm";
import News from './News';
import Footer from './Footer';
import RequestMedicineForm from "./RequestMedicineForm";
import { Button } from "./Navbar/button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { ArrowRight, BellRing, ClipboardList, HeartHandshake, LockKeyhole, MessageSquareText, Newspaper, Pill, ShieldCheck, Sparkles, Users } from "lucide-react";

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

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Users,
                    title: "Residents",
                    description: "Check advisories, updates, and community services.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Caregivers",
                    description: "Stay informed and respond quickly to important notices.",
                  },
                  {
                    icon: ClipboardList,
                    title: "Health staff",
                    description: "Share information and manage requests in one flow.",
                  },
                ].map((item) => (
                  <Card key={item.title} className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                {[
                  ["Trusted updates", "Announcements and news in a clear layout", "from-emerald-500 to-teal-500"],
                  ["Simple actions", "Request medicine or explore resources quickly", "from-teal-500 to-cyan-500"],
                  ["Easy to follow", "Readable text, clear spacing, and guided steps", "from-slate-500 to-slate-700"],
                ].map(([title, description, tone]) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/30">
                    <div className={`h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br ${tone} shadow-sm`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{description}</p>
                    </div>
                  </div>
                ))}
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
          id="announcements"
          className="space-y-4"
          role="region"
          aria-labelledby="announcements-heading"
        >
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                What it does
              </Badge>
              <h2 id="announcements-heading" className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Latest advisories and community notices
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Find the newest health notices first, with important updates highlighted for quick reading.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => scrollToSection("latest-news")}
              className="hidden rounded-full px-4 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 sm:inline-flex dark:text-emerald-200 dark:hover:bg-white/10"
            >
              Next section <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-[2rem] border border-amber-100 bg-white/90 p-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-6 lg:p-8 dark:border-amber-500/20 dark:bg-white/5">
            <Announcement />
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

        <section
          id="health-resources"
          className="space-y-5"
          role="region"
          aria-labelledby="health-resources-heading"
        >
          <div className="px-1">
            <Badge className="w-fit border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200">
              Next steps
            </Badge>
            <h2 id="health-resources-heading" className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              What should you do next?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Choose a path below depending on whether you want updates, support, or a way to contact the team.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Read advisories",
                description: "Open the latest announcements and important health notices.",
                icon: BellRing,
                tone: "from-blue-500 to-cyan-600",
                buttonLabel: "View advisories",
                action: () => scrollToSection("announcements"),
              },
              {
                title: "Request medicine",
                description: "Open the medicine request form and submit details when needed.",
                icon: Newspaper,
                tone: "from-emerald-500 to-teal-600",
                buttonLabel: "Open form",
                action: () => setShowMedicineForm(true),
              },
              {
                title: "Send feedback",
                description: "Share suggestions or questions so the service can improve.",
                icon: MessageSquareText,
                tone: "from-violet-500 to-fuchsia-600",
                buttonLabel: "Leave feedback",
                action: () => scrollToSection("feedback"),
              },
            ].map((resource) => (
              <Card key={resource.title} className="overflow-hidden rounded-[1.75rem] border-slate-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
                <CardContent className="space-y-5 p-5 sm:p-6">
                  <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${resource.tone}`} />
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${resource.tone} text-white shadow-lg`}>
                      <resource.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                        {resource.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {resource.description}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={resource.action}
                    className={`h-11 w-full rounded-full bg-gradient-to-r ${resource.tone} text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl`}
                  >
                    {resource.buttonLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          id="feedback"
          className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
          role="region"
          aria-labelledby="feedback-heading"
        >
          <Card className="rounded-[2rem] border-emerald-100 bg-white/90 shadow-[0_20px_60px_-35px_rgba(15,118,110,0.24)] dark:border-white/10 dark:bg-white/5">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <Badge className="w-fit border-green-200 bg-green-50 text-green-700 shadow-sm dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-200">
                Contact and feedback
              </Badge>
              <h2 id="feedback-heading" className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Questions, suggestions, or concerns?
              </h2>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                Use this form to tell the team what you need, what is missing, or what should be easier to use.
              </p>
              <div className="space-y-3 pt-2 text-sm text-slate-600 dark:text-slate-300">
                {[
                  "A clearer next step",
                  "A missed announcement",
                  "A feature request",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <MessageSquareText className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-6">
            <FeedbackForm />
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