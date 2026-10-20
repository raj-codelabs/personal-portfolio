import { Milestone } from '../types';

export const milestonesData: Milestone[] = [
  {
    id: 'm1-btech-matriculation',
    logNumber: '01',
    commitHash: 'btech-ug',
    branch: 'main',
    branchLabel: 'Academics',
    date: '2026',
    title: 'B.Tech CSE (AI/ML) · Undergraduate Studies',
    summary: 'Commenced undergraduate engineering studies in Computer Science & Engineering (AI/ML) at MATS University, Class of 2030.',
    details:
      'Building a strong foundation in computer science, discrete structures, mathematics, and structured programming.',
    learnings: [
      'Core programming paradigms in C and introductory computer science concepts.',
      'Understanding fundamental data representations and algorithmic problem solving.',
    ],
    marginAnnotation: 'Undergraduate studies commenced at MATS University (Class of 2030).',
    tags: ['B.Tech', 'CSE', 'Academics'],
  },
  {
    id: 'm2-cs50x-completed',
    logNumber: '02',
    commitHash: 'cs50x',
    branch: 'main',
    branchLabel: 'Foundations',
    date: '2026',
    title: 'CS50x — Introduction to Computer Science',
    summary: 'Completed Harvard University’s introduction to computer science, covering C programming, memory, algorithms, and data structures.',
    details:
      'Gained deep foundational understanding of computational thinking, pointers and memory allocation in C, sorting algorithms, and data structures.',
    learnings: [
      'Implemented sorting algorithms, memory inspection, and basic data structures in C.',
      'Developed confidence debugging memory and pointer logic with Valgrind and GDB.',
    ],
    marginAnnotation: 'CS50x certification completed.',
    tags: ['CS50x', 'Harvard', 'Foundations'],
  },
  {
    id: 'm3-cs50p-completed',
    logNumber: '03',
    commitHash: 'cs50p',
    branch: 'python',
    branchLabel: 'Python Track',
    date: '2026',
    title: 'CS50P — Programming with Python',
    summary: 'Completed Harvard University’s intensive Python course covering modular programming, unit testing, regex, and object-oriented design.',
    details:
      'Completed comprehensive problem sets covering functions, conditionals, loops, exceptions, libraries, unit tests with pytest, file I/O, and regular expressions.',
    learnings: [
      'Writing modular, readable Python scripts and test-driven command-line utilities.',
      'Developed disciplined code organization and proficiency with standard Python libraries.',
    ],
    marginAnnotation: 'CS50P certification completed.',
    tags: ['CS50P', 'Python', 'Coursework'],
  },
  {
    id: 'm4-practical-projects',
    logNumber: '04',
    commitHash: 'builds',
    branch: 'projects',
    branchLabel: 'Software',
    date: '2026',
    title: 'Building Practical Projects',
    summary: 'Applying coursework to build useful utilities, including the AI Study Notes Summarizer.',
    details:
      'Applying concepts learned in coursework to create practical command-line utilities, starting with the AI Study Notes Summarizer for lecture review workflows.',
    learnings: [
      'Iterative project development: designing small, testing code, and learning through hands-on practice.',
      'Focusing on clarity, maintainability, and clean terminal user experiences.',
    ],
    marginAnnotation: 'Practical project development: AI Study Notes Summarizer.',
    tags: ['Projects', 'Python CLI', 'Hands-on'],
  },
];
