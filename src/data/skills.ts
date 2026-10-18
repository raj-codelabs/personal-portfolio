import { SkillCategory } from '../types';

export const skillsData: SkillCategory[] = [
  {
    category: 'Languages',
    kicker: 'Evidence & Applications',
    description: 'Languages actively used in verified projects and coursework.',
    skills: [
      {
        name: 'Python',
        level: 'Coursework & Projects',
        focusArea: 'AI Study Notes Summarizer, CS50P certification',
      },
      {
        name: 'C',
        level: 'Coursework & Labs',
        focusArea: 'CS50x problem sets, university programming coursework',
      },
    ],
  },
  {
    category: 'Tools',
    kicker: 'Everyday Workflow',
    description: 'Development environment and version control.',
    skills: [
      {
        name: 'Git · GitHub',
        level: 'Version Control',
        focusArea: 'Version control, repositories, workflow hygiene',
      },
      {
        name: 'VS Code',
        level: 'Editor',
        focusArea: 'Primary coding environment and debugging',
      },
    ],
  },
  {
    category: 'Learning now',
    kicker: 'Active Academic Focus',
    description: 'Current technical exploration and curriculum.',
    skills: [
      {
        name: 'AI/ML Foundations',
        level: 'Active Focus',
        focusArea: 'LLM prompting, token handling, introductory machine learning',
      },
      {
        name: 'Data Structures & Algorithms',
        level: 'Active Focus',
        focusArea: 'Algorithmic problem-solving and fundamental data structures',
      },
    ],
  },
];
