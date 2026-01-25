import React, { useState, useEffect, useRef, useCallback } from 'react';

const Example = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [activeCategory, setActiveCategory] = useState('earthquake');
    const [bookmarks, setBookmarks] = useState(() => {
        // Load bookmarks from localStorage on initial render
        try {
            const savedBookmarks = localStorage.getItem('geoNewsBookmarks');
            return savedBookmarks ? JSON.parse(savedBookmarks) : [];
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            return [];
        }
    });
    const [darkMode, setDarkMode] = useState(() => {
        // Load theme preference from localStorage
        try {
            const savedTheme = localStorage.getItem('geoNewsTheme');
            return savedTheme ? JSON.parse(savedTheme) : false;
        } catch (error) {
            console.error('Error loading theme:', error);
            return false;
        }
    });
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('publishedAt');
    const [searchDebounced, setSearchDebounced] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
    const [articlesPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const modalRef = useRef();
    const searchTimeoutRef = useRef(null);

    const categories = [
        { id: 'earthquake', name: '🌍 Earthquakes', color: 'from-blue-500 to-purple-600' },
        { id: 'disaster', name: '⚠️ Disasters', color: 'from-red-500 to-orange-500' },
        { id: 'weather', name: '⛅ Weather', color: 'from-cyan-500 to-blue-400' },
        { id: 'environment', name: '🌱 Environment', color: 'from-green-500 to-emerald-600' },
        { id: 'science', name: '🔬 Science', color: 'from-purple-500 to-pink-600' },
        { id: 'global', name: '🌐 Global', color: 'from-indigo-500 to-blue-600' },
    ];

    const sortOptions = [
        { id: 'publishedAt', name: 'Latest' },
        { id: 'relevancy', name: 'Relevance' },
        { id: 'popularity', name: 'Popular' },
    ];

    // Save theme preference to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('geoNewsTheme', JSON.stringify(darkMode));
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }, [darkMode]);

    // Save bookmarks to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('geoNewsBookmarks', JSON.stringify(bookmarks));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    }, [bookmarks]);

    // Fetch news when category or sortBy changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            fetchNews(activeCategory);
        }
    }, [activeCategory, sortBy]);

    // Debounce search input
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.trim()) {
            setIsSearching(true);
            searchTimeoutRef.current = setTimeout(() => {
                setSearchDebounced(searchQuery);
                handleSearch(searchQuery);
            }, 500);
        } else {
            setSearchDebounced('');
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    // Filter articles based on search and bookmarks
    useEffect(() => {
        if (!data?.articles) return;

        let filtered = [...data.articles];

        // Apply search filter if searchDebounced exists
        if (searchDebounced.trim()) {
            const query = searchDebounced.toLowerCase().trim();
            filtered = filtered.filter(article => {
                const title = article.title?.toLowerCase() || '';
                const description = article.description?.toLowerCase() || '';
                const content = article.content?.toLowerCase() || '';
                const source = article.source?.name?.toLowerCase() || '';
                const author = article.author?.toLowerCase() || '';

                return title.includes(query) ||
                    description.includes(query) ||
                    content.includes(query) ||
                    source.includes(query) ||
                    author.includes(query);
            });
        }

        // Show bookmarks only if toggle is on
        if (showBookmarksOnly) {
            filtered = filtered.filter(article =>
                bookmarks.some(b => b.title === article.title)
            );
        }

        setFilteredArticles(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [data, searchDebounced, bookmarks, showBookmarksOnly]);

    const fetchNews = async (query = 'earthquake') => {
        setLoading(true);
        setError(null);
        setIsSearching(false);

        try {
            // Use a more specific query for better results
            const searchQuery = query === 'earthquake' ? 'earthquake OR seismic OR tremor' : query;

            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}&pageSize=10&language=en&apiKey=6dcd1c6f3d1d44a5916196044ec1d7b4`
            );

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const newsData = await response.json();
            if (newsData.status === 'error') {
                throw new Error(newsData.message || 'API Error');
            }

            // Filter out articles without title or content
            const validArticles = (newsData.articles || []).filter(article =>
                article.title &&
                article.title !== '[Removed]' &&
                article.source?.name
            );

            setData({ ...newsData, articles: validArticles });

        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.message);

            // Improved fallback mock data
            const mockData = {
                articles: Array.from({ length: 20 }, (_, i) => {
                    const titles = [
                        `Major Earthquake Hits Coastal Region - Magnitude ${(Math.random() * 4 + 3).toFixed(1)}`,
                        `Seismic Activity Detected Near Fault Line - Experts Monitoring`,
                        `Earthquake Early Warning System Activated - Emergency Response Deployed`,
                        `Tsunami Warning Issued After Underwater Quake`,
                        `Structural Damage Reported After Seismic Event`,
                        `International Aid Mobilized for Earthquake Relief`,
                        `Geological Survey Updates Seismic Risk Assessment`,
                        `Earthquake Preparedness: New Safety Guidelines Released`,
                        `Historical Earthquake Patterns Show Increased Activity`,
                        `Technology Advances in Earthquake Prediction Show Promise`
                    ];

                    const descriptions = [
                        `A significant seismic event has been recorded with detailed analysis of impact zones. Emergency services are responding.`,
                        `Scientists are analyzing the data to understand the tectonic movements behind this seismic activity.`,
                        `Local authorities have initiated emergency protocols and evacuation procedures in affected areas.`,
                        `International monitoring stations have confirmed the earthquake's magnitude and epicenter location.`,
                        `Damage assessment teams are being deployed to evaluate infrastructure and building safety.`,
                        `Relief organizations are coordinating efforts to provide aid to affected communities.`,
                        `Geological experts are studying the implications for future seismic activity in the region.`,
                        `New technologies are being used to monitor aftershocks and assess ongoing risks.`,
                        `Historical data suggests this could be part of a larger seismic pattern developing in the area.`,
                        `Advancements in early warning systems helped minimize casualties during this event.`
                    ];

                    return {
                        title: titles[i % titles.length],
                        description: descriptions[i % descriptions.length],
                        urlToImage: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWFydGhxdWFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80&${Date.now() + i}`,
                        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
                        source: {
                            name: ['Geo News', 'Seismic Alert', 'Earth Monitor', 'Disaster Watch', 'Science Daily'][i % 5]
                        },
                        url: `#article-${i}`,
                        content: `Detailed report on seismic activity. The earthquake registered a magnitude of ${(Math.random() * 4 + 3).toFixed(1)} on the Richter scale. Epicenter was located at coordinates ${(Math.random() * 180 - 90).toFixed(2)}°N, ${(Math.random() * 360 - 180).toFixed(2)}°E. Local authorities have initiated emergency protocols and damage assessment is underway. International geological agencies are monitoring aftershock patterns.`,
                        author: ['Dr. Sarah Chen', 'Prof. James Wilson', 'Geological Survey Team', 'Emergency Response Unit', 'Science Correspondent'][i % 5]
                    };
                })
            };

            setData(mockData);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback((query) => {
        if (query.trim()) {
            fetchNews(query);
            setActiveCategory('');
        } else {
            fetchNews(activeCategory);
        }
    }, [activeCategory]);

    const handleArticleClick = (article) => {
        setSelectedArticle(article);
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        setSelectedArticle(null);
        document.body.classList.remove('overflow-hidden');
    };

    const handleBookmark = (article) => {
        setBookmarks(prev => {
            const exists = prev.find(b => b.title === article.title);
            if (exists) {
                return prev.filter(b => b.title !== article.title);
            } else {
                return [...prev, { ...article, bookmarkedAt: new Date().toISOString() }];
            }
        });
    };

    const clearAllBookmarks = () => {
        if (window.confirm('Are you sure you want to clear all bookmarks?')) {
            setBookmarks([]);
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Date unavailable';
        }
    };

    const getTimeAgo = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(hours / 24);

            if (minutes < 1) return 'Just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            return formatDate(dateString);
        } catch {
            return 'Recently';
        }
    };

    const truncateText = (text, maxLength) => {
        if (!text) return 'No description available';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    // Pagination calculations
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (selectedArticle) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedArticle]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedArticle) {
                closeModal();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.querySelector('input[type="text"]')?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedArticle]);

    return (
        <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-800'}`}>

            {/* Header */}
            <header className={`sticky top-0 z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-800/90 border-b border-gray-700' : 'bg-white/90 border-b border-blue-100'}`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Logo and Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl font-bold text-white">GN</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                                    GeoNews Network
                                </h1>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Real-time disaster & environmental alerts
                                </p>
                            </div>
                        </div>

                        {/* Search and Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">

                            {/* Search Bar */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-blue-200 text-gray-800 placeholder-gray-500'
                                        }`}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            {/* View Mode Toggle */}
                            <div className={`flex items-center gap-1 p-1 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-md' : ''}`}
                                    title="Grid View"
                                >
                                    <svg className={`w-5 h-5 ${viewMode === 'grid' ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-md' : ''}`}
                                    title="List View"
                                >
                                    <svg className={`w-5 h-5 ${viewMode === 'list' ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 ${darkMode
                                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                    : 'bg-white border-blue-200 hover:bg-blue-50'
                                    }`}
                                title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                            >
                                {darkMode ? (
                                    <>
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span className="hidden sm:inline">Light</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                        <span className="hidden sm:inline">Dark</span>
                                    </>
                                )}
                            </button>

                            {/* Bookmarks Toggle */}
                            <button
                                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                                className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 ${showBookmarksOnly
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                    : darkMode
                                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                        : 'bg-white border-blue-200 hover:bg-blue-50'
                                    }`}
                                title="Show bookmarks only"
                            >
                                <svg className={`w-5 h-5 ${bookmarks.length > 0 ? 'text-yellow-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <span className="hidden sm:inline">({bookmarks.length})</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">

                {/* Categories Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {showBookmarksOnly ? '📚 My Bookmarks' : 'Browse Categories'}
                        </h2>

                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sort by:</span>
                            <div className="flex gap-1">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSortBy(option.id)}
                                        className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-300 ${sortBy === option.id
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                            : darkMode
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                                            }`}
                                    >
                                        {option.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {!showBookmarksOnly && (
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setSearchQuery('');
                                        setShowBookmarksOnly(false);
                                    }}
                                    className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${activeCategory === category.id
                                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                        : darkMode
                                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-100'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Bar */}
                <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-blue-100'}`}>
                    <div className="flex flex-wrap gap-4 justify-between">
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                {showBookmarksOnly ? bookmarks.length : filteredArticles.length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {showBookmarksOnly ? 'Bookmarked Articles' : 'Articles Found'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                {bookmarks.length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Bookmarks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                                {data?.totalResults || filteredArticles.length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sources</div>
                        </div>
                    </div>
                </div>

                {/* Search Status */}
                {searchDebounced.trim() && (
                    <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-medium">Searching for: </span>
                                <span className="text-blue-600 dark:text-blue-400">"{searchDebounced}"</span>
                                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    ({filteredArticles.length} results)
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchDebounced('');
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                Clear search
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {isSearching ? 'Searching articles...' : 'Loading latest news...'}
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className={`rounded-xl p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white border border-red-200'}`}>
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Unable to Load News</h3>
                        <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
                        <button
                            onClick={() => fetchNews(activeCategory)}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                        >
                            Retry Loading
                        </button>
                    </div>
                )}

                {/* Articles Grid/List */}
                {!loading && !error && (
                    <>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">
                                {showBookmarksOnly ? (
                                    <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                        📚 My Bookmarks
                                    </span>
                                ) : (
                                    <>
                                        Latest <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {searchDebounced.trim()
                                                ? `"${searchDebounced}"`
                                                : categories.find(c => c.id === activeCategory)?.name.replace('🌍 ', '').replace('⚠️ ', '').replace('⛅ ', '').replace('🌱 ', '').replace('🔬 ', '').replace('🌐 ', '')}
                                        </span>
                                    </>
                                )}
                            </h2>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>

                        {currentArticles.length === 0 ? (
                            <div className={`rounded-xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white border border-blue-100'}`}>
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
                                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {showBookmarksOnly
                                        ? "You haven't bookmarked any articles yet."
                                        : "Try a different search term or category"}
                                </p>
                                {showBookmarksOnly ? (
                                    <button
                                        onClick={() => setShowBookmarksOnly(false)}
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                    >
                                        Browse Articles
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => fetchNews(activeCategory)}
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                    >
                                        Refresh News
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className={`grid gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                    : 'grid-cols-1'
                                    }`}>
                                    {currentArticles.map((article, index) => (
                                        <div
                                            key={`${article.title}-${index}`}
                                            onClick={() => handleArticleClick(article)}
                                            className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white border border-blue-100'
                                                }`}
                                        >
                                            {/* Article Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={article.urlToImage || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&${index}`}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&${index}`;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full">
                                                        {searchDebounced.trim() ? 'SEARCH' : activeCategory.toUpperCase() || 'NEWS'}
                                                    </span>
                                                </div>

                                                {/* Bookmark Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleBookmark(article);
                                                    }}
                                                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300"
                                                    title={bookmarks.some(b => b.title === article.title) ? 'Remove bookmark' : 'Add bookmark'}
                                                >
                                                    <svg className={`w-5 h-5 ${bookmarks.some(b => b.title === article.title) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                </button>

                                                {/* Time Badge */}
                                                <div className="absolute bottom-4 left-4">
                                                    <span className={`px-3 py-1 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} rounded-full text-sm font-medium`}>
                                                        {getTimeAgo(article.publishedAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Article Content */}
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className={`text-sm font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                                                        {article.source?.name || 'Unknown Source'}
                                                    </div>
                                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {formatDate(article.publishedAt)}
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                                    {article.title}
                                                </h3>

                                                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                                                    {truncateText(article.description || article.content, 150)}
                                                </p>

                                                {/* Author */}
                                                {article.author && (
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-bold text-blue-600">
                                                                {article.author.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {article.author}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Read More Button */}
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'} group-hover:underline`}>
                                                        Read full article →
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            Live
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 rounded-lg ${currentPage === 1
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:bg-blue-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            ← Previous
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => paginate(pageNum)}
                                                    className={`w-10 h-10 rounded-lg ${currentPage === pageNum
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                                        : 'hover:bg-blue-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:bg-blue-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Bookmarks Section */}
                {bookmarks.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                📚 Saved Articles ({bookmarks.length})
                            </h2>
                            <button
                                onClick={clearAllBookmarks}
                                className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarks.slice(0, 6).map((bookmark, index) => (
                                <div
                                    key={`bookmark-${index}`}
                                    className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white border border-yellow-100'}`}
                                >
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold line-clamp-2">{bookmark.title}</h3>
                                            <button
                                                onClick={() => handleBookmark(bookmark)}
                                                className="text-yellow-500 hover:text-yellow-600"
                                                title="Remove bookmark"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {truncateText(bookmark.description || bookmark.content, 100)}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {bookmark.source?.name}
                                            </span>
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {bookmark.bookmarkedAt ? getTimeAgo(bookmark.bookmarkedAt) : 'Recently'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {bookmarks.length > 6 && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setShowBookmarksOnly(true)}
                                    className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                                >
                                    View All Bookmarks →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Load More Button */}
                {!loading && !error && filteredArticles.length > 0 && !showBookmarksOnly && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => fetchNews(activeCategory)}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Refresh News
                        </button>
                    </div>
                )}
            </main>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div
                        ref={modalRef}
                        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'
                            }`}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 p-6 border-b backdrop-blur-lg bg-white/90 dark:bg-gray-900/90">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                            {selectedArticle.source?.name || 'Unknown Source'}
                                        </span>
                                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {formatDate(selectedArticle.publishedAt)}
                                        </span>
                                        {selectedArticle.author && (
                                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                By {selectedArticle.author}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBookmark(selectedArticle)}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}
                                        title={bookmarks.some(b => b.title === selectedArticle.title) ? 'Remove bookmark' : 'Add bookmark'}
                                    >
                                        <svg className={`w-6 h-6 ${bookmarks.some(b => b.title === selectedArticle.title) ? 'text-yellow-500 fill-yellow-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {selectedArticle.urlToImage && (
                                <div className="mb-6 rounded-xl overflow-hidden">
                                    <img
                                        src={selectedArticle.urlToImage}
                                        alt={selectedArticle.title}
                                        className="w-full h-64 object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
                                        }}
                                    />
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none dark:prose-invert">
                                <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
                                    {selectedArticle.description}
                                </p>

                                <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                    <h4 className="font-bold mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Full Article Content
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {selectedArticle.content || selectedArticle.description || 'Detailed content available in the original source.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedArticle.urlToImage && <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                        With Images
                                    </span>}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                                        Verified Source
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                                        Breaking News
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <a
                                    href={selectedArticle.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all duration-300"
                                >
                                    View Original Source
                                </a>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: selectedArticle.title,
                                                text: selectedArticle.description,
                                                url: selectedArticle.url || window.location.href,
                                            });
                                        } else {
                                            navigator.clipboard.writeText(selectedArticle.url || window.location.href);
                                            alert('Link copied to clipboard!');
                                        }
                                    }}
                                    className="px-6 py-3 border border-blue-500 text-blue-500 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                                >
                                    Share Article
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className={`mt-12 py-8 border-t ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-blue-100 bg-white/50'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 rounded-xl"></div>
                                <div>
                                    <h3 className="text-xl font-bold">GeoNews Network</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Stay informed, stay safe
                                    </p>
                                </div>
                            </div>
                            <p className={`max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Real-time disaster alerts and environmental news from trusted sources worldwide.
                                All data is saved locally in your browser for privacy.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className="font-medium mb-2">Quick Links</div>
                                <button
                                    onClick={() => setShowBookmarksOnly(true)}
                                    className="block hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    My Bookmarks ({bookmarks.length})
                                </button>
                                <button
                                    onClick={clearAllBookmarks}
                                    className="block hover:text-red-600 dark:hover:text-red-400"
                                >
                                    Clear Bookmarks
                                </button>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="block hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`mt-8 pt-8 border-t text-center text-sm ${darkMode ? 'border-gray-800 text-gray-500' : 'border-blue-100 text-gray-600'}`}>
                        <p>© 2024 GeoNews Network. All rights reserved. Powered by NewsAPI.org</p>
                        <p className="mt-2">This is a demo application for educational purposes. Data is cached locally.</p>
                        <p className="mt-1">
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
                            <span className="font-medium">{bookmarks.length} articles bookmarked</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium">{filteredArticles.length} articles loaded</span>
                        </p>
                    </div>
                </div>
            </footer>
            {selectedArticle && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl relative">

                        {/* Close button */}
                        <button
                            onClick={() => setSelectedArticle(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                        >
                            ✖
                        </button>

                        {/* Image */}
                        <img
                            src={
                                selectedArticle.image_url ||
                                "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1"
                            }
                            alt={selectedArticle.title}
                            className="w-full h-64 object-cover"
                        />

                        {/* Content */}
                        <div className="p-6">
                            <span className="inline-block mb-2 px-3 py-1 text-xs rounded-full bg-cyan-100 text-cyan-700">
                                {category.toUpperCase()}
                            </span>

                            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                {selectedArticle.title}
                            </h2>

                            <p className="text-gray-600 mb-6">
                                {selectedArticle.description || "No detailed description available."}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>🗓 {new Date(selectedArticle.pubDate).toLocaleString()}</span>
                                <span>📰 {selectedArticle.source_id?.toUpperCase()}</span>
                            </div>

                            <a
                                href={selectedArticle.link}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 inline-block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                            >
                                Read Full Article 🔗
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Example;