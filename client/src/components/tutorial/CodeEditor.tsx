import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

interface CodeEditorProps {
  code: string;
  output?: string;
  language: string;
  title?: string;
  editable?: boolean;
}

const CodeEditor = ({ code: initialCode, output, language, title = "Example", editable = true }: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(output || "");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<string>("code");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setCompileError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runCode = async () => {
    setIsCompiling(true);
    setCompileError(null);
    
    try {
      // Using Judge0 API or similar compiler API
      const response = await executeCode(code, language);
      setResult(response.output || "No output");
      setTab("result");
    } catch (error: any) {
      setCompileError(error.message || "An error occurred during compilation");
      setTab("result");
    } finally {
      setIsCompiling(false);
    }
  };

  // Function to send code to execution API
  const executeCode = async (code: string, language: string) => {
    // This is a mock function - in a real app, you would send this to a compiler API like Judge0
    // For demo purposes, we'll simulate an API call with mock results
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock implementation for demo purposes
    const mockOutputs: Record<string, string> = {
      cpp: "#include <iostream> example:\nHello, World!",
      python: "Python example:\nHello, World!",
      javascript: "JavaScript example:\nHello, World!",
      java: "Java example:\nHello, World!",
      csharp: "C# example:\nHello, World!",
    };
    
    return { 
      success: true, 
      output: mockOutputs[language] || `${language} execution result:\nHello, World!` 
    };
    
    // In real implementation, you would do:
    // return await apiRequest('POST', '/api/compile', { code, language });
  };

  // Function to syntax highlight the code
  const highlightCode = (code: string, language: string) => {
    // This is a simplified syntax highlighter
    // In a production app, you would use a library like highlight.js or prism.js
    
    if (language === 'cpp') {
      return code
        .replace(/#include\s*<([^>]+)>/g, '<span class="keyword">#include</span> <span class="string">&lt;$1&gt;</span>')
        .replace(/(using|namespace|int|return|void|float|double|char|bool|class|struct|public|private)/g, '<span class="keyword">$1</span>')
        .replace(/(std|cout|cin)/g, '<span class="variable">$1</span>')
        .replace(/(".*?")/g, '<span class="string">$1</span>')
        .replace(/\/\/(.*?)$/gm, '<span class="comment">//$1</span>')
        .replace(/(\d+)/g, '<span class="number">$1</span>')
        .replace(/\b(main)\b/g, '<span class="function">$1</span>');
    } else if (language === 'python') {
      return code
        .replace(/(def|class|if|else|elif|for|while|import|from|return|try|except|finally|with)/g, '<span class="keyword">$1</span>')
        .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
        .replace(/#(.*?)$/gm, '<span class="comment">#$1</span>')
        .replace(/(\d+)/g, '<span class="number">$1</span>')
        .replace(/\b(print|len|range|str|int|float|list|dict|set|tuple)\b/g, '<span class="function">$1</span>');
    } else if (language === 'javascript') {
      return code
        .replace(/(var|let|const|function|return|if|else|for|while|class|import|export|from|true|false)/g, '<span class="keyword">$1</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="string">$1</span>')
        .replace(/\/\/(.*?)$/gm, '<span class="comment">//$1</span>')
        .replace(/(\d+)/g, '<span class="number">$1</span>')
        .replace(/\b(console|document|window|Math|Array|Object|String|Number|Boolean)\b/g, '<span class="variable">$1</span>')
        .replace(/\b(log|getElementById|querySelector|addEventListener)\b/g, '<span class="function">$1</span>');
    }
    
    return code;
  };

  return (
    <div className="bg-gray-900 rounded-md overflow-hidden mt-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-white text-sm font-medium">{title}</span>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={handleCopy}
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-1`}></i> 
            {copied ? 'Copied' : 'Copy'}
          </Button>
          
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={runCode}
            >
              <i className="fas fa-play mr-1"></i> Run
            </Button>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <Tabs defaultValue="code" value={tab} onValueChange={setTab}>
        <div className="bg-gray-800 border-b border-gray-700 px-2">
          <TabsList className="bg-gray-800 border-0">
            <TabsTrigger value="code" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">Code</TabsTrigger>
            {(result || output) && <TabsTrigger value="result" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">Result</TabsTrigger>}
          </TabsList>
        </div>

        <TabsContent value="code" className="m-0">
          {editable ? (
            <div className="p-4 code-editor bg-gray-900">
              <textarea
                value={code}
                onChange={handleCodeChange}
                className="w-full bg-transparent text-white font-mono text-sm focus:outline-none resize-none"
                rows={code.split("\n").length + 1}
              />
            </div>
          ) : (
            <div className="p-4 code-editor bg-gray-900">
              <pre className="text-white text-sm code-color-syntax"
                dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="result" className="m-0">
          <div className="p-4 bg-gray-800">
            <span className="text-white text-sm font-medium">Output:</span>
            {isCompiling ? (
              <div className="bg-gray-700 p-3 mt-2 rounded text-white text-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Compiling and running code...
              </div>
            ) : compileError ? (
              <div className="bg-red-900/30 p-3 mt-2 rounded text-red-200 text-sm border border-red-700">
                <div className="font-bold mb-1">Error:</div>
                {compileError}
              </div>
            ) : (
              <div className="bg-gray-700 p-3 mt-2 rounded text-white text-sm font-mono whitespace-pre-wrap">
                {result || output || "No output"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {editable && (
        <div className="mt-2 p-2 bg-gray-800">
          <Button 
            variant="secondary" 
            className="w-full bg-neutral-bg hover:bg-gray-200 text-neutral-dark"
            onClick={runCode}
            disabled={isCompiling}
          >
            {isCompiling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Running...
              </>
            ) : (
              <>Try it Yourself »</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
