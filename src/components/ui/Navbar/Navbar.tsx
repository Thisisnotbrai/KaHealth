"use client";

import { MenuIcon } from "lucide-react";
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
    <header className="py-4 sticky top-0 z-50 bg-white dark:bg-[#162942] shadow-sm border-b border-border">
      <div className="container px-4 mx-auto">
        <nav className="flex items-center justify-between">
          {/* Text Logo */}
          <a href="#" className="text-xl font-bold tracking-tight text-[#162942] dark:text-white">
            KaHealth
          </a>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              {navLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={link.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <span className="text-lg font-semibold tracking-tight text-[#162942] dark:text-white">
                      KaHealth
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="menu">
                      <AccordionTrigger className="text-base">
                        Menu
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2">
                          {navLinks.map((item, index) => (
                            <a
                              key={index}
                              href={item.href}
                              className="rounded-md p-2 text-foreground hover:bg-muted/70 transition-colors"
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
