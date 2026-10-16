import { Milestone } from '../types';

export const milestonesData: Milestone[] = [
  {
    id: 'm1-cse-matriculation',
    logNumber: 'LOG #01',
    commitHash: 'a71e04b',
    branch: 'main',
    branchLabel: 'curriculum/core',
    date: 'Aug 2026',
    title: 'Commenced B.Tech in CSE (Artificial Intelligence & Machine Learning)',
    summary: 'Entered undergraduate engineering program with focus on foundational computing and computational mathematics.',
    details:
      'Began core coursework covering Discrete Structures, Structured Programming in C, Linear Algebra, and Calculus. Set up dedicated Linux environment (Fedora/Ubuntu workstation) and established disciplined daily commit habits.',
    learnings: [
      'Configured terminal-first developer workflow using Neovim, Tmux, and Git command-line utilities.',
      'Studied mathematical induction, set theory, and formal logic as theoretical baselines for algorithms.',
    ],
    marginAnnotation: 'Academic matriculation & environment setup.',
    tags: ['Academics', 'Linux Workflow', 'Discrete Math'],
  },
  {
    id: 'm2-systems-c-foundations',
    logNumber: 'LOG #02',
    commitHash: 'b392df1',
    branch: 'systems',
    branchLabel: 'track/systems',
    date: 'Sep 2026',
    title: 'Systems Programming & Pointer Mechanics in C',
    summary: 'Investigated memory management, stack vs. heap allocation, and bitwise manipulation.',
    details:
      'Completed lab exercises implementing dynamic data structures (singly/doubly linked lists, hash tables, binary heaps) in ANSI C without high-level library abstractions. Diagnosed memory leaks using Valgrind and GDB.',
    learnings: [
      'Learned strict pointer arithmetic and boundary verification to avoid buffer overflows and segmentation faults.',
      'Gained deep appreciation for cache locality and memory layout impact on execution speed.',
    ],
    marginAnnotation: 'Direct memory management without GC safety nets.',
    tags: ['C Programming', 'Valgrind', 'Memory Invariants'],
  },
  {
    id: 'm3-linear-algebra-ml',
    logNumber: 'LOG #03',
    commitHash: 'c48d91a',
    branch: 'ml-core',
    branchLabel: 'track/ai-ml',
    date: 'Oct 2026',
    title: 'Mathematical Foundations for Machine Learning',
    summary: 'Deep-dive into vector spaces, eigenvalues, matrix decompositions, and multivariate calculus.',
    details:
      'Connected linear algebra concepts (dot products, projections, singular value decomposition) directly to geometric representations of data manifolds. Verified mathematical derivations by implementing vector operations from scratch in Python NumPy.',
    learnings: [
      'Represented high-dimensional feature transformations through matrix multiplication operations.',
      'Calculated gradient vectors and Jacobian matrices on multi-variable loss surfaces.',
    ],
    marginAnnotation: 'Theory-to-code translation for numerical optimization.',
    tags: ['Linear Algebra', 'NumPy', 'Optimization'],
  },
  {
    id: 'm4-c-memory-allocator',
    logNumber: 'LOG #04',
    commitHash: 'd5fe20c',
    branch: 'systems',
    branchLabel: 'track/systems',
    date: 'Nov 2026',
    title: 'Engineered First-Fit Block Memory Allocator',
    summary: 'Constructed custom userspace malloc/free simulation with block splitting and coalescing.',
    details:
      'Built a complete heap memory management simulator. Handled boundary tags, circular explicit free lists, and payload alignment. Evaluated external vs internal fragmentation under synthetic allocation workloads.',
    learnings: [
      'Mastered bitmask flags inside size fields to pack metadata into word boundaries.',
      'Understood trade-offs between first-fit search speed and best-fit memory utilization.',
    ],
    marginAnnotation: 'Milestone project: custom allocator verified clean in Valgrind.',
    tags: ['Systems', 'Heap Management', 'Data Structures'],
  },
  {
    id: 'm5-scratch-autograd-engine',
    logNumber: 'LOG #05',
    commitHash: 'e613b5e',
    branch: 'ml-core',
    branchLabel: 'track/ai-ml',
    date: 'Dec 2026',
    title: 'Micro-Autograd Engine & Backpropagation from Scratch',
    summary: 'Built scalar and tensor reverse-mode automatic differentiation graph in pure Python.',
    details:
      'Traced backward gradient propagation across computational graphs. Implemented topological sorting for DAG node ordering and verified analytical chain-rule derivatives against PyTorch autograd tensors.',
    learnings: [
      'Grasped exact mechanics of backprop: dynamic graph caching and gradient accumulation.',
      'Understood why dead neurons occur in ReLU networks and how Xavier/He initialization alleviates it.',
    ],
    marginAnnotation: 'Reverse-mode auto-differentiation verified against PyTorch.',
    tags: ['Autograd', 'Neural Networks', 'Python'],
  },
  {
    id: 'm6-open-source-semester-review',
    logNumber: 'LOG #06',
    commitHash: 'f72a984',
    branch: 'main',
    branchLabel: 'curriculum/core',
    date: 'Jan 2027',
    title: 'Semester 1 Consolidation & Open Source Engagement',
    summary: 'Merged systems insights with ML foundations; prepared codebase and open-source contributions.',
    details:
      'Reviewed Semester 1 algorithms and systems projects, cleaned up repository documentation, and began auditing open-source machine learning tooling issues. Establishing groundwork for advanced Semester 2 coursework in Computer Organization and Deep Learning.',
    learnings: [
      'Writing thorough architectural documentation and reproducible test suites is as important as the code itself.',
      'Comfortable navigating large codebases using Git log, blame, and bisect.',
    ],
    marginAnnotation: 'Consolidation of 1st-year fundamentals & research roadmap.',
    tags: ['Review', 'Open Source', 'Curriculum Merge'],
  },
];
