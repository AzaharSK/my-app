import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const MarkdownNotebook: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notebooks, setNotebooks] = useState<{ id: string; title: string; content: string }[]>(() => {
    // Load notebooks from localStorage on initial render
    const savedNotebooks = localStorage.getItem("markdown_notebooks");
    return savedNotebooks ? JSON.parse(savedNotebooks) : [
      { id: "1", title: "Getting Started", content: "# Welcome to Markdown Notebook\n\nThis is a simple markdown editor where you can:\n\n- Take notes\n- Format text with **bold**, *italic*, or ~~strikethrough~~\n- Create lists and headings\n- Write code with syntax highlighting\n\n```javascript\nconsole.log('Hello, World!');\n```\n\n## How to use\n\n1. Type your markdown in the editor panel\n2. See the preview on the right\n3. Save your changes\n4. Create new notebooks as needed\n\nHappy note-taking!" }
    ];
  });
  
  const [activeNotebookId, setActiveNotebookId] = useState<string>("");
  const [newNotebookTitle, setNewNotebookTitle] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("edit");
  const { toast } = useToast();
  
  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize with the first notebook if available
  useEffect(() => {
    if (notebooks.length > 0 && !activeNotebookId) {
      setActiveNotebookId(notebooks[0].id);
    }
  }, [notebooks, activeNotebookId]);

  // Save notebooks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("markdown_notebooks", JSON.stringify(notebooks));
  }, [notebooks]);

  // Get the active notebook
  const activeNotebook = notebooks.find(nb => nb.id === activeNotebookId) || notebooks[0];

  // Create a new notebook
  const createNewNotebook = () => {
    if (!newNotebookTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your new notebook",
        variant: "destructive"
      });
      return;
    }

    const newId = Date.now().toString();
    const newNotebook = {
      id: newId,
      title: newNotebookTitle,
      content: `# ${newNotebookTitle}\n\nStart writing your markdown here...`
    };

    setNotebooks([...notebooks, newNotebook]);
    setActiveNotebookId(newId);
    setNewNotebookTitle("");
    
    toast({
      title: "Notebook created",
      description: `Created new notebook: ${newNotebookTitle}`
    });
  };

  // Update the content of the active notebook
  const updateNotebookContent = (content: string) => {
    setNotebooks(notebooks.map(nb => 
      nb.id === activeNotebookId ? { ...nb, content } : nb
    ));
  };

  // Delete the active notebook
  const deleteNotebook = (id: string) => {
    if (notebooks.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You need to have at least one notebook",
        variant: "destructive"
      });
      return;
    }

    const notebookToDelete = notebooks.find(nb => nb.id === id);
    if (!notebookToDelete) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${notebookToDelete.title}"?`);
    if (!confirmed) return;

    const newNotebooks = notebooks.filter(nb => nb.id !== id);
    setNotebooks(newNotebooks);
    
    // If the active notebook is being deleted, select the first available notebook
    if (id === activeNotebookId && newNotebooks.length > 0) {
      setActiveNotebookId(newNotebooks[0].id);
    }

    toast({
      title: "Notebook deleted",
      description: `Deleted notebook: ${notebookToDelete.title}`
    });
  };

  // Render markdown to HTML
  const renderMarkdown = (markdown: string) => {
    // This is a very simple markdown parser for demo purposes
    // For a real app, you'd use a library like marked or react-markdown
    return markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      // Bold, italic, strike
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // Lists
      .replace(/^\s*\*\s(.*)$/gm, '<li>$1</li>')
      .replace(/^\s*-\s(.*)$/gm, '<li>$1</li>')
      .replace(/^\s*\d\.\s(.*)$/gm, '<li>$1</li>')
      // Code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-56"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded w-36"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar skeleton */}
            <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col h-full">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-32 mb-4"></div>
                
                <div className="space-y-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-8 bg-gray-200 animate-pulse rounded w-full"></div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-40 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 animate-pulse rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 animate-pulse rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content skeleton */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="flex">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-12 border-r border-gray-200 p-4">
                        <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-[70vh] bg-gray-100 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Markdown Notebook</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => window.open("https://www.markdownguide.org/cheat-sheet/", "_blank")}
              variant="outline"
              size="sm"
            >
              Markdown Cheatsheet
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with notebooks list */}
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col h-full">
              <h2 className="font-bold text-lg mb-4">Your Notebooks</h2>
              
              <div className="space-y-2 mb-4 flex-1 overflow-y-auto max-h-[60vh]">
                {notebooks.map((notebook) => (
                  <div 
                    key={notebook.id}
                    className={`flex justify-between items-center p-2 rounded ${
                      notebook.id === activeNotebookId ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <button
                      className="text-left font-medium truncate flex-1"
                      onClick={() => setActiveNotebookId(notebook.id)}
                    >
                      {notebook.title}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => deleteNotebook(notebook.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </Button>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="mt-auto">
                <h3 className="font-medium mb-2">Create New Notebook</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Notebook title"
                    value={newNotebookTitle}
                    onChange={(e) => setNewNotebookTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={createNewNotebook}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 5v14M5 12h14"/></svg>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main editor / preview area */}
          <div className="lg:col-span-3">
            {activeNotebook ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <div className="border-b border-gray-200">
                    <TabsList className="w-full justify-start rounded-none h-12 bg-gray-50">
                      <TabsTrigger value="edit" className="flex-1 data-[state=active]:bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex-1 data-[state=active]:bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="split" className="flex-1 data-[state=active]:bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg>
                        Split View
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="edit" className="m-0">
                    <div className="p-4">
                      <textarea
                        className="w-full h-[70vh] p-4 border border-gray-200 rounded-md font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={activeNotebook.content}
                        onChange={(e) => updateNotebookContent(e.target.value)}
                        placeholder="Start writing in Markdown..."
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="m-0">
                    <div 
                      className="p-8 prose prose-blue max-w-none h-[70vh] overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(activeNotebook.content)}</p>` }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="split" className="m-0">
                    <div className="grid grid-cols-2 h-[70vh]">
                      <div className="border-r border-gray-200 p-4">
                        <textarea
                          className="w-full h-full p-4 border border-gray-200 rounded-md font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={activeNotebook.content}
                          onChange={(e) => updateNotebookContent(e.target.value)}
                          placeholder="Start writing in Markdown..."
                        />
                      </div>
                      <div 
                        className="p-8 prose prose-blue max-w-none overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(activeNotebook.content)}</p>` }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500">No notebook selected. Create a new one or select from the list.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownNotebook;