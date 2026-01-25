import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full rounded-3xl bg-white border border-gray-200">
      <div className="w-full mx-auto px-4 py-6 sm:py-6 sm:px-6">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-[19px] sm:text-[22px] md:text-[26.5px]">
            <div className="flex items-center justify-center rounded">
              <div className="w-10 h-10 p-1 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-linear-to-br from-blue-500 to-blue-600 text-2xl sm:text-3xl rounded-xl flex items-center justify-center text-white font-bold transform transition-transform duration-200 group-hover:scale-105 group-active:scale-95 shadow-md group-hover:shadow-lg">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              </div>
            </div>
            NewsHub
          </div>

          {/* Links */}
          <div className="flex gap-6 text-[16px] sm:text-[18px] md:text-[21px] text-gray-500">
            <a href="#" className="hover:text-gray-800 transition text-center font-medium">
              Designed & Developed by Talha Javed
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-11 md:w-13 md:h-13 sm:h-11 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[#0A66C2] hover:text-white transition transform hover:scale-105"
            >
              <FaLinkedin size={21} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 md:w-13 md:h-13 sm:w-11 sm:h-11  flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-black hover:text-white transition transform hover:scale-105"
            >
              <FaGithub size={21} />
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-6 text-center text-[16px] md:text-[19px] text-gray-500">
          © {new Date().getFullYear()} NewsHub Media Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;