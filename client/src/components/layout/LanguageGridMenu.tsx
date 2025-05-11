import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";

// Define types for our language item
type LanguageItem = {
  name: string;
  slug: string;
};

// Define the language menu items
const languages: LanguageItem[] = [
  { name: "C++", slug: "cpp" },
  { name: "Python", slug: "python" },
  { name: "JavaScript", slug: "javascript" },
  { name: "Java", slug: "java" },
  { name: "C#", slug: "csharp" },
  { name: "HTML", slug: "html" },
  { name: "CSS", slug: "css" },
  { name: "SQL", slug: "sql" },
];

const LanguageGridMenu = () => {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveLanguage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleLanguage = (slug: string) => {
    if (activeLanguage === slug) {
      setActiveLanguage(null);
    } else {
      setActiveLanguage(slug);
    }
  };

  return (
    <div className="flex space-x-0" ref={menuRef}>
      {languages.map((language) => (
        <div key={language.slug} className="relative">
          {/* Combined language button with grid icon and dropdown arrow */}
          <button
            onClick={() => toggleLanguage(language.slug)}
            className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeLanguage === language.slug 
                ? 'bg-black/20 text-white' 
                : 'hover:bg-black/10 text-white'
            }`}
          >
            {/* Grid icon */}
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5 mr-1.5">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
            </div>
            <span>{language.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform duration-200 ${activeLanguage === language.slug ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          {activeLanguage === language.slug && (
            <div className="absolute left-0 top-10 bg-white shadow-lg rounded-md border border-gray-200 z-[100] w-36">
              <div className="py-2">
                {/* Learn option */}
                <Link 
                  href={`/tutorial/${language.slug}`} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setActiveLanguage(null)}
                >
                  Learn
                </Link>
                
                {/* Code option */}
                <Link 
                  href={`/practice/${language.slug}`} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setActiveLanguage(null)}
                >
                  Code
                </Link>
                
                {/* Quiz option */}
                <Link 
                  href={`/mcq/${language.slug}`} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setActiveLanguage(null)}
                >
                  Quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LanguageGridMenu;