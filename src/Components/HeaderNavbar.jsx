import React from 'react'

function HeaderNavbar() {
    return (
        <>
            <div>
                <div className="flex items-center gap-3 sm:gap-4">


                    {/* Feedback Button with Speech Bubble */}
                    <a
                        href="mailto:talhadevstudio30@gmail.com?subject=Feedback%20for%20Article%20App&body=Hi%2C%0A%0AI'd%20like%20to%20share%20the%20following%20feedback%3A%0A"
                        aria-label="Send feedback email"
                    >
                        <button className="flex items-center gap-2 px-2 sm:px-2 py-2 rounded-full bg-linear-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 hover:border-blue-400 transform transition-all duration-200 hover:scale-105 active:scale-95 group shadow-sm hover:shadow-md">
                            <div className="relative">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>

                            </div>
                            <span className="hidden sm:inline text-sm font-medium text-blue-700 group-hover:text-blue-800 transition-colors duration-200 mr-1.5">
                                Feedback
                            </span>
                        </button>
                    </a>
                </div>

            </div>
        </>
    )
}

export default HeaderNavbar