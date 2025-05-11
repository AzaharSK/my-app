import { Link } from "wouter";

type LanguageSection = {
  name: string;
  path: string;
};

type LanguageItem = {
  name: string;
  slug: string;
  sections: {
    learn: LanguageSection;
    mcq: LanguageSection;
    code: LanguageSection;
  }
};

const languages: LanguageItem[] = [
  {
    name: "C++",
    slug: "cpp",
    sections: {
      learn: { name: "Learn", path: "/tutorial/cpp" },
      mcq: { name: "MCQ", path: "/mcq/cpp" },
      code: { name: "Code", path: "/practice/cpp" }
    }
  },
  {
    name: "Python",
    slug: "python",
    sections: {
      learn: { name: "Learn", path: "/tutorial/python" },
      mcq: { name: "MCQ", path: "/mcq/python" },
      code: { name: "Code", path: "/practice/python" }
    }
  },
  {
    name: "JavaScript",
    slug: "javascript",
    sections: {
      learn: { name: "Learn", path: "/tutorial/javascript" },
      mcq: { name: "MCQ", path: "/mcq/javascript" },
      code: { name: "Code", path: "/practice/javascript" }
    }
  },
  {
    name: "HTML",
    slug: "html",
    sections: {
      learn: { name: "Learn", path: "/tutorial/html" },
      mcq: { name: "MCQ", path: "/mcq/html" },
      code: { name: "Code", path: "/practice/html" }
    }
  },
  {
    name: "CSS",
    slug: "css",
    sections: {
      learn: { name: "Learn", path: "/tutorial/css" },
      mcq: { name: "MCQ", path: "/mcq/css" },
      code: { name: "Code", path: "/practice/css" }
    }
  },
  {
    name: "SQL",
    slug: "sql",
    sections: {
      learn: { name: "Learn", path: "/tutorial/sql" },
      mcq: { name: "MCQ", path: "/mcq/sql" },
      code: { name: "Code", path: "/practice/sql" }
    }
  },
  {
    name: "Java",
    slug: "java",
    sections: {
      learn: { name: "Learn", path: "/tutorial/java" },
      mcq: { name: "MCQ", path: "/mcq/java" },
      code: { name: "Code", path: "/practice/java" }
    }
  },
  {
    name: "C#",
    slug: "csharp",
    sections: {
      learn: { name: "Learn", path: "/tutorial/csharp" },
      mcq: { name: "MCQ", path: "/mcq/csharp" },
      code: { name: "Code", path: "/practice/csharp" }
    }
  }
];

const LanguageMenuBar = () => {
  return (
    <div className="flex flex-nowrap overflow-x-auto">
      {languages.map((language) => (
        <div key={language.slug} className="flex-shrink-0">
          <div className="flex items-center">
            {/* Language name */}
            <div className="px-4 py-3 font-medium border-r border-white/10 bg-black/10">
              {language.name}
            </div>
            
            {/* Learn section */}
            <Link 
              href={language.sections.learn.path}
              className="px-3 py-3 hover:bg-black/20"
            >
              {language.sections.learn.name}
            </Link>
            
            {/* MCQ section */}
            <Link 
              href={language.sections.mcq.path}
              className="px-3 py-3 hover:bg-black/20"
            >
              {language.sections.mcq.name}
            </Link>
            
            {/* Code section */}
            <Link 
              href={language.sections.code.path}
              className="px-3 py-3 hover:bg-black/20 border-r border-white/10"
            >
              {language.sections.code.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguageMenuBar;