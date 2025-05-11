import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/tutorial/CodeEditor";

const Home = () => {
  const [, navigate] = useLocation();

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Automatically navigate to C++ tutorial if coming to homepage
  useEffect(() => {
    if (categories && categories.length > 0) {
      const cppCategory = categories.find((cat: any) => cat.slug === 'cpp') || categories[0];
      // Uncomment to auto-navigate:
      // navigate(`/tutorial/${cppCategory.slug}`);
    }
  }, [categories, navigate]);

  const featuresList = [
    {
      icon: "fas fa-laptop-code",
      title: "Interactive Tutorials",
      description: "Learn by doing with our interactive tutorial platform. Write and run code directly in your browser."
    },
    {
      icon: "fas fa-chart-line",
      title: "Track Your Progress",
      description: "Keep track of your learning journey with personalized progress tracking."
    },
    {
      icon: "fas fa-certificate",
      title: "Get Certified",
      description: "Earn certificates to showcase your skills to potential employers."
    },
    {
      icon: "fas fa-users",
      title: "Join Our Community",
      description: "Connect with other learners, share knowledge, and collaborate on projects."
    }
  ];

  const sampleCode = `#include <iostream>
using namespace std;

int main() {
  cout << "Welcome to BrightCoreLabs!";
  return 0;
}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-dark mb-6">
            Reimagining learning with{" "}
            <span className="text-primary">BrightCoreLabs</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-dark mb-8 max-w-3xl mx-auto">
            Master coding with our interactive tutorials, exercises, and projects. 
            Track your progress, earn certifications, and build your tech career.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white px-6"
              onClick={() => navigate("/register")}
            >
              Start Learning Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => categories && navigate(`/tutorial/${categories[0].slug}`)}
            >
              Explore Tutorials
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary-dark mb-12">
            Why Learn with BrightCoreLabs?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresList.map((feature, index) => (
              <Card key={index} className="border border-gray-100">
                <CardHeader className="pb-2">
                  <div className="mb-4 text-4xl text-primary">
                    <i className={feature.icon}></i>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-mid text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary-dark mb-8">
            Explore Our Tutorials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isCategoriesLoading ? (
              // Loading state
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="border border-gray-100 opacity-60 animate-pulse">
                  <CardHeader className="h-24 bg-gray-100"></CardHeader>
                  <CardContent className="pt-4">
                    <div className="h-6 bg-gray-100 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Categories display
              categories?.map((category: any) => (
                <Card key={category.id} className="border border-gray-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-secondary-dark">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-neutral-mid text-sm">
                      {category.description || `Learn ${category.name} programming with our comprehensive tutorials.`}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full text-primary hover:text-primary-dark border-primary hover:border-primary-dark"
                      onClick={() => navigate(`/tutorial/${category.slug}`)}
                    >
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-12 bg-neutral-bg rounded-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary-dark mb-6">
            Learn by Doing
          </h2>
          <p className="text-center text-neutral-dark mb-8">
            Our interactive code editors let you practice coding directly in your browser
          </p>
          
          <CodeEditor 
            code={sampleCode} 
            output="Welcome to BrightCoreLabs!" 
            language="cpp" 
            title="Try it yourself"
            editable={true}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 mt-12 bg-primary text-white rounded-lg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students already learning on BrightCoreLabs
          </p>
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => navigate("/register")}
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
