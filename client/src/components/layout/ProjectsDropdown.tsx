import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";

type ProjectCategory = {
  title: string;
  items: ProjectItem[];
};

type ProjectItem = {
  name: string;
  path: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
};

const projectCategories: ProjectCategory[] = [
  {
    title: "Web Development",
    items: [
      { name: "Personal Portfolio", path: "/projects/personal-portfolio", difficulty: "beginner" },
      { name: "Blog Platform", path: "/projects/blog-platform", difficulty: "intermediate" },
      { name: "E-commerce Store", path: "/projects/ecommerce-store", difficulty: "advanced" },
      { name: "Social Media Dashboard", path: "/projects/social-media-dashboard", difficulty: "advanced" },
      { name: "Weather App", path: "/projects/weather-app", difficulty: "beginner" },
    ],
  },
  {
    title: "Mobile Development",
    items: [
      { name: "To-Do List App", path: "/projects/todo-app", difficulty: "beginner" },
      { name: "Recipe Finder", path: "/projects/recipe-finder", difficulty: "intermediate" },
      { name: "Fitness Tracker", path: "/projects/fitness-tracker", difficulty: "intermediate" },
      { name: "Chat Messenger", path: "/projects/chat-messenger", difficulty: "advanced" },
    ],
  },
  {
    title: "Data Science",
    items: [
      { name: "Data Visualization", path: "/projects/data-visualization", difficulty: "beginner" },
      { name: "Sentiment Analysis", path: "/projects/sentiment-analysis", difficulty: "intermediate" },
      { name: "Stock Price Predictor", path: "/projects/stock-predictor", difficulty: "advanced" },
      { name: "Image Recognition", path: "/projects/image-recognition", difficulty: "advanced" },
    ],
  },
  {
    title: "Game Development",
    items: [
      { name: "Tic-Tac-Toe", path: "/projects/tic-tac-toe", difficulty: "beginner" },
      { name: "Snake Game", path: "/projects/snake-game", difficulty: "beginner" },
      { name: "Platformer Game", path: "/projects/platformer", difficulty: "intermediate" },
      { name: "Multiplayer Game", path: "/projects/multiplayer-game", difficulty: "advanced" },
    ],
  },
];

const ProjectsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-1 text-sm font-medium text-neutral-dark hover:text-primary focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M2 9a3 3 0 0 1 0-6h20a3 3 0 0 1 0 6"></path>
            <path d="M13 21H2a3 3 0 0 1 0-6h11"></path>
            <path d="M13 21a3 3 0 0 0 6 0v-6a3 3 0 0 0-6 0v6Z"></path>
          </svg>
        </div>
        <span className="ml-1">Real-Time Projects</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-screen max-w-screen-lg bg-white shadow-lg rounded-sm border border-gray-200 z-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4" 
             style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {projectCategories.map((category, idx) => (
            <div key={idx} className="p-2">
              <h3 className="font-medium text-sm text-gray-800 border-b border-gray-200 pb-2 mb-2">
                {category.title}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href={item.path}
                      className="text-sm text-gray-600 hover:text-primary hover:bg-gray-50 block py-1 px-2 rounded-sm flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.name}</span>
                      {item.difficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsDropdown;