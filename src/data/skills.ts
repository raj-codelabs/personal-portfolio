import { SkillCategory } from '../types';

export const skillsData: SkillCategory[] = [
  {
    category: 'Core Programming & Systems',
    kicker: 'Languages & Low-Level Mechanics',
    description: 'Direct memory handling, structured programming, and typed scripting.',
    skills: [
      { name: 'C (C11)', level: 'Core Fluency', focusArea: 'Pointers, Dynamic Memory, POSIX APIs, Bitwise Ops' },
      { name: 'Python 3', level: 'Core Fluency', focusArea: 'Object-Oriented, Generators, Scripting, Scientific Stack' },
      { name: 'C++', level: 'Active Exploration', focusArea: 'OOP, STL Containers, RAII, References' },
      { name: 'TypeScript', level: 'Foundations', focusArea: 'Type Systems, Strict Mode, Web Prototyping' },
      { name: 'Bash / Shell', level: 'Core Fluency', focusArea: 'Piping, Text Processing (awk, sed, grep), Automation' },
    ],
  },
  {
    category: 'AI / ML & Mathematical Foundations',
    kicker: 'Theory & Empirical Experimentation',
    description: 'First-principles linear algebra, optimization, and baseline deep learning.',
    skills: [
      { name: 'NumPy', level: 'Core Fluency', focusArea: 'Vectorization, Broadcasting, Matrix Calculus' },
      { name: 'PyTorch Basics', level: 'Active Exploration', focusArea: 'Tensors, Autograd, Dataset Loaders, CNNs' },
      { name: 'Linear Algebra for ML', level: 'Core Fluency', focusArea: 'Eigendecomposition, SVD, Vector Projections' },
      { name: 'Multivariate Calculus', level: 'Core Fluency', focusArea: 'Partial Derivatives, Jacobians, Gradient Descent' },
      { name: 'Discrete Mathematics', level: 'Core Fluency', focusArea: 'Graph Theory, Combinatorics, Induction, Logic' },
    ],
  },
  {
    category: 'Developer Tooling & Workflows',
    kicker: 'Engineering Discipline & Debugging',
    description: 'Tools for inspecting state, isolating defects, and maintaining clean repos.',
    skills: [
      { name: 'Git & GitHub', level: 'Core Fluency', focusArea: 'Branching, Rebase, Bisect, Clear Commit Hygiene' },
      { name: 'Linux / Unix CLI', level: 'Core Fluency', focusArea: 'System Calls, Filesystem Invariants, Tmux' },
      { name: 'GDB & Valgrind', level: 'Active Exploration', focusArea: 'Stack Traces, Memory Leak Identification' },
      { name: 'Makefile & Build Systems', level: 'Foundations', focusArea: 'Target Dependencies, Compiler Flags (-Wall, -Wextra)' },
      { name: 'LaTeX & Markdown', level: 'Core Fluency', focusArea: 'Formal Engineering Reports & Proof Documentation' },
    ],
  },
];
