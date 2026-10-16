import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'micro-autograd-mlp',
    title: 'Micro-Autograd & Scratch MLP',
    subtitle: 'Reverse-mode automatic differentiation engine and neural network from mathematical primitives',
    problem:
      'Understanding how gradients propagate through compound mathematical operations requires looking beyond high-level framework wrappers like PyTorch or TensorFlow.',
    built:
      'Implemented a directed acyclic computation graph in pure Python with NumPy. Supports scalar and tensor backward passes, basic activation functions (ReLU, Sigmoid, Tanh), and a 2-layer MLP trained on synthetic binary classification datasets.',
    stack: ['Python', 'NumPy', 'Math / Calculus', 'pytest'],
    status: 'Completed',
    repoUrl: 'https://github.com/example-placeholder/micro-autograd-mlp',
    liveDemoUrl: undefined,
    architecture:
      'Node-based computational graph maintaining parents and forward/backward gradient closures. Forward pass computes numerical outputs; backward() topological-sorts nodes and evaluates local chain-rule derivatives.',
    lessonsLearned: [
      'Gradients must accumulate rather than overwrite when a node branches into multiple consumers.',
      'Numerical stability requires clipping inputs for exponential activations to prevent exploding or vanishing gradients.',
      'Writing test cases against PyTorch autograd outputs guarantees numerical correctness of backprop calculations.',
    ],
    keyTakeaway: 'First-principles understanding of chain rule implementation in memory.',
  },
  {
    id: 'c-allocator-sandbox',
    title: 'Block Memory Allocator',
    subtitle: 'Custom first-fit dynamic heap memory manager written in ANSI C',
    problem:
      'Standard library malloc/free hides the complexity of heap fragmentation, pointer arithmetic, and boundary tag management.',
    built:
      'Constructed a userspace heap manager on top of a simulated contiguous memory pool. Implements first-fit block allocation, header/footer boundary tags, explicit free lists, and immediate coalescing upon block free.',
    stack: ['C (C11)', 'POSIX APIs', 'GDB', 'Valgrind', 'Makefile'],
    status: 'Completed',
    repoUrl: 'https://github.com/example-placeholder/c-allocator-sandbox',
    liveDemoUrl: undefined,
    architecture:
      'Doubly linked free list embedded inside free block payloads. Each block contains an 8-byte header storing block size and allocation state bit. Coalescing examines adjacent blocks in O(1) time.',
    lessonsLearned: [
      'Byte-level alignment requirements on 64-bit systems require careful struct padding calculations.',
      'Valgrind memory traces were essential for tracking down off-by-one boundary tag corruptions.',
      'Header overhead significantly impacts efficiency for many tiny allocations.',
    ],
    keyTakeaway: 'Practical mastery of pointer arithmetic, memory layouts, and structural invariants.',
  },
  {
    id: 'cifar-baseline-pipeline',
    title: 'Vision Classifier & Augmentation Lab',
    subtitle: 'End-to-end image classification pipeline exploring regularization and learning rate schedules',
    problem:
      'Beginner machine learning projects often jump directly to pretrained vision transformers without measuring baseline convolutional behavior or analyzing overfitting.',
    built:
      'Developed a reproducible PyTorch training pipeline on CIFAR-10 comparing a 3-layer CNN against a ResNet-18 baseline. Explored data augmentations (CutMix, RandomCrop), Cosine Annealing learning rate schedules, and cross-entropy loss tracking with TensorBoard.',
    stack: ['Python', 'PyTorch', 'Torchvision', 'TensorBoard', 'Matplotlib'],
    status: 'Active Exploration',
    repoUrl: 'https://github.com/example-placeholder/cifar-baseline-pipeline',
    liveDemoUrl: undefined,
    architecture:
      'Modular Python pipeline with decoupled dataset loaders, augmentation transforms, model definition classes, and training checkpointing loops with validation metric logging.',
    lessonsLearned: [
      'Data augmentation provides substantial generalization gains without increasing model parameter counts.',
      'Learning rate warmups prevent early divergence when training with adaptive optimizers like AdamW.',
      'Documenting hyperparameter sweeps in structured YAML configurations prevents unrepeatable experiments.',
    ],
    keyTakeaway: 'Disciplined empirical methodology for training and evaluating vision baselines.',
  },
  {
    id: 'graph-algorithm-visualizer',
    title: 'Discrete Graph Algorithm Sandbox',
    subtitle: 'Interactive step-by-step state visualizer for foundational graph traversal and pathfinding',
    problem:
      'Graph algorithms (Dijkstra, BFS/DFS, Prim-Jarnik) are conceptually clear on paper but challenging to debug when visualizing state changes across priority queues and visited sets.',
    built:
      'Built a zero-dependency interactive visualizer in TypeScript. Users can construct weighted directed or undirected graphs, step forward and backward through algorithm execution states, and inspect data structure internals at each iteration.',
    stack: ['TypeScript', 'SVG', 'Tailwind CSS', 'Vite'],
    status: 'Completed',
    repoUrl: 'https://github.com/example-placeholder/graph-algorithm-visualizer',
    liveDemoUrl: undefined,
    architecture:
      'State generator yielding immutable step snapshots (visited array, current edge, priority queue state, distance array). UI renders state transitions deterministically without external canvas dependencies.',
    lessonsLearned: [
      'Generator functions (function*) provide a clean pattern for step-by-step algorithm playback without complex state machines.',
      'Separating algorithm logic from DOM rendering makes testing edge cases like disconnected graphs straightforward.',
      'Accessible SVG rendering ensures diagrams scale cleanly without pixelation across viewports.',
    ],
    keyTakeaway: 'Bridging discrete math theory with clean, deterministic frontend visualization.',
  },
  {
    id: 'terminal-markdown-cli',
    title: 'ANSI Terminal Markdown Parser',
    subtitle: 'Lightweight command-line parser that renders GitHub-flavored Markdown in pure ANSI color codes',
    problem:
      'Reading project notes and architectural documents from a Linux terminal often forces plain unformatted text or bloated dependencies.',
    built:
      'Created a focused Python CLI tool that tokenizes Markdown headings, blockquotes, code fences, and bullet lists, formatting them with native 24-bit TrueColor ANSI escape sequences.',
    stack: ['Python', 'Regular Expressions', 'ANSI Escape Codes', 'Linux Terminal'],
    status: 'Completed',
    repoUrl: 'https://github.com/example-placeholder/terminal-markdown-cli',
    liveDemoUrl: undefined,
    architecture:
      'Line-by-line lexical scanner emitting formatted tokens into a terminal buffer with window-width detection and automated text reflowing.',
    lessonsLearned: [
      'Terminal width detection requires querying ioctl / os.get_terminal_size() with safe fallbacks.',
      'Proper ANSI state resetting after formatted blocks prevents color bleeding into subsequent terminal outputs.',
    ],
    keyTakeaway: 'Low-level string parsing and console stream manipulation.',
  },
];
