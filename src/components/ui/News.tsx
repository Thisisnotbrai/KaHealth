import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const newsItems = [
  {
    title: "DOH Launches New Vaccination Drive",
    date: "July 28, 2025",
    description: "The Department of Health begins its community immunization campaign to curb rising infections.",
  },
  {
    title: "Health Alert: Dengue Season Begins",
    date: "July 25, 2025",
    description: "DOH advises the public to maintain clean surroundings and remove stagnant water.",
  },
  {
    title: "Mental Health Awareness Month",
    date: "July 15, 2025",
    description: "Workshops and webinars available for all ages. Learn how to manage stress and anxiety.",
  },
];

const News = () => {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-[#162942] dark:text-white">Latest News</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-300 border-muted bg-white dark:bg-[#1e2f4a]">
            <CardHeader>
              <CardTitle className="text-[#162942] dark:text-white text-base">
                {item.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#162942] dark:text-gray-300">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default News;
