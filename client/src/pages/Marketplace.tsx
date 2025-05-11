import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define our product types
type ProductCategory = "ebooks" | "courses" | "hardware" | "merchandise";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  featured?: boolean;
  badge?: string;
}

const products: Product[] = [
  {
    id: "ebook-1",
    name: "JavaScript Complete Reference",
    description: "Master JavaScript with this comprehensive guide",
    price: 29.99,
    image: "https://placehold.co/300x400/e3f2fd/1e88e5?text=JS+eBook",
    category: "ebooks",
    featured: true,
    badge: "bestseller"
  },
  {
    id: "ebook-2",
    name: "Python for Beginners",
    description: "Start your Python journey with practical examples",
    price: 24.99,
    image: "https://placehold.co/300x400/e8f5e9/43a047?text=Python+eBook",
    category: "ebooks"
  },
  {
    id: "ebook-3",
    name: "HTML & CSS Fundamentals",
    description: "Build beautiful websites from scratch",
    price: 19.99,
    image: "https://placehold.co/300x400/fff3e0/ef6c00?text=HTML+CSS+eBook",
    category: "ebooks"
  },
  {
    id: "course-1",
    name: "React Masterclass",
    description: "Become a React professional with this advanced course",
    price: 89.99,
    image: "https://placehold.co/300x200/e8eaf6/3949ab?text=React+Course",
    category: "courses",
    featured: true
  },
  {
    id: "course-2",
    name: "Full Stack Development",
    description: "Learn frontend and backend development",
    price: 129.99,
    image: "https://placehold.co/300x200/fce4ec/d81b60?text=Full+Stack+Course",
    category: "courses",
    badge: "popular"
  },
  {
    id: "course-3",
    name: "Node.js Advanced Topics",
    description: "Dive deep into Node.js server-side development",
    price: 79.99,
    image: "https://placehold.co/300x200/f1f8e9/7cb342?text=Node.js+Course",
    category: "courses"
  },
  {
    id: "hardware-1",
    name: "Raspberry Pi 4 Kit",
    description: "Complete Raspberry Pi 4 starter kit with accessories",
    price: 99.99,
    image: "https://placehold.co/300x300/ffebee/c62828?text=Raspberry+Pi",
    category: "hardware",
    featured: true
  },
  {
    id: "hardware-2",
    name: "Arduino Starter Kit",
    description: "Learn electronics and programming with Arduino",
    price: 49.99,
    image: "https://placehold.co/300x300/e3f2fd/1976d2?text=Arduino+Kit",
    category: "hardware"
  },
  {
    id: "merch-1",
    name: "Coding T-Shirt",
    description: "Premium cotton t-shirt with coding design",
    price: 24.99,
    image: "https://placehold.co/300x300/f3e5f5/7b1fa2?text=Coding+Shirt",
    category: "merchandise"
  },
  {
    id: "merch-2",
    name: "Developer Mug",
    description: "Ceramic mug with funny developer quotes",
    price: 14.99,
    image: "https://placehold.co/300x300/fffde7/fbc02d?text=Dev+Mug",
    category: "merchandise"
  },
  {
    id: "merch-3",
    name: "Programming Stickers Pack",
    description: "Set of 10 high-quality programming stickers",
    price: 9.99,
    image: "https://placehold.co/300x300/e0f7fa/00acc1?text=Stickers",
    category: "merchandise"
  },
  {
    id: "merch-4",
    name: "Coding Poster",
    description: "High-quality print of coding-themed artwork",
    price: 19.99,
    image: "https://placehold.co/300x300/fff8e1/ffb300?text=Coding+Poster",
    category: "merchandise"
  }
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Separate featured products
  const featuredProducts = products.filter(product => product.featured);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">BrightCoreLabs Marketplace</h1>
        <p className="text-neutral-dark mb-6">Shop for learning materials, courses, and merchandise to support your coding journey</p>
        
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {searchQuery === "" && activeCategory === "all" && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Product Categories */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
        <div className="mb-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="ebooks">eBooks</TabsTrigger>
            <TabsTrigger value="courses">Online Courses</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ebooks" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="courses" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="hardware" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="merchandise" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.badge && (
          <Badge className="absolute top-2 right-2 bg-primary text-white">
            {product.badge}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex-grow">
        <p className="text-xl font-bold text-primary-dark">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button className="w-full bg-primary hover:bg-primary-dark">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}