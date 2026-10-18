import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'ai-study-notes-summarizer',
    title: 'AI Study Notes Summarizer',
    subtitle: 'PROJECT 01 · PYTHON / AI TOOLING',
    problem:
      'Reviewing dense, unstructured lecture slides and course notes requires significant manual effort to extract core definitions, formulas, and actionable revision points.',
    built:
      'A command-line tool built with Python that ingests study notes, formats prompts for concise summarization, and outputs clean, structured review points and key terms directly to the terminal.',
    stack: ['Python', 'LLM API', 'CLI (Rich / Argparse)'],
    status: 'Open source',
    repoUrl: 'https://github.com/raj-codelabs',
    liveDemoUrl: undefined,
    architecture:
      '3-Step Pipeline: (1) Ingestion & text normalization from markdown/text files, (2) Prompt templating with token bounds for extraction, (3) ANSI terminal output formatting with Rich.',
    lessonsLearned: [
      'Engineered structured prompt templates and bounded token windows to avoid truncated responses.',
      'Implemented robust CLI argument parsing with argparse and exit-code discipline.',
      'Designed clean terminal formatting with Rich to present key definitions and summaries without visual clutter.',
    ],
    keyTakeaway: 'Built a reliable command-line utility that solves a real study workflow problem while mastering Python tooling.',
  },
  {
    id: 'prereqos',
    title: 'PrereqOS',
    subtitle: 'PLANNED BUILD · LEARNING TOOLS',
    problem:
      'Exploring prerequisite relationships between computer science concepts to help learners identify gaps in their understanding.',
    built:
      'Planned concept: interactive prerequisite graph connecting foundational CS topics and learning pathways.',
    stack: ['Python', 'Knowledge Graphs', 'Graph Algorithms'],
    status: 'Idea',
    repoUrl: 'https://github.com/raj-codelabs',
    liveDemoUrl: undefined,
    architecture:
      'Directed acyclic graph representation of computer science concepts and dependency ordering.',
    lessonsLearned: [
      'Schema design for dependency chains.',
      'Evaluating topological sort approaches for learning tracks.',
    ],
    keyTakeaway: 'Helping learners visualize prerequisite paths before tackling complex topics.',
  },
  {
    id: 'book-recommendation-engine',
    title: 'Book Recommendation Engine',
    subtitle: 'PLANNED BUILD · RECOMMENDATION SYSTEMS',
    problem:
      'Exploring how recommendation algorithms score and rank books based on reader preferences and subject tags.',
    built:
      'Planned concept: introductory similarity scoring pipeline exploring collaborative and content-based approaches.',
    stack: ['Python', 'Data Science Basics', 'Recommendation Algorithms'],
    status: 'Idea',
    repoUrl: 'https://github.com/raj-codelabs',
    liveDemoUrl: undefined,
    architecture:
      'Feature extraction pipeline computing cosine similarity across reader preference vectors.',
    lessonsLearned: [
      'Investigating content-based vs collaborative filtering trade-offs.',
      'Understanding dataset normalization and sparse matrix representations.',
    ],
    keyTakeaway: 'Hands-on exploration of recommendation algorithm mechanics from scratch.',
  },
];
