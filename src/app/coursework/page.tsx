"use client";
import { useMemo, useState } from "react";

type CourseItem = {
  title: string;
  period: string;
  link?: string;
  description: string;
  skills?: string[];
};

const dataScienceAICourses: CourseItem[] = [
  {
    title: "Mathematical Foundations of Generative AI",
    period: "Sep 2025",
    link: "https://study.iitm.ac.in/ds/course_pages/BSDA5002.html",
    description: "This course explores deep generative models such as VAEs, GANs, autoregressive models, diffusion models, and large language models, focusing on their probabilistic foundations, learning algorithms, and practical implementations in PyTorch. Through lectures and assignments, I hope to gain hands-on experience applying these models to various AI tasks.",
    skills: ["PyTorch", "Theoretical AI/ML", "Mathematics"],
  },
  {
    title: "Deep Learning Practice",
    period: "Sep 2025", 
    link: "https://study.iitm.ac.in/ds/course_pages/BSDA5013.html",
    description: "Taught by three excellent professors, this course hopes to equip students with the full deep learning stack—covering datasets, frameworks, hardware, deployment, interpretability, and security—while applying tools and best practices to improve training and deployment under real-world constraints. I hope to gain experience in training large-scale models and identifying socially relevant problems that can be addressed using deep learning.",
    skills: ["NLP", "Speech Technology", "Computer Vision", "PyTorch", "Deep Learning", "Lab"],
  },
  {
    title: "Reinforcement Learning",
    period: "Sep 2025",
    link: "https://study.iitm.ac.in/ds/course_pages/BSDA5007.html",
    description: "Taught by Prof. Balaraman Ravindran, this course covers the fundamentals of reinforcement learning, including Markov decision processes, dynamic programming, Monte Carlo methods, temporal-difference learning, and function approximation. I hope the intensive assignments in the course allows me to learn implementing RL algorithms",
    skills: ["Theoretical AI/ML", "PyTorch"]
  },
  {
    title: "Large Language Models",
    period: "May 2025",
    link: "https://study.iitm.ac.in/ds/course_pages/BSDA5004.html",
    description: "One of my favorite courses so far, this course covered the architecture, training, and applications of large language models (LLMs) like GPT and BERT. I learned about transformer architectures, attention mechanisms, and techniques for fine-tuning LLMs for various NLP tasks. Prompted me to choose Generative AI as my minor.",
    skills: ["Theoretical AI/ML", "Mathematics", "PyTorch", "NLP", "Deep Learning"]
  },
  {
    title: "Game Theory and Strategy",
    period: "May 2025",
    link: "https://study.iitm.ac.in/ds/course_pages/BSMS4023.html",
    description: "Learned the mathematical modeling of strategic interactions among rational agents. Covered concepts like Nash equilibrium, dominant strategies, and mixed strategies, with applications in economics, political science, and computer science.  Dr. Bikramaditya Datta really made the concepts come alive with his practical examples and applications.",
    skills: ["Game Theory", "Mathematics", "Strategic Thinking"],
  },
  {
    title: "Software Testing",
    period: "May 2025",
    link: "https://study.iitm.ac.in/ds/course_pages/BSCS3002.html",
    description: "A core course, it provided a comprehensive overview of software testing principles and practices. Taught using Java, covered various testing techniques, including unit testing, integration testing, system testing, and acceptance testing. Learned about test automation and test-driven development (TDD)",
    skills: ["Software Testing", "Java", "Computer Science"],
  },
  {
    title: "Stochastic Methods in Industry",
    period: "Jan 2025",
    link: "https://math.iitm.ac.in/program-mtech-new.php",
    description: "Learned the mathematical and statistical techniques used to model and analyze systems that involve randomness and uncertainty. Studied how such techniques in the context of inventory and stock control, reliability theory, quality control and simulations. Loved the course, however, would have loved to have scored higher :P .",
    skills: ["Stochastic Processes", "Statistics", "Business Applications", "Mathematics"]
  },
  {
    title: "Data Analysis & Visualization in R/Python/SQL",
    period: "Jan 2025",
    link: "https://math.iitm.ac.in/program-mtech-new.php",
    description: "This course provided a comprehensive overview of data analysis and visualization techniques using R, Python, and SQL. Had a fun team project where we analyzed government revenue reports and created a tool for modelling government expenditures with expected outcomes.",
    skills: ["Data Analysis", "Data Visualization", "R", "Python", "SQL"]
  },
  {
    title: "Software Engineering",
    period: "Sep 2024",
    link: "https://study.iitm.ac.in/ds/course_pages/BSCS3001.html",
    description: "A core course, it provided a comprehensive overview of software engineering principles and practices. Covered software development life cycle (SDLC), Agile methodologies, software design patterns, and project management. Completed a semester-long group project to develop an AI integrated course and project management tool for students and course instructors using Agile practices. Prof. Prajish Prasad's insights and guidance throughout the project were invaluable.",
    skills: ["Computer Science", "Project Management", "Java"]
  },
  {
    title: "Deep Learning",
    period: "May 2024",
    link: "https://study.iitm.ac.in/ds/course_pages/BSCS3004.html",
    description: "A core course, it provided a solid foundation in deep learning concepts and techniques. Covered neural networks, convolutional neural networks (CNNs), recurrent neural networks (RNNs). Implemented small models using PyTorch such as a CNN for Image Classification on CIFAR-10 dataset, RNN for Sentiment Analysis on Yelp Reviews",
    skills: ["Deep Learning", "Theoretical AI/ML", "PyTorch"]
  },
  {
    title: "AI: Search Methods for Problem Solving",
    period: "May 2024",
    link: "https://study.iitm.ac.in/ds/course_pages/BSCS3003.html",
    description: "Another core course, it provided a comprehensive introduction to symbolic AI. Introduced to the famous Travelling Salesman Problem and various board games and how to search their state spaces using various algorithms such as A*, Minimax, Alpha-Beta Pruning, etc. Implemented these algorithms in Python.",
    skills: ["Algorithms", "Theoretical AI/ML", "Python"]
  },
  {
    title: "Database Management Systems",
    period: "Jan 2024",
    link: "https://study.iitm.ac.in/ds/course_pages/BSCS2001.html",
    description: "A core course, it provided a solid foundation in database management systems (DBMS) concepts and techniques. Covered relational databases, SQL, normalization, indexing, and transactions. Implemented a mini project to design and develop a library management system using MySQL.",
    skills: ["SQL", "Database Design", "PostgreSQL", "Computer Science"]
  },
  {
    title: "Programming, Data Structures & Algorithms using Python",
    period: "Jan 2024",
    link: "https://study.iitm.ac.in/ds/course_pages/BSCS2002.html",
    description: "A core course, it provided a comprehensive introduction to programming, data structures, and algorithms using Python. Covered fundamental programming concepts, data structures (arrays, linked lists, stacks, queues, trees, graphs), and algorithm design and analysis. Implemented various algorithms and data structures in Python.",
    skills: ["Python", "Algorithms", "Data Structures", "Computer Science"]
  },
  {
    title: "Programming Concepts using Java",
    period: "Jan 2024",
    link: "https://study.iitm.ac.in/ds/course_pages/BSCS2005.html",
    description: "A core course, it provided a comprehensive introduction to programming concepts using Java. Covered fundamental programming concepts, object-oriented programming (OOP), exception handling, file I/O, and GUI programming. Implemented various programs and mini projects in Java.",
    skills: ["Java", "Object-Oriented Programming", "Computer Science"]
  }
];

