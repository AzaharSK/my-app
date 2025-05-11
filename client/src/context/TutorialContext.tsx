import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface TutorialContextType {
  activeCategory: string | null;
  activeTutorial: any | null;
  setActiveCategory: (category: string) => void;
  setActiveTutorial: (tutorial: any) => void;
  markTutorialComplete: (tutorialId: number) => Promise<void>;
  userProgress: { [tutorialId: number]: boolean };
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTutorial, setActiveTutorial] = useState<any | null>(null);
  const [userProgress, setUserProgress] = useState<{ [tutorialId: number]: boolean }>({});
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Get user from session/localStorage to avoid circular dependency with AuthContext
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };
    
    checkSession();
  }, []);

  const markTutorialComplete = async (tutorialId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to track your progress",
        variant: "default"
      });
      return;
    }
    
    try {
      await apiRequest('POST', '/api/progress', {
        tutorialId,
        completed: true
      });
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [tutorialId]: true
      }));
      
      // Invalidate progress queries
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      
      toast({
        title: "Progress saved",
        description: "This tutorial has been marked as complete",
      });
    } catch (error) {
      console.error('Error marking tutorial complete:', error);
      toast({
        variant: "destructive",
        title: "Error saving progress",
        description: (error as Error).message || 'An error occurred while saving your progress.',
      });
    }
  };

  return (
    <TutorialContext.Provider
      value={{
        activeCategory,
        activeTutorial,
        setActiveCategory,
        setActiveTutorial,
        markTutorialComplete,
        userProgress
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
};
