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
  const [visibleCount, setVisibleCount] = useState(5); // show first 5 initially
  const [loading, setLoading] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const news = await fetchHealthNews();
      setArticles(news);
      setLoading(false);
    }
    loadNews();
  }, []);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setVisibleCount((prev) => prev + 5); // load 5 more each time
      }
    },
    []
  );

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

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading latest health news...</p>;
  }

  if (articles.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No health news available at the moment.</p>;
  }

  return (
    <>
      <ul className="space-y-4">
        {articles.slice(0, visibleCount).map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </ul>

      {/* Loader trigger */}
      {visibleCount < articles.length && (
        <div
          ref={loaderRef}
          className="text-center py-4 text-gray-500 dark:text-gray-400"
        >
          Loading more news...
        </div>
      )}
    </>
  );
}
