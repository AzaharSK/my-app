import React, { useState, useRef, useEffect } from "react";
import { Link } from "wouter";

type CourseCategory = {
  title: string;
  items: CourseItem[];
};

type CourseItem = {
  name: string;
  path: string;
};

const courseCategories: CourseCategory[] = [
  {
    title: "Programming Languages",
    items: [
      { name: "Python", path: "/tutorial/python" },
      { name: "JavaScript", path: "/tutorial/javascript" },
      { name: "C++", path: "/tutorial/cpp" },
      { name: "Java", path: "/tutorial/java" },
      { name: "C#", path: "/tutorial/csharp" },
      { name: "Ruby", path: "/tutorial/ruby" },
    ],
  },
  {
    title: "Web Development",
    items: [
      { name: "HTML", path: "/tutorial/html" },
      { name: "CSS", path: "/tutorial/css" },
      { name: "JavaScript", path: "/tutorial/javascript" },
      { name: "Node.js", path: "/tutorial/nodejs" },
      { name: "React", path: "/tutorial/react" },
      { name: "Angular", path: "/tutorial/angular" },
    ],
  },
  {
    title: "Data Science",
    items: [
      { name: "Python", path: "/tutorial/python" },
      { name: "R", path: "/tutorial/r" },
      { name: "Machine Learning", path: "/tutorial/machine-learning" },
      { name: "TensorFlow", path: "/tutorial/tensorflow" },
      { name: "Statistics", path: "/tutorial/statistics" },
      { name: "Data Visualization", path: "/tutorial/data-visualization" },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "SQL", path: "/tutorial/sql" },
      { name: "MySQL", path: "/tutorial/mysql" },
      { name: "PostgreSQL", path: "/tutorial/postgresql" },
      { name: "MongoDB", path: "/tutorial/mongodb" },
      { name: "Redis", path: "/tutorial/redis" },
    ],
  },
  {
    title: "DevOps",
    items: [
      { name: "Docker", path: "/tutorial/docker" },
      { name: "Kubernetes", path: "/tutorial/kubernetes" },
      { name: "Git", path: "/tutorial/git" },
      { name: "AWS", path: "/tutorial/aws" },
      { name: "CI/CD", path: "/tutorial/cicd" },
    ],
  },
];

const CoursesDropdown = () => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-1 text-sm font-medium text-neutral-dark hover:text-primary focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
          <div className="bg-primary rounded-sm"></div>
          <div className="bg-primary rounded-sm"></div>
          <div className="bg-primary rounded-sm"></div>
          <div className="bg-primary rounded-sm"></div>
        </div>
        <span className="ml-1">Courses</span>
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
        <div className="absolute left-0 mt-2 w-screen max-w-screen-lg bg-white shadow-lg rounded-sm border border-gray-200 z-50 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 p-4" 
             style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {courseCategories.map((category, idx) => (
            <div key={idx} className="p-2">
              <h3 className="font-medium text-sm text-gray-800 border-b border-gray-200 pb-2 mb-2">
                {category.title}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      href={item.path}
                      className="text-sm text-gray-600 hover:text-primary hover:bg-gray-50 block py-1 px-2 rounded-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
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

export default CoursesDropdown;