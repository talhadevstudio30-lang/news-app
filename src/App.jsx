import React, { useEffect, useState, useRef } from "react";
import Header from "./Components/Header";
import SelectedArticle from "./Components/SelectedArticle";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return saved === 'true';
      // Default: system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  // Apply dark mode class to root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    const url =
      category === "general" && query.trim()
        ? `https://newsapi.org/v2/everything?q=${query}&pageSize=30&language=en&sortBy=publishedAt&apiKey=b996d6f51c59466493e61f4240017e2e`
        : `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=30&language=en&apiKey=b996d6f51c59466493e61f4240017e2e`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        setError("Something broke 😵‍💫");
      }
    } catch {
      setError("Network error 🚨");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const Search_Btn = () => {
    setCategory("general");
    fetchNews();
  }

  // Close modal function
  const closeModal = () => {
    setSelectedArticle(null);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Date Unknown";

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <>
      <div>
        <Header
          setCategory={setCategory}
          setQuery={setQuery}
          category={category}
          Search_Btn={Search_Btn}
          query={query}
           
        />
      </div>
      <div className="min-h-screen bg-[#F1F5F9] px-4 pt-10">
        {/* Header */}
        <div className="max-w-9xl mx-auto">

          {/* States */}
          {loading && (
            <p className="text-center text-gray-500 animate-pulse">
              Fetching fresh news 👀
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 font-medium">{error}</p>
          )}

          {/* Grid */}
          <div className="flex flex-col w-full md:flex-row flex-wrap justify-center items-stretch gap-6">
            {articles.slice(0, visibleCount).map((item, index) => {
              

              return (
                <div
                  key={index}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc(30.333%-16px)]  2xl:w-[calc(25.333%-16px)] min-h-100 flex flex-col rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image Section */}
                  <div className="relative h-58 shrink-0">
                    {item.urlToImage ? (
                      <>
                        <img
                          src={item.urlToImage}
                          alt={item.title || "News image"}
                          className="h-full w-full object-cover"
                        />
                        <div className="image-fallback absolute inset-0 hidden bg-gray-100 rounded-lg flex-col items-center justify-center text-gray-400">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                            <line x1="3" y1="3" x2="21" y2="21" />
                          </svg>
                          <span className="mt-2 text-sm font-medium">Image Not Available</span>
                        </div>
                      </>

                    ) : (
                      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                          <line x1="3" y1="3" x2="21" y2="21" />
                        </svg>
                        <span className="mt-2 text-sm font-medium">Image Not Available</span>
                      </div>
                    )}

                    {/* Source */}
                    <span className="absolute bottom-0 left-0 text-xs text-gray-200 tracking-wide bg-[#01010183] px-3 py-1 rounded-tr-2xl">
                      {item.source?.name || "Unknown Source"}
                    </span>
                  </div>

                  {/* Content - Flex grow to fill remaining space */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h2
                      className="text-lg cursor-pointer font-bold text-gray-900 leading-snug mb-3 line-clamp-2 hover:text-blue-600 transition-colors"
                      onClick={() => setSelectedArticle(item)}
                    >
                      {item.title || "No Title Available"}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-3">
                      {item.description?.split(" ").slice(0, 25).join(" ") ||
                        "No description available for this article."}
                      {item.description?.split(" ").length > 25 ? "..." : ""}
                    </p>

                    {/* Footer - Fixed at bottom of card content */}
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
                      <span className="text-gray-500 flex items-center gap-1">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {item.publishedAt ?
                          new Date(item.publishedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) :
                          "Date Unknown"
                        }
                      </span>

                      <button
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1 transition-colors cursor-pointer duration-200"
                        onClick={() => setSelectedArticle(item)}
                      >
                        Read Full Story
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!loading && articles.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No news found 😶
          </p>
        )}

        {!loading && articles.length > 6 && (
          <div className="flex justify-center mt-10 gap-4">
            {visibleCount < articles.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Show more 🔽
              </button>
            )}

            {visibleCount > 6 && (
              <button
                onClick={() => setVisibleCount((prev) => prev - 6)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              >
                Show less 🔼
              </button>
            )}
          </div>
        )}

        <SelectedArticle
          selectedArticle={selectedArticle}
          onClose={closeModal}
          formatDate={formatDate}
        />
      </div >
    </>
  );
}