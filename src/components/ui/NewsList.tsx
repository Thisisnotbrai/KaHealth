import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

interface Article {
  title: string;
  description?: string;
  link: string;
  image_url?: string;
}

const NewsList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${
            import.meta.env.VITE_NEWSDATA_API_KEY
          }&country=ph&category=health&language=en`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setArticles(data.results || []);
      } catch (error) {
        console.error("Failed to fetch health news", error);
        setError("Unable to load health news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Health-themed header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-lg animate-pulse"></div>
            <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="ml-11 h-4 w-72 sm:w-96 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>

        {/* Loading state with health-themed animation */}
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-green-100 dark:border-green-900 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
            </div>
            {/* Pulsing medical cross in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 text-green-500 animate-pulse">
                <div className="w-6 h-2 bg-current rounded-full"></div>
                <div className="w-2 h-6 bg-current rounded-full absolute top-0 left-2"></div>
              </div>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Loading Health News
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center max-w-md">
            Fetching the latest health updates from the Philippines...
          </p>
        </div>

        {/* Loading skeleton grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg animate-pulse">
              <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          {/* Health-themed error icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Unable to Load Health News
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          {/* Health-themed empty state icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            No Health News Available
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md">
            There are currently no health news articles available. Please check back later for updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Health-themed header section */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 8c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8zM8 4h6v2H8V4zm6 16H8v-2h6v2zm5-4H3V8h2v1c0 .6.4 1 1 1s1-.4 1-1V8h6v1c0 .6.4 1 1 1s1-.4 1-1V8h2v8z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Philippines Health News
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Latest health developments and medical updates from the Philippines
            </p>
          </div>
        </div>
        
        {/* Health stats indicator */}
        <div className="flex items-center gap-2 ml-12 sm:ml-16">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              {articles.length} articles available
            </span>
          </div>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Updated regularly
          </span>
        </div>
      </div>

      {/* Enhanced responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {articles.map((article, index) => (
          <div
            key={index}
            className="transform transition-all duration-300 hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          >
            <NewsCard article={article} />
          </div>
        ))}
      </div>

      {/* Health-themed footer message */}
      <div className="mt-12 sm:mt-16 text-center py-8 border-t border-green-100 dark:border-green-900">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            Stay informed, stay healthy
          </p>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
          Health news updates are sourced from reliable medical and news organizations
        </p>
      </div>

      {/* CSS for fade-in animation */}
      <style>
        {`
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
        `}
      </style>
    </div>
  );
};

export default NewsList;