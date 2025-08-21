interface Article {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  source_id?: string;
  image_url?: string; // 👈 added for article images
}

export default function NewsCard({ article }: { article: Article }) {
  return (
    <li className="group p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-emerald-900/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 dark:border-emerald-800/30 overflow-hidden">
      {/* Health-themed accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
      
      {article.image_url && (
        <a 
          href={article.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block relative overflow-hidden rounded-xl mb-4 group-hover:scale-[1.02] transition-transform duration-300"
        >
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-32 sm:h-40 md:h-48 lg:h-52 object-cover transition-all duration-300 group-hover:brightness-110"
          />
          {/* Health-themed overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      )}

      <div className="space-y-3">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-base sm:text-lg lg:text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 leading-tight line-clamp-2"
        >
          {article.title}
        </a>

        {article.description && (
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Enhanced metadata section with health-themed styling */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-green-100 dark:border-emerald-800/30">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {article.pubDate && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="font-medium">
                  {new Date(article.pubDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {article.source_id && article.pubDate && (
              <span className="text-green-300 dark:text-green-600">•</span>
            )}
            {article.source_id && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                <span className="font-semibold text-green-700 dark:text-green-400 text-xs sm:text-sm">
                  {article.source_id}
                </span>
              </div>
            )}
          </div>
          
          {/* Health-themed read more indicator */}
          <div className="flex items-center text-xs text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="font-medium">Read More</span>
            <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </li>
  );
}