const lawCourses: CourseItem[] = [
  {
    title: "Technology Law and Policy",
    period: "Fall 2024",
    description: "Legal frameworks governing technology, including data privacy laws, intellectual property in software, cybersecurity regulations, and AI governance.",
    skills: []
  },
];

type CourseSectionProps = {
  title: string;
  courses: CourseItem[];
  sectionKey: string;
  expandedItems: Set<string>;
  toggleExpanded: (key: string) => void;
};

function CourseSection({ title, courses, sectionKey, expandedItems, toggleExpanded }: CourseSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-2">
        {title}
      </h3>
      <h3 className="font-semibold"> 
      CGPA of 9.03 
      </h3>
      <h5>
  Rankings are awarded only after completion of the program. For context in the last term (F2-2025) a student with the CGPA of 9.03 graduated with a batch rank of
  <span className="font-semibold"> 6 out of 111</span> students who passed out in that term.
</h5>

      <h4 className="text-2xs">
          Below are some important courses. For a full list of courses and grades, the latest transcript can be found in the TEST SCORES tab.
      </h4>      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {courses.map((course, index) => {
          const itemKey = `${sectionKey}-${index}`;
          const isExpanded = expandedItems.has(itemKey);
          
          return (
            <div
              key={itemKey}
              className="group cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-100 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-750 self-start"
              onClick={() => toggleExpanded(itemKey)}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {course.period}
                    </p>
                  </div>
                </div>
                
                {/* Expand/Collapse Icon */}
                <div className="ml-4">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="underline">
                      Course Link
                    </a>
                  </p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  
                  {course.skills && (
                    <div>
                      <h5 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                        Key Technologies & Skills:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {course.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CourseworkSection() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  // --- Skills filter state & helpers ---
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());

  const allSkills = useMemo(
    () =>
      Array.from(
        new Set(
          [...dataScienceAICourses, ...lawCourses].flatMap(c => c.skills ?? [])
        )
      ).sort(),
    []
  );

  const toggleSkill = (skill: string) =>
    setSelectedSkills(prev => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });

  const clearSkills = () => setSelectedSkills(new Set());

  const filterBySkills = (courses: CourseItem[]) =>
    selectedSkills.size === 0
      ? courses
      : courses.filter(c =>
        (c.skills ?? []).some(s => selectedSkills.has(s))
      );


  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section className="space-y-8 rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          <span className="font-bold">Academic Coursework</span>
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Click on any course to see details
        </p>
      </div>
      {/* Skills Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Filter by skills:
        </span>

        {allSkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkill(skill)}
            className={
              "text-xs rounded-full px-3 py-1 border transition-colors " +
              (selectedSkills.has(skill)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700")
            }
          >
            {skill}
          </button>
        ))}

        {selectedSkills.size > 0 && (
          <button
            type="button"
            onClick={clearSkills}
            className="text-xs underline text-neutral-700 dark:text-neutral-300 ml-1"
          >
            Clear
          </button>
        )}
      </div>

      <CourseSection 
        title="B.S. in Data Science and Applications (Minor in Generative AI)"
        courses={filterBySkills(dataScienceAICourses)}
        sectionKey="ds-ai"
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
      />
      
      <CourseSection 
        title="B.A.LL.B. (Business Law Hons.)"
        courses={lawCourses}
        sectionKey="law"
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
      />
    </section>
  );
}