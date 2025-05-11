import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CodeEditor from "@/components/tutorial/CodeEditor";
import { useQuery } from "@tanstack/react-query";

// Language specific sample code
const sampleCode: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  python: `# Simple Python program
print("Hello, World!")

# Let's try a simple calculation
sum = 0
for i in range(1, 11):
    sum += i
    
print(f"Sum of numbers 1 to 10 is: {sum}")`,
  javascript: `// JavaScript Hello World
console.log("Hello, World!");

// Simple function example
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("JavaScript Developer"));`,
  java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`
};

// Define types for the tutorial structure
interface TutorialExample {
  title: string;
  code: string;
  explanation: string;
}

interface TutorialSection {
  title: string;
  content: string;
  examples: TutorialExample[];
}

interface TutorialContent {
  title: string;
  description: string;
  sections: TutorialSection[];
}

// Language tutorials
const tutorialContent: Record<string, TutorialContent> = {
  cpp: {
    title: "C++ Tutorial",
    description: "C++ is a cross-platform language that can be used to create high-performance applications.",
    sections: [
      {
        title: "Introduction to C++",
        content: "C++ is a middle-level programming language developed by Bjarne Stroustrup starting in 1979 at Bell Labs. C++ runs on a variety of platforms, such as Windows, Mac OS, and the various versions of UNIX.",
        examples: [
          {
            title: "Hello World in C++",
            code: sampleCode.cpp,
            explanation: "This is the basic structure of a C++ program. The #include directive includes the input/output stream library. The main() function is the entry point of the program."
          }
        ]
      },
      {
        title: "C++ Syntax",
        content: "C++ syntax is similar to C. It has the same basic elements like statements, expressions, and operators. However, C++ adds features like classes, objects, inheritance, polymorphism, and more.",
        examples: [
          {
            title: "Variables and Types",
            code: `#include <iostream>
using namespace std;

int main() {
    // Integer variable
    int age = 25;
    
    // Float variable
    float height = 5.9;
    
    // Character variable
    char grade = 'A';
    
    // Boolean variable
    bool isStudent = true;
    
    // String (C++ style)
    string name = "John Doe";
    
    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Height: " << height << " feet" << endl;
    cout << "Grade: " << grade << endl;
    cout << "Is a student: " << (isStudent ? "Yes" : "No") << endl;
    
    return 0;
}`,
            explanation: "This example demonstrates different variable types in C++ and how to use them."
          }
        ]
      }
    ]
  },
  
  python: {
    title: "Python Tutorial",
    description: "Python is a popular programming language known for its simplicity and readability.",
    sections: [
      {
        title: "Introduction to Python",
        content: "Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.",
        examples: [
          {
            title: "Hello World in Python",
            code: "print('Hello, World!')",
            explanation: "This is the simplest Python program. The print() function outputs text to the screen."
          }
        ]
      },
      {
        title: "Python Data Types",
        content: "Python has several built-in data types including numbers, strings, lists, tuples, dictionaries, and more.",
        examples: [
          {
            title: "Python Data Types Example",
            code: `# Numbers
number = 42
float_number = 3.14

# Strings
name = "Python"
multiline = """This is a
multiline string"""

# Lists (mutable)
fruits = ['apple', 'banana', 'orange']
fruits.append('grape')  # Add item

# Tuples (immutable)
coordinates = (10, 20)

# Dictionaries
person = {
    'name': 'John',
    'age': 30,
    'is_student': False
}

# Print results
print(f"Number: {number}")
print(f"Pi value: {float_number}")
print(f"Language: {name}")
print(f"Fruits: {fruits}")
print(f"Coordinates: {coordinates}")
print(f"Person's name: {person['name']}")`,
            explanation: "This example shows different data types in Python including numbers, strings, lists, tuples, and dictionaries."
          }
        ]
      }
    ]
  },
  
  javascript: {
    title: "JavaScript Tutorial",
    description: "JavaScript is a dynamic programming language that's commonly used for web development.",
    sections: [
      {
        title: "Introduction to JavaScript",
        content: "JavaScript is a scripting or programming language that allows you to implement complex features on web pages. It is the third layer of the standard web technologies, alongside HTML and CSS.",
        examples: [
          {
            title: "Hello World in JavaScript",
            code: "console.log('Hello, World!');",
            explanation: "This simple JavaScript code prints 'Hello, World!' to the console. You can view the output in your browser's developer console."
          }
        ]
      },
      {
        title: "JavaScript Variables and Data Types",
        content: "JavaScript has dynamic types. Variables can hold different data types: numbers, strings, objects, functions, and more.",
        examples: [
          {
            title: "Variables and Data Types",
            code: `// Variables with let and const
let name = "JavaScript";
const year = 1995;

// Different data types
let count = 42;                 // Number
let isProgrammingFun = true;    // Boolean
let nothing = null;             // Null
let undefined_var;              // Undefined

// Arrays
let colors = ["red", "green", "blue"];

// Objects
let person = {
    firstName: "John",
    lastName: "Doe",
    age: 30
};

