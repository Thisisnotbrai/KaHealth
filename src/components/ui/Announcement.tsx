import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const advisoryData = [
  {
    title: "Message Of Support For PAW 2025",
    date: "May 23, 2025",
    image: "/advisories/paw2025.png",
  },
  {
    title: "Invitation to Pre-Bid Conference – Baguio Dialysis Center",
    date: "April 30, 2025",
    image: "/advisories/prebid-baguio.png",
  },
  // Add more as needed
];

const pressReleases = [
  {
    title: "DOH: TAOB, TATAK, TUYO...",
    date: "June 29, 2025",
  },
  {
    title: "DOH NAGBIGAY NG CHECK-UP MENTAL HEALTH SERVICES...",
    date: "June 14, 2025",
  },
  // Add more as needed
];

export default function Announcement() {
  return (
    <section className="px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Advisories Section */}
        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">📣 Kalalake Advisories</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">Read more</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {advisoryData.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
                <CardContent className="p-3">
                  <CardTitle className="text-sm font-semibold line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 mt-1">
                    {item.date}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Press Releases Section */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">📰 Kalalake News</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">See All</a>
          </div>
          <div className="flex flex-col gap-3">
            {pressReleases.map((item, index) => (
              <div
                key={index}
                className="border-b pb-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded"
              >
                <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
