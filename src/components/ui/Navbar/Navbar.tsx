"use client";

import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/ui/Darkmode/mode-toggle";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/Navbar/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Navbar/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Navbar/accordion";

import { Button } from "@/components/ui/Navbar/button";

const navLinks = [
  { title: "Home", href: "#" },
  { title: "Health Events", href: "#events" },
  { title: "Health News", href: "#latest-news" },
  { title: "Announcements", href: "#announcements" },
  { title: "Resources", href: "#health-resources" },
  { title: "Emergency", href: "#emergency-contact" },
];

const Navbar5 = () => {
  return (
    <header className="sticky top-0 z-[100] w-full">
      <div className="py-3 sm:py-4 bg-white/98 dark:bg-[#0f2820]/98 backdrop-blur-xl shadow-lg border-b-2 border-green-200/60 dark:border-emerald-500/30 transition-all duration-300 will-change-transform">
        {/* Subtle health-themed gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/3 via-emerald-500/3 to-teal-500/3 pointer-events-none"></div>
        
        <div className="container px-4 sm:px-6 mx-auto relative">
          <nav className="flex items-center justify-between">
            {/* Enhanced Health Logo */}
            <a href="#" className="flex items-center gap-2 sm:gap-3 group hover:scale-105 transition-transform duration-200">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <img 
                  src="/KaHealth-Logo-2.png" 
                  alt="KaHealth Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-emerald-400 group-hover:text-green-700 dark:group-hover:text-emerald-300 transition-colors duration-200">
                  KaHealth
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Information Portal
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:block">
              <NavigationMenuList className="gap-1">
                {navLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-emerald-400 hover:bg-green-50/80 dark:hover:bg-emerald-950/40 rounded-xl transition-all duration-200 border border-transparent hover:border-green-200/50 dark:hover:border-emerald-500/30"
                    >
                      {link.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ModeToggle />

              {/* Hidden button (admin login entry point) */}
              <Button 
                variant="outline"
                size="icon"
                className="border-green-200 dark:border-emerald-800 hover:bg-green-50 dark:hover:bg-emerald-950/40 hover:border-green-300 dark:hover:border-emerald-600 transition-all duration-200"
                onClick={() => window.location.href = "/admin/login"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600 dark:text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-green-200 dark:border-emerald-800 hover:bg-green-50 dark:hover:bg-emerald-950/40 hover:border-green-300 dark:hover:border-emerald-600 transition-all duration-200"
                  >
                    <Menu className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="top" 
                  className="max-h-screen overflow-auto bg-white/98 dark:bg-[#0f2820]/98 backdrop-blur-xl border-b-2 border-green-200/60 dark:border-emerald-500/30"
                >
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12m6-6H6" />
                          </svg>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-green-600 dark:text-emerald-400">
                            HealthHub
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                            Barangay Portal
                          </span>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col p-4 gap-4">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="menu" className="border-green-200/60 dark:border-emerald-500/30">
                        <AccordionTrigger className="text-base font-semibold text-green-600 dark:text-emerald-400 hover:text-green-700 dark:hover:text-emerald-300">
                          Navigation Menu
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 mt-2">
                            {navLinks.map((item, index) => (
                              <a
                                key={index}
                                href={item.href}
                                className="rounded-xl p-4 text-gray-700 dark:text-gray-300 hover:bg-green-50/80 dark:hover:bg-emerald-950/40 hover:text-green-600 dark:hover:text-emerald-400 transition-all duration-200 border border-transparent hover:border-green-200/50 dark:hover:border-emerald-500/30 font-medium"
                              >
                                {item.title}
                              </a>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export { Navbar5 };
