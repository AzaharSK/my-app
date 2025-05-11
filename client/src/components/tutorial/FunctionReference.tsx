import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CodeEditor from './CodeEditor';

type FunctionParameter = {
  [key: string]: string;
};

interface FunctionExample {
  id: number;
  name: string;
  description: string;
  syntax: string | null;
  parameters: FunctionParameter | null;
  returnType: string | null;
  code: string;
  output: string | null;
  language: string;
  category: string | null;
  createdAt?: string;
}

interface FunctionReferenceProps {
  language: string;
  functionName?: string;
}

const FunctionReference = ({ language, functionName }: FunctionReferenceProps) => {
  const [activeTab, setActiveTab] = useState<string>('reference');
  const [selectedFunction, setSelectedFunction] = useState<string | undefined>(functionName);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch available categories and functions for this language
  const { data: functions, isLoading: isFunctionsLoading } = useQuery<FunctionExample[]>({
    queryKey: [`/api/languages/${language}/functions`],
    enabled: !!language,
  });

  // Fetch specific function details when a function is selected
  const { data: functionData, isLoading: isFunctionLoading } = useQuery<FunctionExample>({
    queryKey: [`/api/languages/${language}/functions/${selectedFunction}`],
    enabled: !!selectedFunction && !!language,
  });

  // Update selected function when prop changes
  useEffect(() => {
    if (functionName) {
      setSelectedFunction(functionName);
    }
  }, [functionName]);

  // Get unique categories from functions
  const categories = functions 
    ? Array.from(new Set(functions.map((f: FunctionExample) => f.category || 'Uncategorized')))
    : [];
  
  // Filter functions by selected category
  const filteredFunctions = functions 
    ? (selectedCategory 
        ? functions.filter((f: FunctionExample) => f.category === selectedCategory || (!f.category && selectedCategory === 'Uncategorized'))
        : functions)
    : [];

  if (isFunctionsLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">
          <Skeleton className="h-8 w-64" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{language} Reference</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with categories and functions */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-lg mb-3">Categories</h3>
          
          <div className="space-y-1 mb-6">
            <Button 
              variant={!selectedCategory ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(null)}
            >
              All Functions
            </Button>
            
            {categories.map((category) => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="font-semibold text-lg mb-3">Functions</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filteredFunctions.map((func: FunctionExample) => (
              <Button 
                key={func.id}
                variant={selectedFunction === func.name ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => setSelectedFunction(func.name)}
              >
                {func.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          {selectedFunction && functionData ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-3xl font-bold mb-2">{functionData.name}</h3>
                <p className="text-gray-600 mb-4">{functionData.description}</p>
                
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="reference">Reference</TabsTrigger>
                    <TabsTrigger value="example">Example</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="reference" className="mt-4">
                    {functionData.syntax && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Syntax</h4>
                        <pre className="bg-gray-50 p-3 rounded font-mono text-sm">{functionData.syntax}</pre>
                      </div>
                    )}
                    
                    {functionData.parameters && Object.keys(functionData.parameters).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Parameters</h4>
                        <div className="bg-gray-50 rounded overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Parameter</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Object.entries(functionData.parameters).map(([param, desc]) => (
                                <tr key={param}>
                                  <td className="px-4 py-2 font-mono text-sm">{param}</td>
                                  <td className="px-4 py-2 text-sm">{desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {functionData.returnType && (
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Return Value</h4>
                        <p className="bg-gray-50 p-3 rounded">{functionData.returnType}</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="example" className="mt-4">
                    <CodeEditor
                      code={functionData.code}
                      output={functionData.output || ""}
                      language={functionData.language}
                      title="Example"
                      editable={true}
                    />
                    
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                      <h4 className="font-medium text-blue-700 mb-2">Try it yourself</h4>
                      <p className="text-blue-600 text-sm">
                        Modify the code example above and run it to see how {functionData.name} works with different inputs.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">
                {isFunctionLoading ? (
                  "Loading function details..."
                ) : (
                  "Select a function from the list to view its details and examples."
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunctionReference;