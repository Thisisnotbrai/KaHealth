import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchHealthNews } from "@/lib/newsServer";
import NewsCard from "@/components/ui/NewsCard";
import { Heart, Globe, AlertCircle, RefreshCw, CheckCircle2, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface Article {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  source_id?: string;
}

interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) => {
  const getVisiblePages = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('ellipsis-start');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState("world");
  const [currentPage, setCurrentPage] = useState(1);
  const [, setRetryCount] = useState(0);

  const articlesPerPage = 6;
  const maxArticles = 20;

  const countries: CountryOption[] = useMemo(() => [
    { code: "world", name: "Worldwide", flag: "🌍" },
    { code: "ph", name: "Philippines", flag: "🇵🇭" },
    { code: "us", name: "United States", flag: "🇺🇸" },
    { code: "jp", name: "Japan", flag: "🇯🇵" },
    { code: "gb", name: "United Kingdom", flag: "🇬🇧" },
    { code: "in", name: "India", flag: "🇮🇳" },
    { code: "au", name: "Australia", flag: "🇦🇺" }
  ], []);

  const selectedCountry = useMemo(() => 
    countries.find(c => c.code === country) || countries[0], 
    [country, countries]
  );

  // Limit articles to maxArticles and calculate pagination
  const limitedArticles = useMemo(() => 
    articles.slice(0, maxArticles), 
    [articles, maxArticles]
  );

  const totalPages = Math.ceil(limitedArticles.length / articlesPerPage);
  
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    return limitedArticles.slice(startIndex, endIndex);
  }, [limitedArticles, currentPage, articlesPerPage]);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const news = await fetchHealthNews(country);
      setArticles(news);
      setCurrentPage(1); // Reset to first page when changing country
      setRetryCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [country]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadNews();
  }, [loadNews]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of news section
    document.querySelector('[data-news-section]')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }, []);

  const handleCountryChange = useCallback((newCountry: string) => {
    setCountry(newCountry);
    setCurrentPage(1);
  }, []);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load News
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={handleRetry}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Health News
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Latest medical insights and health updates
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                {limitedArticles.length} of {articles.length} articles
              </span>
            </div>
            {currentPage && totalPages > 1 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Country Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <label htmlFor="country-select" className="font-medium text-gray-900 dark:text-white">
                  News Region
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Currently showing: {selectedCountry.flag} {selectedCountry.name}
                </p>
              </div>
            </div>
            
            <select
              id="country-select"
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* News Section */}
      <div data-news-section>
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Loading News
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching latest updates from {selectedCountry.name}...
            </p>
          </div>
        ) : limitedArticles.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No News Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              No health news articles found for {selectedCountry.name}. Try a different region or check back later.
            </p>
            <button
              onClick={() => handleCountryChange("world")}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Try Worldwide News
            </button>
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentArticles.map((article, index) => (
                <div
                  key={`${article.link}-${currentPage}-${index}`}
                  className="opacity-0 animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <NewsCard article={article} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                
                {/* Page Info */}
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((currentPage - 1) * articlesPerPage) + 1} to {Math.min(currentPage * articlesPerPage, limitedArticles.length)} of {limitedArticles.length} articles
                    {articles.length > maxArticles && (
                      <span className="ml-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded text-xs">
                        Limited to {maxArticles} articles
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Single Page Completion Message */}
            {totalPages === 1 && limitedArticles.length > 0 && (
              <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    All {limitedArticles.length} articles from {selectedCountry.name} shown
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}