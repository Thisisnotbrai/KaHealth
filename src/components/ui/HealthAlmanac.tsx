import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const healthTopics = [
  { title: "Mental Health", description: "Tips to reduce stress and improve emotional well-being." },
  { title: "Nutrition", description: "Essential food groups and proper diet planning." },
  { title: "Exercise", description: "Daily workouts and physical activity suggestions." },
  { title: "Maternal Care", description: "Guides for expecting and new mothers." },
  { title: "Child Health", description: "Vaccination schedules and childhood diseases." },
  { title: "Elderly Care", description: "Health support for senior citizens." },
];

const HealthAlmanac = () => {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-[#162942] dark:text-white">Health Topics</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {healthTopics.map((topic, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-muted bg-white dark:bg-[#1e2f4a] cursor-pointer">
            <CardHeader>
              <CardTitle className="text-[#162942] dark:text-white text-base">{topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#162942] dark:text-gray-300">{topic.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HealthAlmanac;
