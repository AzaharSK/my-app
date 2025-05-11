import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTutorial } from "@/context/TutorialContext";
import { useQuery } from "@tanstack/react-query";

interface TutorialNavigationProps {
  categorySlug: string;
  tutorialSlug?: string;
  isHome?: boolean;
}

const TutorialNavigation = ({ categorySlug, tutorialSlug, isHome = false }: TutorialNavigationProps) => {
  // Get tutorials for the category to determine prev/next
  const { data: tutorials } = useQuery({
    queryKey: [`/api/categories/${categorySlug}/tutorials`],
    enabled: !!categorySlug && !!tutorialSlug && !isHome,
  });

  // Find current tutorial index and determine prev/next tutorials
  const currentIndex = tutorials?.findIndex((t: any) => t.slug === tutorialSlug) || -1;
  const prevTutorial = currentIndex > 0 ? tutorials?.[currentIndex - 1] : null;
  const nextTutorial = currentIndex !== -1 && currentIndex < (tutorials?.length || 0) - 1 
    ? tutorials?.[currentIndex + 1] 
    : null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {isHome ? (
        <Button
          variant="primary" 
          className="bg-primary text-white hover:bg-primary-dark"
          asChild
        >
          <Link href={`/tutorial/${categorySlug}`}>
            <i className="fas fa-home mr-2"></i> Home
          </Link>
        </Button>
      ) : (
        <Button
          variant="primary" 
          className="bg-primary text-white hover:bg-primary-dark"
          asChild
        >
          <Link href={`/tutorial/${categorySlug}`}>
            <i className="fas fa-arrow-left mr-2"></i> Home
          </Link>
        </Button>
      )}

      {!isHome && nextTutorial && (
        <Button 
          variant="primary" 
          className="bg-primary text-white hover:bg-primary-dark ml-auto"
          asChild
        >
          <Link href={`/tutorial/${categorySlug}/${nextTutorial.slug}`}>
            Next <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </Button>
      )}
    </div>
  );
};

export default TutorialNavigation;
