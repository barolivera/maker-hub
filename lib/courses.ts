export interface Course {
  id: string;
  title: string;
  creator: string;
  creatorBio: string;
  price: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  coverImage: string;
  enrollments: number;
  description: string;
  learningOutcomes: string[];
  curriculum: Lesson[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  duration: string;
  isFree: boolean;
}

export const mockCourses: Course[] = [
  {
    id: 'generative-art-p5js',
    title: 'Generative Art with p5.js',
    creator: '@artmaker',
    creatorBio: 'Digital artist and creative coder specializing in generative systems. Teaching creative coding for 5+ years.',
    price: 15,
    difficulty: 'Beginner',
    coverImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    enrollments: 342,
    description: `Learn to create stunning generative art using p5.js, a JavaScript library that makes coding accessible for artists. This beginner-friendly course will guide you through the fundamentals of creative coding, from basic shapes to complex generative systems.

You'll explore randomness, noise, and algorithms to create unique visual compositions that never repeat. By the end, you'll have a portfolio of generative art pieces and the skills to create your own NFT art collections.

No prior coding experience required—just bring your creativity and curiosity!`,
    learningOutcomes: [
      'Master p5.js fundamentals and the creative coding workflow',
      'Create dynamic animations using loops and functions',
      'Implement Perlin noise for organic, natural-looking patterns',
      'Build interactive art that responds to user input',
      'Export your creations for NFT minting and social media'
    ],
    curriculum: [
      { id: 'lesson-1', number: 1, title: 'Introduction to p5.js and Setup', duration: '12 min', isFree: true },
      { id: 'lesson-2', number: 2, title: 'Drawing Basics: Shapes and Colors', duration: '18 min', isFree: false },
      { id: 'lesson-3', number: 3, title: 'Animation and Movement', duration: '22 min', isFree: false },
      { id: 'lesson-4', number: 4, title: 'Randomness and Noise', duration: '25 min', isFree: false },
      { id: 'lesson-5', number: 5, title: 'Building Your First Generative System', duration: '30 min', isFree: false }
    ]
  },
  {
    id: 'interactive-3d-threejs',
    title: 'Interactive 3D with Three.js',
    creator: '@3dbuilder',
    creatorBio: '3D web developer with experience at leading tech companies. Creating immersive web experiences since 2018.',
    price: 25,
    difficulty: 'Intermediate',
    coverImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    enrollments: 198,
    description: `Dive into the world of 3D web experiences with Three.js. This intermediate course teaches you how to create stunning 3D graphics, animations, and interactive experiences that run directly in the browser.

You'll learn everything from basic 3D concepts to advanced techniques like shader programming and physics simulation. Build portfolio-worthy projects including an interactive product showcase and an immersive 3D game environment.

Prerequisites: Basic JavaScript knowledge and familiarity with HTML/CSS.`,
    learningOutcomes: [
      'Build 3D scenes with Three.js from scratch',
      'Implement lighting, materials, and textures',
      'Create smooth animations and camera movements',
      'Add interactivity and user controls',
      'Optimize 3D performance for web deployment'
    ],
    curriculum: [
      { id: 'lesson-1', number: 1, title: 'Three.js Fundamentals', duration: '15 min', isFree: true },
      { id: 'lesson-2', number: 2, title: 'Geometries and Materials', duration: '20 min', isFree: false },
      { id: 'lesson-3', number: 3, title: 'Lighting and Shadows', duration: '25 min', isFree: false },
      { id: 'lesson-4', number: 4, title: 'Animations and Controls', duration: '28 min', isFree: false },
      { id: 'lesson-5', number: 5, title: 'Building an Interactive 3D Scene', duration: '35 min', isFree: false }
    ]
  },
  {
    id: 'smart-contracts-101',
    title: 'Smart Contracts 101',
    creator: '@web3dev',
    creatorBio: 'Blockchain developer and educator. Built and audited smart contracts for multiple DeFi protocols.',
    price: 20,
    difficulty: 'Beginner',
    coverImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    enrollments: 521,
    description: `Start your Web3 development journey by learning to write and deploy smart contracts on Ethereum. This comprehensive beginner course covers Solidity fundamentals, development tools, and best practices for secure smart contract development.

You'll write your first smart contract, deploy it to a testnet, and learn how to interact with it from a web application. By the end, you'll understand how DeFi protocols, NFTs, and DAOs work under the hood.

Perfect for developers new to blockchain who want to build decentralized applications.`,
    learningOutcomes: [
      'Write smart contracts in Solidity',
      'Use Hardhat for development and testing',
      'Deploy contracts to Ethereum testnets',
      'Interact with contracts using web3.js',
      'Understand gas optimization and security basics'
    ],
    curriculum: [
      { id: 'lesson-1', number: 1, title: 'Blockchain and Smart Contract Basics', duration: '14 min', isFree: true },
      { id: 'lesson-2', number: 2, title: 'Solidity Fundamentals', duration: '22 min', isFree: false },
      { id: 'lesson-3', number: 3, title: 'Writing Your First Contract', duration: '26 min', isFree: false },
      { id: 'lesson-4', number: 4, title: 'Testing and Deployment', duration: '24 min', isFree: false },
      { id: 'lesson-5', number: 5, title: 'Building a Web3 Frontend', duration: '30 min', isFree: false }
    ]
  },
  {
    id: 'creative-coding-fundamentals',
    title: 'Creative Coding Fundamentals',
    creator: '@codecrafter',
    creatorBio: 'Artist and educator bridging the gap between code and creativity. Workshop facilitator at art institutions worldwide.',
    price: 18,
    difficulty: 'Beginner',
    coverImage: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    enrollments: 287,
    description: `Discover the joy of creative coding in this foundational course designed for artists, designers, and curious beginners. Learn to use code as a creative medium to generate art, animations, and interactive experiences.

This course focuses on core programming concepts through fun, visual projects. You'll learn by creating, building a strong foundation that applies to any creative coding environment.

No coding experience required—designed specifically for creative minds exploring code for the first time.`,
    learningOutcomes: [
      'Understand fundamental programming concepts visually',
      'Create generative patterns and compositions',
      'Build interactive art projects',
      'Develop computational thinking skills',
      'Prepare for advanced creative coding courses'
    ],
    curriculum: [
      { id: 'lesson-1', number: 1, title: 'What is Creative Coding?', duration: '10 min', isFree: true },
      { id: 'lesson-2', number: 2, title: 'Variables and Drawing', duration: '18 min', isFree: false },
      { id: 'lesson-3', number: 3, title: 'Loops and Patterns', duration: '20 min', isFree: false },
      { id: 'lesson-4', number: 4, title: 'Functions and Randomness', duration: '22 min', isFree: false },
      { id: 'lesson-5', number: 5, title: 'Interactive Project', duration: '25 min', isFree: false }
    ]
  },
  {
    id: 'webgl-shaders-masterclass',
    title: 'WebGL Shaders Masterclass',
    creator: '@shaderqueen',
    creatorBio: 'Graphics programmer specializing in real-time rendering. Creating stunning visual effects for web and games.',
    price: 30,
    difficulty: 'Advanced',
    coverImage: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    enrollments: 142,
    description: `Master the art of GPU programming with WebGL shaders. This advanced course dives deep into GLSL, teaching you to create stunning visual effects, procedural textures, and high-performance graphics that run directly on the GPU.

You'll learn the mathematics behind beautiful shaders, from signed distance functions to ray marching and physically-based rendering. Build a portfolio of mesmerizing shader effects suitable for games, interactive art, and cutting-edge web experiences.

Prerequisites: Strong JavaScript knowledge and comfort with mathematical concepts.`,
    learningOutcomes: [
      'Write complex vertex and fragment shaders',
      'Implement advanced visual effects and post-processing',
      'Create procedural textures and patterns',
      'Understand GPU architecture and optimization',
      'Build a shader library for your projects'
    ],
    curriculum: [
      { id: 'lesson-1', number: 1, title: 'GLSL and Shader Basics', duration: '16 min', isFree: true },
      { id: 'lesson-2', number: 2, title: 'Signed Distance Functions', duration: '28 min', isFree: false },
      { id: 'lesson-3', number: 3, title: 'Procedural Textures', duration: '32 min', isFree: false },
      { id: 'lesson-4', number: 4, title: 'Ray Marching', duration: '35 min', isFree: false },
      { id: 'lesson-5', number: 5, title: 'Advanced Effects and Optimization', duration: '40 min', isFree: false }
    ]
  },
  {
    id: 'nft-art-metadata',
    title: 'NFT Art & Metadata',
    creator: '@nftartist',
    creatorBio: 'Digital artist and NFT creator with collections on major platforms. Helping artists navigate Web3 since 2021.',
    price: 22,
    difficulty: 'Intermediate',
    coverImage: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    enrollments: 234,
    description: `Learn everything you need to create, launch, and manage your own NFT art collection. This course covers both the creative and technical aspects of NFT creation, from generating artwork to writing smart contracts and setting up metadata.

You'll understand different NFT standards, learn to use IPFS for decentralized storage, and discover best practices for launching a successful collection. Perfect for artists ready to enter the Web3 space with confidence.

Prerequisites: Basic understanding of blockchain and digital art creation tools.`,
    learningOutcomes: [
      'Understand NFT standards (ERC-721, ERC-1155)',
      'Prepare artwork and metadata for minting',
      'Use IPFS for decentralized storage',
      'Write and deploy NFT smart contracts',
      'Launch and market your NFT collection'
    ],
    curriculum: [
      { id: 'lesson-1', number: 1, title: 'NFT Fundamentals', duration: '14 min', isFree: true },
      { id: 'lesson-2', number: 2, title: 'Creating NFT Artwork', duration: '20 min', isFree: false },
      { id: 'lesson-3', number: 3, title: 'Metadata and IPFS', duration: '24 min', isFree: false },
      { id: 'lesson-4', number: 4, title: 'Smart Contract Setup', duration: '26 min', isFree: false },
      { id: 'lesson-5', number: 5, title: 'Launching Your Collection', duration: '28 min', isFree: false }
    ]
  }
];

export function getCourseById(id: string): Course | undefined {
  return mockCourses.find(course => course.id === id);
}
