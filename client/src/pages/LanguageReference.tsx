import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import FunctionReference from "@/components/tutorial/FunctionReference";
import Sidebar from "@/components/layout/Sidebar";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

const LanguageReference = () => {
  const params = useParams();
  const { language, functionName } = params;
  
  // Fetch category details for the language
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${language}`],
    enabled: !!language,
  });

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar categorySlug={language || ""} />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 bg-white lg:bg-neutral-bg">
        <div className="max-w-4xl mx-auto bg-white lg:shadow-sm lg:rounded-md lg:p-6">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 bg-white rounded-md shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-lg mr-3">
                {language?.charAt(0).toUpperCase()}
              </div>
              <div>
                {isCategoryLoading ? (
                  <Skeleton className="h-6 w-40" />
                ) : (
                  <h2 className="text-xl font-semibold text-secondary-dark">{category?.name} Reference</h2>
                )}
              </div>
            </div>
          </div>

          {/* Function Reference Content */}
          <div className="mb-8">
            {language && <FunctionReference language={language} functionName={functionName || undefined} />}
          </div>
        </div>
      </main>

      {/* Right Sidebar / Ads */}
      <aside className="w-full lg:w-72 bg-white border-l border-gray-200 p-4 hidden lg:block">
        <div className="sticky top-[110px]">
          <div className="text-center mb-4">
            <span className="text-xs text-neutral-mid uppercase">ADVERTISEMENT</span>
          </div>

          {/* Certification Banner */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 text-center">
            <div className="w-16 h-16 bg-primary rounded flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
              {language?.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-semibold text-lg text-secondary-dark">
              {category?.name || "Programming"} Certification Course
            </h3>
            <p className="text-sm text-neutral-dark my-3">
              Become certified in {category?.name || "programming"} with our comprehensive course.
            </p>
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-sm w-full">
              CHECK IT OUT!
            </button>
          </div>

          {/* Pro Access Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 mt-6 text-white">
            <h3 className="font-bold text-xl mb-2">Full Access</h3>
            <p className="text-white/80 text-sm mb-3">
              Unlock all references, examples, and exercises with Pro Access.
            </p>
            <button className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-sm w-full">
              Learn More
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LanguageReference;