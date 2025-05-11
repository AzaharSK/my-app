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

const SimpleLanguageMenu: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle menu open/closed
  const toggleMenu = (slug: string) => {
    setOpenMenu(openMenu === slug ? null : slug);
  };

  return (
    <div className="flex" ref={menuRef}>
      {languages.map((lang) => (
        <div key={lang.slug} className="relative">
          <button
            onClick={() => toggleMenu(lang.slug)}
            className={`flex items-center space-x-1 px-4 py-2 text-white hover:bg-black/10 ${
              openMenu === lang.slug ? "bg-black/20" : ""
            }`}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5 mr-1">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
            </div>
            <span>{lang.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${openMenu === lang.slug ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openMenu === lang.slug && (
            <div className="absolute left-0 mt-1 bg-white shadow-lg rounded border border-gray-200 z-50 w-32">
              <Link
                href={`/tutorial/${lang.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setOpenMenu(null)}
              >
                Learn
              </Link>
              <Link
                href={`/practice/${lang.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setOpenMenu(null)}
              >
                Code
              </Link>
              <Link
                href={`/mcq/${lang.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setOpenMenu(null)}
              >
                Quiz
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SimpleLanguageMenu;