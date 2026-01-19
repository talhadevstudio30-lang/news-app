import React from 'react';
import HeaderNavbar from './HeaderNavbar';

// SVG Icons as separate components
const GeneralIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const BusinessIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

const TechnologyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
);

const SportsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const HealthIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </svg>
);

const ScienceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8" />
        <path d="M3 22h18" />
        <path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" />
        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
);

const EntertainmentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
    </svg>
);

const PoliticsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);

function Header({ setQuery, Search, Moon, setCategory, category, query, Search_Btn }) {

    // Function to get categories data
    const getCategories = () => {
        return [
            {
                id: "General",
                label: "General",
                bg: "bg-purple-100 active:bg-purple-200 border border-purple-200 hover:border-purple-300",
                text: "text-purple-700",
                icon: <GeneralIcon />,
                focus: "ring-2 ring-purple-500 ring-offset-2 shadow-lg shadow-purple-200 outline-none focus:ring-0 focus:ring-offset-0"
            },
            {
                id: "Business",
                label: "Business",
                bg: "bg-orange-100 active:bg-orange-200 border border-orange-200 hover:border-orange-300",
                text: "text-orange-700",
                icon: <BusinessIcon />,
                focus: "focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:shadow-lg focus:shadow-orange-200 focus:outline-none"
            },
            {
                id: "Technology",
                label: "Technology",
                bg: "bg-blue-100 active:bg-blue-200 border border-blue-200 hover:border-blue-300",
                text: "text-blue-700",
                icon: <TechnologyIcon />,
                focus: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:shadow-lg focus:shadow-blue-200 focus:outline-none"
            },
            {
                id: "Sports",
                label: "Sports",
                bg: "bg-green-100 active:bg-green-200 border border-green-200 hover:border-green-300",
                text: "text-green-700",
                icon: <SportsIcon />,
                focus: "focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:shadow-lg focus:shadow-green-200 focus:outline-none"
            },
            {
                id: "Health",
                label: "Health",
                bg: "bg-red-100 active:bg-red-200 border border-red-200 hover:border-red-300",
                text: "text-red-700",
                icon: <HealthIcon />,
                focus: "focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:shadow-lg focus:shadow-red-200 focus:outline-none"
            },
            {
                id: "science",
                label: "Science",
                bg: "bg-purple-100 active:bg-purple-200 border border-purple-200 hover:border-purple-300",
                text: "text-purple-700",
                icon: <ScienceIcon />,
                focus: "focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:shadow-lg focus:shadow-purple-200 focus:outline-none"
            },
            {
                id: "Entertainment",
                label: "Entertainment",
                bg: "bg-pink-100 active:bg-pink-200 border border-pink-200 hover:border-pink-300",
                text: "text-pink-700",
                icon: <EntertainmentIcon />,
                focus: "focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:shadow-lg focus:shadow-pink-200 focus:outline-none"
            },
            {
                id: "politics",
                label: "Politics",
                bg: "bg-indigo-100 active:bg-indigo-200 border border-indigo-200 hover:border-indigo-300",
                text: "text-indigo-700",
                icon: <PoliticsIcon />,
                focus: "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:shadow-lg focus:shadow-indigo-200 focus:outline-none"
            },
        ];
    };

    // Function to handle search
    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            Search_Btn();
        }
    };

    // Get categories data
    const categories = getCategories();

    return (
        <>
            <header className="w-full bg-white shadow-sm">
                {/* Top Bar */}
                <div className="max-w-9xl mx-auto border-b border-gray-300 flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 py-5 gap-4">
                    {/* Logo - Clickable */}
                    <div className="flex w-full md:w-auto items-center justify-between gap-2 group cursor-pointer">
                        <div className='flex items-center gap-3'>
                            <div className="w-10 h-10 p-1 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-linear-to-br from-blue-500 to-blue-600 text-2xl sm:text-3xl rounded-xl flex items-center justify-center text-white font-bold transform transition-transform duration-200 group-hover:scale-105 group-active:scale-95 shadow-md group-hover:shadow-lg">
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" >
                                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                                    <path d="M18 14h-8" />
                                    <path d="M15 18h-5" />
                                    <path d="M10 6h8v4h-8V6Z" />
                                </svg>
                            </div>
                            <div className=''>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    NewsHub
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-600 leading-4 transition-colors duration-200 white-space: nowrap">
                                    Stay informed, stay ahead
                                </p>
                            </div>
                        </div>
                        <div className='block md:hidden'>
                            <HeaderNavbar />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-auto lg:flex-1 max-w-2xl mx-0 lg:mx-auto">
                        <div className="relative flex items-center bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 rounded-full px-2.5 py-2 transition-all duration-300 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search for news, topics or keywords..."
                                className="bg-transparent outline-none px-3 w-full text-sm sm:text-base lg:text-lg placeholder-gray-400"
                            />
                            <button
                                onClick={Search_Btn}
                                className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-[15px] lg:text-[20px] px-5 sm:px-7 py-2 rounded-full font-medium transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
                                Go
                            </button>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className='hidden md:block'>
                        <HeaderNavbar />
                    </div>
                </div>

                {/* Categories Navigation with Enhanced Focus */}
                <div className="px-4 mt-4.5 sm:px-6 flex justify-center items-center pb-4">
                    <div className="flex flex-wrap gap-4 pb-2 justify-center md:justify-start w-full mx-auto">
                        {categories.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCategory(item.id)}
                                className={`flex items-center gap-2 px-3 sm:px-4 sm:text-md lg:text-[17px] sm:py-3 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 focus:scale-105 focus:z-10 ${item.bg} ${item.text} ${item.focus} ${category === item.id ? 'ring-2 ring-offset-2' : ''}`}
                            >
                                <span className="text-sm">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;