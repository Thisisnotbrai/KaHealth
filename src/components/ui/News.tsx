import { useEffect, useState, useRef, useCallback } from "react";
import { fetchHealthNews } from "@/lib/newsServer";
import NewsCard from "@/components/ui/NewsCard";

interface Article {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  source_id?: string;
}

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("world"); // default worldwide

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const news = await fetchHealthNews(country);
      setArticles(news);
      setVisibleCount(5); // reset visible count when changing country
      setLoading(false);
    }
    loadNews();
  }, [country]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => prev + 5);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const getCountryLabel = (countryCode: string) => {
    const countryMap: { [key: string]: string } = {
      world: "Worldwide",
      ph: "Philippines",
      us: "United States",
      jp: "Japan",
      gb: "United Kingdom",
      in: "India",
      au: "Australia"
    };
    return countryMap[countryCode] || "Global";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Enhanced health-themed header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Latest Health News
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Stay informed with the latest health developments and medical breakthroughs
              </p>
            </div>
          </div>

          {/* Stats indicator */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-400 font-medium">
                {articles.length} articles
              </span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <span className="text-blue-700 dark:text-blue-400 font-medium">
                {getCountryLabel(country)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced country selector */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 sm:p-6 border border-green-100 dark:border-green-800/30">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <label className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                  Select News Region
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Choose your preferred news source location
                </p>
              </div>
            </div>
            
            <div className="flex-1 max-w-xs">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 sm:p-4 border-2 border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <option value="world">🌍 Worldwide</option>
                <option value="ph">🇵🇭 Philippines</option>
                <option value="us">🇺🇸 United States</option>
                <option value="jp">🇯🇵 Japan</option>
                <option value="gb">🇬🇧 United Kingdom</option>
                <option value="in">🇮🇳 India</option>
                <option value="au">🇦🇺 Australia</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-green-100 dark:border-green-900 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
            </div>
            {/* Health pulse animation in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Loading Health News
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center max-w-md">
            Fetching the latest health updates from {getCountryLabel(country)}...
          </p>
          <div className="mt-4 flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          {/* Enhanced empty state */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900 dark:to-yellow-900 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            No Health News Available
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mb-6">
            There are currently no health news articles available for {getCountryLabel(country)}. 
            Try selecting a different region or check back later.
          </p>
          <button
            onClick={() => setCountry("world")}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Worldwide News
          </button>
        </div>
      ) : (
        <>
          {/* Enhanced news grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
            {articles.slice(0, visibleCount).map((article, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <NewsCard article={article} />
              </div>
            ))}
          </ul>

          {/* Enhanced infinite scroll loader */}
          {visibleCount < articles.length && (
            <div ref={loaderRef} className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Loading more health news...
              </p>
              <div className="mt-2 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Completion message */}
          {visibleCount >= articles.length && articles.length > 5 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium mb-1">
                You're all caught up with {getCountryLabel(country)} health news!
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Try selecting a different region for more news
              </p>
            </div>
          )}
        </>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}