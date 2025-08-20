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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${
            import.meta.env.VITE_NEWSDATA_API_KEY
          }&country=ph&category=health&language=en`
        );
        const data = await response.json();
        setArticles(data.results || []);
      } catch (error) {
        console.error("Failed to fetch health news", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <NewsCard
          key={index}
          article={article}
        />
      ))}
    </div>
  );
};

export default NewsList;