// Displaying values
console.log("Language: " + name);
console.log("Year created: " + year);
console.log("Count: " + count);
console.log("Is Programming Fun? " + isProgrammingFun);
console.log("Colors: " + colors.join(", "));
console.log("Person: " + person.firstName + " " + person.lastName);`,
            explanation: "This example demonstrates variables, constants, and different data types in JavaScript."
          }
        ]
      }
    ]
  },
  
  java: {
    title: "Java Tutorial",
    description: "Java is a widely-used programming language for building enterprise-level applications.",
    sections: [
      {
        title: "Introduction to Java",
        content: "Java is a programming language and computing platform first released by Sun Microsystems in 1995. It's designed to have as few implementation dependencies as possible, allowing 'write once, run anywhere' (WORA) functionality.",
        examples: [
          {
            title: "Hello World in Java",
            code: sampleCode.java,
            explanation: "This is a simple Java program. Every Java application must have a main method as the entry point of the program."
          }
        ]
      }
    ]
  },
  
  csharp: {
    title: "C# Tutorial",
    description: "C# is a modern, object-oriented programming language developed by Microsoft.",
    sections: [
      {
        title: "Introduction to C#",
        content: "C# (pronounced 'C sharp') is a programming language designed for building applications that run on the .NET Framework. It was developed by Microsoft as part of their .NET initiative.",
        examples: [
          {
            title: "Hello World in C#",
            code: sampleCode.csharp,
            explanation: "This is a basic C# program that outputs 'Hello, World!' to the console."
          }
        ]
      }
    ]
  }
};

const CompilerTutorial: React.FC = () => {
  const params = useParams<{ language?: string }>();
  const language = params.language || "cpp";
  const [location, navigate] = useLocation();
  
  const { title, description, sections } = tutorialContent[language] || tutorialContent.cpp;
  
  // Tabs for different sections
  const [activeTab, setActiveTab] = useState("section-0");

  useEffect(() => {
    // Reset to first section when language changes
    setActiveTab("section-0");
  }, [language]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* W3Schools style left sidebar navigation */}
      <div className="lg:w-64 bg-[#E7E9EB] border-r border-gray-300 shrink-0 overflow-y-auto">
        <div className="p-4 bg-[#04AA6D] text-white">
          <h3 className="text-xl font-bold">{title.replace(" Tutorial", "")}</h3>
        </div>
        
        <div className="p-4 bg-[#D9EEE1] border-b border-gray-300">
          <h4 className="font-bold mb-2">Tutorial Menu</h4>
          {sections.map((section, index) => (
            <button
              key={`sidebar-${index}`}
              className={`block w-full text-left py-2 px-2 rounded hover:bg-gray-200 transition-colors ${
                activeTab === `section-${index}` ? 'bg-gray-200 font-medium' : ''
              }`}
              onClick={() => setActiveTab(`section-${index}`)}
            >
              {section.title}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-b border-gray-300">
          <h4 className="font-bold mb-2">Programming Languages</h4>
          {Object.keys(tutorialContent).map((lang) => (
            <a
              key={lang}
              href={`/compiler/${lang}`}
              className={`block py-1 px-2 rounded ${
                lang === language ? 'bg-[#04AA6D] text-white' : 'text-black hover:bg-gray-200'
              }`}
            >
              {tutorialContent[lang].title.replace(" Tutorial", "")}
            </a>
          ))}
        </div>
        
        <div className="p-4">
          <div className="bg-yellow-100 p-3 rounded border border-yellow-300 text-sm">
            <p className="font-bold">Pro Tip:</p>
            <p>Try changing the code and running it to see what happens!</p>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-lg text-gray-600">{description}</p>
          </div>
          
          {/* Section Content */}
          {sections.map((section, sectionIndex) => (
            <div 
              key={`content-${sectionIndex}`} 
              className={`space-y-6 ${activeTab === `section-${sectionIndex}` ? 'block' : 'hidden'}`}
            >
              <div className="prose prose-blue max-w-none">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                <p className="text-gray-700">{section.content}</p>
              </div>
              
              {section.examples.map((example, exIndex) => (
                <div key={`example-${sectionIndex}-${exIndex}`} className="my-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">{example.title}</h3>
                  <CodeEditor 
                    code={example.code} 
                    language={language} 
                    title="Example"
                  />
                  <div className="mt-4 p-4 bg-[#D9EEE1] rounded text-gray-700">
                    <h4 className="font-bold text-[#04AA6D] mb-1">Explanation:</h4>
                    <p>{example.explanation}</p>
                  </div>
                </div>
              ))}
              
              {/* Try it yourself playground */}
              <div className="bg-[#F1F1F1] border border-gray-300 rounded-md p-6 my-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Try it Yourself</h3>
                <p className="mb-4">Edit and run the code to experiment with the concepts you've learned.</p>
                <CodeEditor 
                  code={sampleCode[language] || sampleCode.cpp}
                  language={language} 
                  title="Code Playground" 
                />
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-10 py-4 border-t border-gray-200">
                {sectionIndex > 0 && (
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab(`section-${sectionIndex - 1}`)}
                    className="flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Previous
                  </Button>
                )}
                {sectionIndex < sections.length - 1 && (
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab(`section-${sectionIndex + 1}`)}
                    className="ml-auto flex items-center gap-1"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompilerTutorial;