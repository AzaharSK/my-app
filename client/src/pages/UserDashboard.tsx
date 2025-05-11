import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserDashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  // Fetch user progress
  const { data: progressData } = useQuery({
    queryKey: ['/api/progress'],
    enabled: !!user,
  });

  // Fetch categories and tutorials for displaying progress
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    enabled: !!user,
  });

  // Fetch all tutorials
  const { data: allTutorials } = useQuery({
    queryKey: ['/api/tutorials'],
    enabled: !!user,
  });

  // Calculate progress statistics
  const calculateProgress = () => {
    if (!progressData || !allTutorials) return { total: 0, completed: 0, percentage: 0 };
    
    const total = allTutorials.length;
    const completed = progressData.filter((p: any) => p.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  };

  const progress = calculateProgress();
  
  // Calculate per-category progress
  const getCategoryProgress = (categoryId: number) => {
    if (!progressData || !allTutorials) return { total: 0, completed: 0, percentage: 0 };
    
    const categoryTutorials = allTutorials.filter((t: any) => t.categoryId === categoryId);
    const total = categoryTutorials.length;
    
    if (!total) return { total: 0, completed: 0, percentage: 0 };
    
    const completedIds = progressData
      .filter((p: any) => p.completed)
      .map((p: any) => p.tutorialId);
    
    const completed = categoryTutorials.filter((t: any) => completedIds.includes(t.id)).length;
    const percentage = Math.round((completed / total) * 100);
    
    return { total, completed, percentage };
  };

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-72 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null; // will redirect via useEffect

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-dark">Dashboard</h1>
            <p className="text-neutral-mid">Track your learning progress</p>
          </div>
          <Button onClick={() => navigate("/")}>Continue Learning</Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                    <AvatarFallback className="bg-primary text-white text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <p className="text-neutral-mid">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Student
                      </span>
                      <span className="text-sm text-neutral-mid">Member since {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
                <CardDescription>
                  Track your overall progress across all tutorials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall completion</span>
                      <span className="text-sm font-medium">{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    <p className="text-xs text-neutral-mid mt-2">
                      You've completed {progress.completed} out of {progress.total} tutorials
                    </p>
                  </div>

                  {/* Recently Completed */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recently Completed</h3>
                    {progressData && progressData.length > 0 ? (
                      <div className="space-y-2">
                        {progressData
                          .filter((p: any) => p.completed)
                          .slice(0, 3)
                          .map((p: any) => {
                            const tutorial = allTutorials?.find((t: any) => t.id === p.tutorialId);
                            const category = categories?.find((c: any) => c.id === tutorial?.categoryId);
                            
                            return tutorial ? (
                              <div 
                                key={p.id} 
                                className="p-3 bg-neutral-bg rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                onClick={() => navigate(`/tutorial/${category?.slug}/${tutorial.slug}`)}
                              >
                                <div>
                                  <h4 className="font-medium">{tutorial.title}</h4>
                                  <p className="text-xs text-neutral-mid">{category?.name || "Tutorial"}</p>
                                </div>
                                <span className="text-green-600 text-sm">
                                  <i className="fas fa-check-circle mr-1"></i> Completed
                                </span>
                              </div>
                            ) : null;
                          })}
                      </div>
                    ) : (
                      <p className="text-neutral-mid">No tutorials completed yet. Start learning!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-dark">My Courses</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {categories?.map((category: any) => {
                const categoryProgress = getCategoryProgress(category.id);
                
                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description || `Learn ${category.name} programming`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm font-medium">{categoryProgress.percentage}%</span>
                          </div>
                          <Progress value={categoryProgress.percentage} className="h-2" />
                          <p className="text-xs text-neutral-mid mt-1">
                            {categoryProgress.completed} of {categoryProgress.total} tutorials completed
                          </p>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/tutorial/${category.slug}`)}
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Your Certificates</CardTitle>
                <CardDescription>Complete courses to earn certificates</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-10">
                  <div className="text-4xl text-neutral-mid mb-4">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">No certificates yet</h3>
                  <p className="text-neutral-mid mb-6">
                    Complete a full course to earn your first certificate
                  </p>
                  <Button onClick={() => navigate("/")}>Explore Courses</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Username</label>
                      <Input value={user.username} disabled className="bg-gray-100" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Email</label>
                      <Input value={user.email} disabled className="bg-gray-100" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="emailNotifications" className="mr-2" />
                      <label htmlFor="emailNotifications">Receive email notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="darkMode" className="mr-2" />
                      <label htmlFor="darkMode">Dark mode</label>
                    </div>
                  </div>
                </div>
                
                <Button className="bg-primary hover:bg-primary-dark">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
