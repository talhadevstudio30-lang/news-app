import React, { useEffect, useRef } from 'react'

function SelectedArticle({ selectedArticle, onClose, formatDate, }) {
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (selectedArticle) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = 'unset'; // Restore scrolling
        };
    }, [selectedArticle, onClose]);

    return (
        <> {selectedArticle && (
            <div>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-4xl shadow-2xl bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 p-6 border-b border-gray-200 backdrop-blur-lg bg-white/90">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex flex-wrap items-center gap-4 mb-1.5">
                                        <span className="px-3 py-1 rounded-full text-sm md:text-lg font-medium bg-[#d6ebff] text-blue-600">
                                            {selectedArticle.source?.name || 'Unknown Source'}
                                        </span>
                                        <span className="text-gray-600 flex justify-center items-center sm:text-md md:text-[18px]">
                                            <div className='h-1.5 md:h-2 md:w-2 w-1.5 bg-gray-500 rounded-full mr-2 border-2 border-gray-500'></div>  {formatDate(selectedArticle.publishedAt)}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{selectedArticle.title}</h2>
                                    {selectedArticle.author && (
                                        <span className="text-gray-800 font-semibold sm:text-md md:text-[18px]">
                                            <span className='text-gray-700 font-normal mr-1'>By</span>{selectedArticle.author}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={onClose}
                                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                                    >
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {selectedArticle.urlToImage && (
                                <div className="mb-6 rounded-2xl overflow-hidden">
                                    <img
                                        src={selectedArticle.urlToImage}
                                        alt={selectedArticle.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none">
                                <p className="text-lg sm:text-xl md:text-[21.5px] mb-6 text-gray-700">
                                    {selectedArticle.description}
                                </p>

                                <div className="p-3.5 rounded-2xl mb-6 border border-[#c1d6ff] bg-[#f3f7ff]">
                                    <h4 className="font-bold mb-2 flex items-center gap-2 sm:text-[17px] md:text-[18.5px]">
                                        <svg className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:h-7 md:w-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 16v-4" />
                                            <path d="M12 8h.01" />
                                        </svg>
                                        Full Article Content
                                    </h4>
                                    <div
                                        className="text-gray-700 text-[17px] md:text-[18.5px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                        dangerouslySetInnerHTML={{ __html: selectedArticle.content?.replace(/\[\+\d+ chars\]/g, '') || selectedArticle.description || 'Detailed content available in the original source.' }}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 rounded-full text-sm sm:text-[15.5px] md:text-[17px] flex justify-center items-center font-semibold bg-green-100 text-green-700">
                                        <svg className="mr-1.5 h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg> Verified Source
                                    </span>
                                    {selectedArticle.urlToImage && (
                                        <span className="px-3 py-1 rounded-full text-sm justify-center items-center font-semibold sm:text-[15.5px] md:text-[17px] bg-red-100 text-red-700 flex">
                                            <svg className="sm:h-5 sm:w-5 md:h-5.5 md:w-5.5 mr-1.5 h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                                            </svg> Breaking News
                                        </span>
                                    )}
                                    {selectedArticle.urlToImage && (
                                        <span className="px-3 py-2 rounded-full flex justify-center items-center text-sm font-semibold bg-[#eceef1] sm:text-[15.5px] md:text-[17px] text-gray-600">
                                            <svg className="mr-1.5 h-4.5 w-4.5 sm:h-5 sm:w-5 md:h-5.5 md:w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.2" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>  With Image
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <a
                                    href={selectedArticle.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 text-[15px] sm:text-[16.5px] md:text-[17.5px] py-3 flex justify-center items-center bg-linear-to-r from-[#00aed1] to-[#00BAE0] text-white rounded-xl font-medium text-center hover:shadow-lg transition-all duration-300"
                                >
                                    View Original Source <svg className='ml-2.5 h-4.5 w-4.5 sm:w-5 sm:h-5 md:h-5.5 md:w-5.5 mr-1.5' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
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
                                    className="px-5.5 py-3 border border-gray-500 flex text-[15px] sm:text-[16.5px] md:text-[17.5px] justify-center items-center font-bold text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-300"
                                >
                                    <svg className='h-4.5 w-4.5 sm:w-5 sm:h-5 md:h-5.5 md:w-5.5 mr-2' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="18" cy="5" r="3" />
                                        <circle cx="6" cy="12" r="3" />
                                        <circle cx="18" cy="19" r="3" />
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                    </svg> Share Article
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default SelectedArticle