import React, { useEffect, useState, useRef } from "react";
import Header from "./Components/Header";
import SelectedArticle from "./Components/SelectedArticle";
import Footer from "./Components/Footer";
import Articles from "./Components/Articles";


export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_NEWS_API_KEY;


    // If the user has entered a query, use the "everything" endpoint.
    // Otherwise fall back to top-headlines for the selected category.
    const url = query.trim()
      ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=30&language=en&sortBy=publishedAt&apiKey=${apiKey}`
      : `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=30&language=en&apiKey=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data)
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
  const [category_name, setcategory_name] = useState()
  // helper to log the current category (fixes typo `cetagory`)
  const logCategory = () => {
    setcategory_name(category)
  };

  useEffect(() => {
    fetchNews();
    logCategory();
  }, [category]);

  const Search_Btn = () => {
    fetchNews();
    setcategory_name(`${query}`);
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


  // Function to handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      Search_Btn();
      setcategory_name(query);
    }
  };


  return (
    <>
      <div>
        <Header
          setCategory={setCategory}
          setQuery={setQuery}
          category={category}
          setcategory_name={setcategory_name}
          Search_Btn={Search_Btn}
          query={query}
          category_name={category_name}
          handleSearch={handleSearch}

        />
      </div>
      <div className="min-h-screen bg-[#F1F5F9] px-4 pt-3">
        {/* Header */}
        <div className="max-w-9xl mx-auto">

          {/* States */}
          {loading && (
            <div className="w-full mb-7.5 max-w-md mx-auto bg-white rounded-4xl shadow-lg p-8 border border-gray-100" role="status" aria-live="polite">
              <div className="flex flex-col items-center gap-8 mt-4.5">
                {/* Animated newspaper icon */}
                <div className="relative">

                  <div className="w-20 h-20 bg-linear-to-br from-blue-50 to-white rounded-2xl flex items-center justify-center shadow-inner border border-blue-100">
                    <div className="relative">
                      <svg className="w-16 h-16 text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>

                  {/* Spinning loader */}
                  <div className="absolute -inset-7">
                    <div className="absolute inset-0 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-blue-50 border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="w-full max-w-xs pt-1.5">

                  <div className="text-center">
                    <p className="text-gray-800 font-semibold text-lg mb-2">Fetching Latest News</p>
                    <p className="text-gray-500 text-sm">Gathering headlines from around the world...</p>

                    {/* Live updates */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-blue-700 font-medium">Live Updates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="relative max-w-md mx-auto overflow-hidden rounded-2xl bg-red-100 p-5 shadow-lg">
              <div className="absolute inset-0 bg-linear-to-r from-red-500/5 to-transparent"></div>
              <div className="relative flex items-center">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-600 shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-900">Error Occurred</h4>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div>
            <Articles articles={articles} visibleCount={visibleCount} setSelectedArticle={setSelectedArticle}/>
          </div>


          {!loading && articles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative mb-8">
                <div className="w-38 md:w-44 md:h-44 h-38   bg-linear-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-inner">
                  {/* Animated search icon */}
                  <div className="relative">
                    <svg className="w-14 md:w-20 md:h-20 h-14 text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-gray-200 rounded-full animate-ping opacity-20"></div>
                    </div>
                  </div>
                </div>

                {/* Floating emoji */}
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <svg
                    className="text-3xl text-blue-400"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    {/* Face circle */}
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />

                    {/* Eyes - dots for simple expression */}
                    <circle cx="8.5" cy="10" r="1" fill="currentColor" />
                    <circle cx="15.5" cy="10" r="1" fill="currentColor" />

                    {/* Neutral to slightly sad mouth - minimal curve */}
                    <path d="M9 15C10.5 16 13.5 16 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-blue-500 mb-2">No News Found</h3>
              <p className="text-gray-500 mb-8 text-center max-w-md">We couldn't find any news matching your search criteria.</p>

            </div>
          )}

          {!loading && articles.length > 6 && (
            <div className="flex justify-center mt-12 gap-3">
              {visibleCount < articles.length && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="group flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  <span className="font-medium">Load More</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}

              {visibleCount > 6 && (
                <button
                  onClick={() => setVisibleCount((prev) => prev - 6)}
                  className="group flex items-center gap-2 rounded-2xl px-6 py-3 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  <svg
                    className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 11l7-7 7 7M5 19l7-7 7 7"
                    />
                  </svg>
                  <span className="font-medium">Show Less</span>
                </button>
              )}
            </div>
          )}
          <div className="mt-10 pb-5">
            <Footer />
          </div>
          <SelectedArticle
            selectedArticle={selectedArticle}
            onClose={closeModal}
            formatDate={formatDate}
          />
        </div>
      </div>
    </>
  )
}