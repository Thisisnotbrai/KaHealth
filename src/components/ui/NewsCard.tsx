interface Article {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  source_id?: string;
}

export default function NewsCard({ article }: { article: Article }) {
  return (
    <li className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        {article.title}
      </a>
      {article.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{article.description}</p>
      )}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {article.pubDate && <span>{new Date(article.pubDate).toLocaleDateString()}</span>}
        {article.source_id && <span> • {article.source_id}</span>}
      </div>
    </li>
  );
}
