import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTutorial } from "@/context/TutorialContext";
import { useQuery } from "@tanstack/react-query";
import CoursesDropdown from "./CoursesDropdown";
import ProjectsDropdown from "./ProjectsDropdown";
import SimpleLanguageMenu from "./SimpleLanguageMenu";

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user, logout } = useAuth();
  const { setActiveCategory } = useTutorial();
  const [location, navigate] = useLocation();

  // Fetch categories for navigation
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    navigate(`/tutorial/${slug}`);
  };

  const isActiveCategory = (slug: string) => {
    return location.includes(`/tutorial/${slug}`);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Top Navigation Bar - W3Schools style */}
        <div className="flex justify-between items-center py-2 px-4 lg:px-0">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-lg mr-2">B</div>
              <span className="text-xl font-semibold text-secondary-dark hidden sm:block">BrightCoreLabs</span>
            </Link>
            <div className="ml-4 hidden md:flex items-center space-x-4">
              <CoursesDropdown />
              <ProjectsDropdown />
            </div>
            <p className="text-xs text-neutral-mid ml-2 hidden md:block">Reimagining learning</p>
          </div>

          {/* Search Bar */}
          {showMobileSearch ? (
            <div className="fixed inset-0 bg-white p-4 z-50 md:hidden">
              <div className="flex items-center">
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button 
                  className="ml-2 text-neutral-mid hover:text-neutral-dark"
                  onClick={() => setShowMobileSearch(false)}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <div className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-500">
                  <i className="fas fa-search text-xs"></i>
                </button>
              </div>
            </div>
          )}

          {/* Right Menu */}
          <div className="flex items-center space-x-1 md:space-x-3">
            <button 
              className="p-1.5 rounded-sm text-neutral-mid hover:bg-neutral-bg md:hidden"
              onClick={() => setShowMobileSearch(true)}
            >
              <i className="fas fa-search"></i>
            </button>
            <button 
              className="p-1.5 rounded-sm text-neutral-mid hover:bg-neutral-bg md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <Link href="/marketplace" className="hidden md:block text-sm font-medium text-primary hover:text-primary-dark">
              Marketplace
            </Link>
            <Link href="/whiteboard" className="hidden md:block text-sm font-medium text-primary hover:text-primary-dark">
              Whiteboard
            </Link>
            <Link href="/notebook" className="hidden md:block text-sm font-medium text-primary hover:text-primary-dark">
              Notebook
            </Link>
            <Link href="/vscode" className="hidden md:block text-sm font-medium text-primary hover:text-primary-dark">
              VS Code
            </Link>
            <Link href="/for-teachers" className="hidden md:block text-sm font-medium text-neutral-dark hover:text-primary">
              For Teachers
            </Link>
            <Link href="/get-certified" className="hidden md:block text-sm font-medium text-neutral-dark hover:text-primary">
              Get Certified
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="hidden md:block text-sm font-medium text-neutral-dark hover:text-primary">
                  Dashboard
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:block" 
                  onClick={() => logout()}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/register" className="hidden md:block">
                  <Button className="bg-primary hover:bg-primary-dark text-white rounded-sm">Sign Up</Button>
                </Link>
                <Link href="/login" className="hidden md:block">
                  <Button variant="outline" className="rounded-sm">Log In</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-4">
            <div className="flex flex-col space-y-3">
              <Link href="/marketplace" className="p-2 border-b text-primary hover:bg-gray-100">
                Marketplace
              </Link>
              <Link href="/whiteboard" className="p-2 border-b text-primary hover:bg-gray-100">
                Whiteboard
              </Link>
              <Link href="/notebook" className="p-2 border-b text-primary hover:bg-gray-100">
                Notebook
              </Link>
              <Link href="/vscode" className="p-2 border-b text-primary hover:bg-gray-100">
                VS Code
              </Link>
              <div className="p-2 border-b hover:bg-gray-100">
                <div className="mb-2 font-medium">Courses</div>
                <div className="pl-4 text-sm space-y-2">
                  <Link href="/tutorial/python" className="block hover:text-primary">Python</Link>
                  <Link href="/tutorial/javascript" className="block hover:text-primary">JavaScript</Link>
                  <Link href="/tutorial/cpp" className="block hover:text-primary">C++</Link>
                  <Link href="/tutorial/html" className="block hover:text-primary">HTML</Link>
                  <Link href="/tutorial/css" className="block hover:text-primary">CSS</Link>
                  <Link href="/tutorial/sql" className="block hover:text-primary">SQL</Link>
                </div>
              </div>
              <div className="p-2 border-b hover:bg-gray-100">
                <div className="mb-2 font-medium">Real-Time Projects</div>
                <div className="pl-4 text-sm space-y-2">
                  <Link href="/projects/personal-portfolio" className="block hover:text-primary">Personal Portfolio</Link>
                  <Link href="/projects/weather-app" className="block hover:text-primary">Weather App</Link>
                  <Link href="/projects/todo-app" className="block hover:text-primary">To-Do List App</Link>
                  <Link href="/projects/blog-platform" className="block hover:text-primary">Blog Platform</Link>
                  <Link href="/projects/ecommerce-store" className="block hover:text-primary">E-commerce Store</Link>
                </div>
              </div>
              <Link href="/for-teachers" className="p-2 border-b hover:bg-gray-100">
                For Teachers
              </Link>
              <Link href="/get-certified" className="p-2 border-b hover:bg-gray-100">
                Get Certified
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="p-2 border-b hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <button 
                    className="p-2 text-left border-b hover:bg-gray-100 text-red-500"
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="p-2">
                    <Button className="w-full bg-primary hover:bg-primary-dark rounded-sm">Sign Up</Button>
                  </Link>
                  <Link href="/login" className="p-2">
                    <Button variant="outline" className="w-full rounded-sm">Log In</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Language Grid Menu with Learn, MCQ, Code sections */}
        <div className="bg-secondary text-white overflow-x-auto">
          <div className="lg:max-w-screen-xl lg:mx-auto text-xs md:text-sm whitespace-nowrap">
            <SimpleLanguageMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
