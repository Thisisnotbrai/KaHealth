"use client";

import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/ui/Darkmode/mode-toggle";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
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
  { title: "News", href: "#latest-news" },
  { title: "Health Topics", href: "#health-topics" },
  { title: "Announcements", href: "#announcements" },
  { title: "Contact", href: "#" },
];

const Navbar5 = () => {
  return (
    <header className="py-3 sm:py-4 sticky top-0 z-50 bg-white/95 dark:bg-[#162942]/95 backdrop-blur-sm shadow-md border-b border-emerald-200 dark:border-emerald-800">
      <div className="container px-4 sm:px-6 mx-auto">
        <nav className="flex items-center justify-between">
          {/* Simple Health Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              KaHealth
            </span>
          </a>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              {navLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors duration-200"
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

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" className="border-emerald-200 dark:border-emerald-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
                        </svg>
                      </div>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        KaHealth
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="menu">
                      <AccordionTrigger className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                        Menu
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2">
                          {navLinks.map((item, index) => (
                            <a
                              key={index}
                              href={item.href}
                              className="rounded-lg p-3 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
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
    </header>
  );
};

export { Navbar5 };