import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const Footer = () => {
  // Fetch categories for footer links
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  return (
    <footer className="bg-secondary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">TUTORIALS</h3>
            <ul className="space-y-2">
              {categories ? (
                categories.map((category: any) => (
                  <li key={category.slug}>
                    <Link href={`/tutorial/${category.slug}`} className="text-gray-300 hover:text-white text-sm">
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback list if categories aren't loaded yet
                ['HTML', 'CSS', 'JavaScript', 'Python', 'SQL', 'C++'].map(cat => (
                  <li key={cat}>
                    <Link href={`/tutorial/${cat.toLowerCase()}`} className="text-gray-300 hover:text-white text-sm">
                      {cat}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">RESOURCES</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-300 hover:text-white text-sm">Blog</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white text-sm">FAQ</Link></li>
              <li><Link href="/community" className="text-gray-300 hover:text-white text-sm">Community</Link></li>
              <li><Link href="/references" className="text-gray-300 hover:text-white text-sm">References</Link></li>
              <li><Link href="/get-certified" className="text-gray-300 hover:text-white text-sm">Certifications</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white text-sm">About</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white text-sm">Careers</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">FOLLOW US</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-300 hover:text-white"><i className="fab fa-github"></i></a>
            </div>
            <p className="text-sm text-gray-400">
              Receive updates on tutorials and events
            </p>
            <div className="mt-2 flex">
              <Input 
                type="email" 
                placeholder="Email address" 
                className="px-3 py-2 text-sm rounded-l-md focus:outline-none text-neutral-dark flex-1 border-r-0" 
              />
              <Button className="bg-primary hover:bg-primary-dark px-3 py-2 rounded-r-md text-white text-sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} BrightCoreLabs. All rights reserved. Reimagining learning.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
