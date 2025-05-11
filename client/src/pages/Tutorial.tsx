import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/layout/Sidebar";
import CodeEditor from "@/components/tutorial/CodeEditor";
import TutorialNavigation from "@/components/tutorial/TutorialNavigation";
import { Button } from "@/components/ui/button";
import { useTutorial } from "@/context/TutorialContext";
import { useAuth } from "@/context/AuthContext";

const Tutorial = () => {
  const params = useParams();
  const { category: categorySlug, slug: tutorialSlug } = params;
  const { setActiveCategory, setActiveTutorial, markTutorialComplete } = useTutorial();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Set active category based on URL params
  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    }
  }, [categorySlug, setActiveCategory]);

  // Fetch category details
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: [`/api/categories/${categorySlug}`],
    enabled: !!categorySlug,
  });

  // Fetch all tutorials for the category
  const { data: tutorials, isLoading: isTutorialsLoading } = useQuery({
    queryKey: [`/api/categories/${categorySlug}/tutorials`],
    enabled: !!categorySlug,
  });

  // If no specific tutorial is selected, navigate to the first one
  useEffect(() => {
    if (!tutorialSlug && tutorials && tutorials.length > 0) {
      // Only navigate if we're not already on the category home page
      navigate(`/tutorial/${categorySlug}/${tutorials[0].slug}`);
    }
  }, [tutorials, tutorialSlug, categorySlug, navigate]);

  // Fetch tutorial details when a specific tutorial is selected
  const { data: tutorialData, isLoading: isTutorialLoading } = useQuery({
    queryKey: [`/api/tutorials/${tutorialSlug}`],
    enabled: !!tutorialSlug,
  });

  // Fetch user progress if authenticated
  const { data: progressData } = useQuery({
    queryKey: ['/api/progress'],
    enabled: !!user,
  });

  // Update active tutorial when data is loaded
  useEffect(() => {
    if (tutorialData?.tutorial) {
      setActiveTutorial(tutorialData.tutorial);
    }
  }, [tutorialData, setActiveTutorial]);

  // Check if current tutorial is completed
  const isTutorialCompleted = progressData?.some((p: any) => 
    p.tutorialId === tutorialData?.tutorial?.id && p.completed
  );

  // Handle mark as complete
  const handleMarkComplete = () => {
    if (tutorialData?.tutorial) {
      markTutorialComplete(tutorialData.tutorial.id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar categorySlug={categorySlug} tutorialSlug={tutorialSlug} />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 bg-white lg:bg-neutral-bg">
        <div className="max-w-4xl mx-auto bg-white lg:shadow-sm lg:rounded-md lg:p-6">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6 bg-white rounded-md shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-lg mr-3">B</div>
              <div>
                {isCategoryLoading ? (
                  <Skeleton className="h-6 w-40" />
                ) : (
                  <h2 className="text-xl font-semibold text-secondary-dark">{category?.name} Certification Course</h2>
                )}
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-dark text-white">
              CHECK IT OUT!
            </Button>
          </div>

          {/* Tutorial Content */}
          <div className="mb-8">
            {isTutorialLoading ? (
              <>
                <Skeleton className="h-10 w-72 mb-6" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4 mb-6" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-secondary-dark mb-6">
                  {tutorialData?.tutorial?.title || (tutorials?.[0]?.title + " Tutorial")}
                </h1>

                <TutorialNavigation 
                  categorySlug={categorySlug} 
                  tutorialSlug={tutorialSlug}
                  isHome={!tutorialSlug}
                />

                {/* Tutorial Section */}
                <section className="bg-neutral-bg p-6 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold text-secondary-dark mb-4">
                    {!tutorialSlug ? "Learn " + category?.name : ""}
                  </h2>
                  
                  <div className="space-y-4">
                    <div dangerouslySetInnerHTML={{ 
                      __html: tutorialData?.tutorial?.content || 
                        (tutorials?.[0]?.content &&
                          tutorials[0].content.split('. ').map((s: string) => `<p class="text-neutral-dark">${s}.</p>`).join('')
                        ) ||
                        ""
                    }} />
                    
                    <div className="mt-6">
                      {tutorialSlug ? (
                        user ? (
                          <Button 
                            className={`${
                              isTutorialCompleted 
                                ? "bg-green-500 hover:bg-green-600" 
                                : "bg-primary hover:bg-primary-dark"
                            } text-white px-5 py-2.5 rounded text-sm font-medium transition-colors`}
                            onClick={handleMarkComplete}
                            disabled={isTutorialCompleted}
                          >
                            {isTutorialCompleted 
                              ? "✓ Completed" 
                              : "Mark as Complete"}
                          </Button>
                        ) : (
                          <Button 
                            className="bg-primary hover:bg-primary-dark text-white"
                            onClick={() => navigate("/login")}
                          >
                            Log in to track progress
                          </Button>
                        )
                      ) : (
                        <Button 
                          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded text-sm font-medium transition-colors"
                          onClick={() => tutorials && navigate(`/tutorial/${categorySlug}/${tutorials[0].slug}`)}
                        >
                          Start learning {category?.name} now »
                        </Button>
                      )}
                    </div>
                  </div>
                </section>

                {/* Code Examples Section */}
                {tutorialData?.codeExamples && tutorialData.codeExamples.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-secondary-dark mb-4">Examples in This Chapter</h2>
                    
                    <p className="text-neutral-dark mb-4">
                      Our "Try it Yourself" editor makes it easy to learn {category?.name}. 
                      You can edit code and view the result in your browser.
                    </p>

                    {tutorialData.codeExamples.map((example: any) => (
                      <CodeEditor
                        key={example.id}
                        code={example.code}
                        output={example.output}
                        language={example.language}
                        title={example.title}
                        editable={true}
                      />
                    ))}

                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        className="bg-neutral-bg border border-gray-300 hover:bg-gray-200 text-neutral-dark"
                      >
                        Try it Yourself »
                      </Button>
                    </div>
                  </section>
                )}

                {/* Learning Path Section */}
                {tutorialSlug && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-secondary-dark mb-4">
                      Learn {category?.name} By Examples
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {tutorials?.slice(0, 4).map((tutorial: any) => (
                        <div 
                          key={tutorial.id} 
                          className="bg-neutral-bg p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/tutorial/${categorySlug}/${tutorial.slug}`)}
                        >
                          <h3 className="font-semibold text-lg text-secondary-dark mb-2">{tutorial.title}</h3>
                          <p className="text-sm text-neutral-dark mb-3">
                            {tutorial.content.split('.')[0].substring(0, 65)}...
                          </p>
                          <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium p-0">
                            Learn more »
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Next / Previous Navigation */}
          {tutorialSlug && (
            <div className="flex justify-between border-t border-gray-200 pt-6 mt-8">
              <Button variant="link" className="text-primary hover:text-primary-dark" asChild>
                <div onClick={() => navigate(`/tutorial/${categorySlug}`)}>
                  <i className="fas fa-arrow-left mr-2"></i> Previous
                </div>
              </Button>
              
              <Button variant="link" className="text-primary hover:text-primary-dark" asChild>
                <div onClick={() => {
                  // Find the next tutorial
                  if (tutorials) {
                    const currentIndex = tutorials.findIndex((t: any) => t.slug === tutorialSlug);
                    if (currentIndex !== -1 && currentIndex < tutorials.length - 1) {
                      navigate(`/tutorial/${categorySlug}/${tutorials[currentIndex + 1].slug}`);
                    }
                  }
                }}>
                  Next <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Button>
            </div>
          )}
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
            <div className="w-16 h-16 bg-primary rounded flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">B</div>
            <h3 className="font-semibold text-lg text-secondary-dark">
              {category?.name || "Programming"} Certification Course
            </h3>
            <p className="text-sm text-neutral-dark my-3">
              Become certified in {category?.name || "programming"} with our comprehensive course.
            </p>
            <Button className="bg-primary hover:bg-primary-dark text-white w-full">
              CHECK IT OUT!
            </Button>
          </div>

          {/* Student Image */}
          <div className="mt-6">
            <svg className="w-full h-48 bg-gray-200 rounded-lg" viewBox="0 0 400 200">
              <rect width="400" height="200" fill="#f0f0f0" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#888">Student Learning Image</text>
            </svg>
          </div>

          {/* Pro Access Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 mt-6 text-white">
            <h3 className="font-bold text-xl mb-2">Full Access</h3>
            <p className="text-white/80 text-sm mb-3">
              Unlock all tutorials, examples, and exercises with Pro Access.
            </p>
            <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100 w-full">
              Learn More
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Tutorial;
