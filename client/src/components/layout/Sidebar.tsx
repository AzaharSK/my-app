import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useTutorial } from "@/context/TutorialContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  categorySlug: string;
  tutorialSlug?: string;
}

const Sidebar = ({ categorySlug, tutorialSlug }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setActiveTutorial } = useTutorial();
  const [, navigate] = useLocation();

  // Fetch category details
  const { data: category = {}, isLoading: isCategoryLoading } = useQuery<any>({
    queryKey: [`/api/categories/${categorySlug}`],
    enabled: !!categorySlug,
  });

  // Fetch tutorials for the category
  const { data: tutorials = [], isLoading: isTutorialsLoading } = useQuery<any[]>({
    queryKey: [`/api/categories/${categorySlug}/tutorials`],
    enabled: !!categorySlug,
  });

  // Group tutorials by sections
  const [tutorialSections, setTutorialSections] = useState<{[key: string]: any[]}>({
    "": [], // Default section
    "Functions": [],
  });

  useEffect(() => {
    if (tutorials && Array.isArray(tutorials)) {
      // For demo, just use some predefined sections
      // In a real app, you'd have a section field in your tutorial model
      const sections: {[key: string]: any[]} = {
        "": [],
        "Functions": []
      };
      
      tutorials.forEach((tutorial: any) => {
        if (tutorial.title?.includes("Function")) {
          sections["Functions"].push(tutorial);
        } else {
          sections[""].push(tutorial);
        }
      });
      
      setTutorialSections(sections);
    }
  }, [tutorials]);

  const handleTutorialClick = (tutorial: any) => {
    setActiveTutorial(tutorial);
    navigate(`/tutorial/${categorySlug}/${tutorial.slug}`);
  };

  return (
    <aside className={`w-full lg:w-60 bg-white border-r border-gray-200 lg:min-h-screen lg:sticky lg:top-[110px] overflow-auto max-h-[calc(100vh-110px)] ${isOpen ? 'fixed inset-0 z-40 pt-20' : 'hidden lg:block'}`}>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary text-white p-3 rounded-sm shadow-lg"
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      <div className="bg-primary text-white py-3 px-4">
        {isCategoryLoading ? (
          <Skeleton className="h-7 w-40 bg-white/30" />
        ) : (
          <h2 className="text-lg font-semibold">
            {category?.name} Tutorial
          </h2>
        )}
      </div>

      <nav>
        {isTutorialsLoading ? (
          // Skeleton loading state
          Array(10).fill(0).map((_, i) => (
            <div key={i} className="px-4 py-2">
              <Skeleton className="h-6 w-full" />
            </div>
          ))
        ) : (
          // Render tutorial sections
          Object.entries(tutorialSections).map(([sectionName, sectionTutorials]) => (
            <div key={sectionName}>
              {sectionName && (
                <div className="bg-gray-100 py-3 px-4 border-t border-b border-gray-200">
                  <h2 className="text-base font-semibold text-secondary-dark">{category?.name} {sectionName}</h2>
                </div>
              )}
              
              {sectionTutorials.map(tutorial => (
                <div key={tutorial.id} className="sidebar-item border-b border-gray-100">
                  <a 
                    href={`/tutorial/${categorySlug}/${tutorial.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTutorialClick(tutorial);
                      setIsOpen(false);
                    }}
                    className={tutorial.slug === tutorialSlug ? "active" : ""}
                  >
                    {category?.name ? tutorial.title.replace(category.name + ' ', '') : tutorial.title}
                  </a>
                </div>
              ))}
            </div>
          ))
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
