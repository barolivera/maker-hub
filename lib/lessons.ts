export interface LessonContent {
  id: string;
  courseId: string;
  number: number;
  title: string;
  duration: number;
  contentType: 'video' | 'text' | 'mixed';
  videoUrl?: string;
  textContent?: string;
  codeSnippet?: string;
  isFree: boolean;
}

export const lessonContentMap: Record<string, LessonContent[]> = {
  'generative-art-p5js': [
    {
      id: 'lesson-1',
      courseId: 'generative-art-p5js',
      number: 1,
      title: 'Introduction to p5.js and Setup',
      duration: 12,
      contentType: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=HerCR8bw_GE',
      textContent: `Welcome to Generative Art with p5.js! In this lesson, you'll learn what p5.js is and how to set up your creative coding environment.

## What is p5.js?

p5.js is a JavaScript library that makes coding accessible for artists, designers, educators, and beginners. It's a reimagining of Processing for the web.

## Getting Started

We'll use the p5.js web editor, which provides everything you need to start coding right away—no installation required!`,
      isFree: true,
    },
    {
      id: 'lesson-2',
      courseId: 'generative-art-p5js',
      number: 2,
      title: 'Drawing Basics: Shapes and Colors',
      duration: 18,
      contentType: 'text',
      textContent: `# Drawing Shapes in p5.js

Let's explore the fundamental drawing functions in p5.js. Every visual element starts with basic shapes.

## The Canvas

First, we create a canvas using the \`createCanvas()\` function:

\`\`\`javascript
function setup() {
  createCanvas(800, 600);
}
\`\`\`

## Basic Shapes

- **Rectangle**: \`rect(x, y, width, height)\`
- **Circle**: \`circle(x, y, diameter)\`
- **Ellipse**: \`ellipse(x, y, width, height)\`
- **Line**: \`line(x1, y1, x2, y2)\`

## Adding Color

Use \`fill()\` to set the fill color and \`stroke()\` for the outline:

\`\`\`javascript
fill(255, 0, 0); // Red fill
stroke(0, 255, 0); // Green outline
rect(100, 100, 200, 150);
\`\`\`

## Try It Yourself

Create a simple composition using different shapes and colors. Experiment with layering shapes to create depth!`,
      codeSnippet: `function setup() {
  createCanvas(800, 600);
  background(220);
}

function draw() {
  fill(255, 100, 100);
  circle(400, 300, 200);

  fill(100, 100, 255);
  rect(300, 200, 200, 200);
}`,
      isFree: false,
    },
    {
      id: 'lesson-3',
      courseId: 'generative-art-p5js',
      number: 3,
      title: 'Animation and Movement',
      duration: 22,
      contentType: 'mixed',
      videoUrl: 'https://www.youtube.com/watch?v=MLtAMg9_Svw',
      textContent: `# Creating Animation with p5.js

Animation in p5.js is achieved through the \`draw()\` function, which runs continuously in a loop.

## The Animation Loop

The \`draw()\` function is called 60 times per second by default. By changing values each frame, we create the illusion of movement.

## Using Variables

\`\`\`javascript
let x = 0;

function draw() {
  background(220);
  circle(x, 200, 50);
  x = x + 2; // Move right by 2 pixels each frame
}
\`\`\`

## Wrapping Around

Make objects wrap around the screen when they reach the edge:

\`\`\`javascript
if (x > width) {
  x = 0;
}
\`\`\``,
      codeSnippet: `let x = 0;
let y = 300;
let speed = 3;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220, 220, 240);

  fill(255, 150, 0);
  circle(x, y, 60);

  x = x + speed;

  if (x > width) {
    x = 0;
  }
}`,
      isFree: false,
    },
    {
      id: 'lesson-4',
      courseId: 'generative-art-p5js',
      number: 4,
      title: 'Randomness and Noise',
      duration: 25,
      contentType: 'text',
      textContent: `# Randomness and Perlin Noise

Randomness is a powerful tool in generative art. p5.js provides two main approaches: \`random()\` and \`noise()\`.

## Random Values

The \`random()\` function generates unpredictable values:

\`\`\`javascript
let x = random(width);  // Random x position
let size = random(20, 100);  // Random size between 20-100
\`\`\`

## Perlin Noise

\`noise()\` generates smooth, organic-looking random values:

\`\`\`javascript
let t = 0;

function draw() {
  let x = noise(t) * width;
  circle(x, height/2, 50);
  t = t + 0.01;
}
\`\`\`

Noise creates natural-looking movement and patterns, perfect for:
- Organic shapes
- Terrain generation
- Flowing animations
- Natural phenomena simulation

## Combining Both

Use \`random()\` for variety and \`noise()\` for smoothness in your generative systems.`,
      codeSnippet: `let particles = [];

function setup() {
  createCanvas(800, 600);
  background(0);

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      t: random(1000)
    });
  }
}

function draw() {
  background(0, 10);

  for (let p of particles) {
    let x = p.x + noise(p.t) * 10 - 5;
    let y = p.y + noise(p.t + 100) * 10 - 5;

    fill(100, 150, 255, 150);
    noStroke();
    circle(x, y, p.size);

    p.t += 0.01;
  }
}`,
      isFree: false,
    },
    {
      id: 'lesson-5',
      courseId: 'generative-art-p5js',
      number: 5,
      title: 'Building Your First Generative System',
      duration: 30,
      contentType: 'mixed',
      videoUrl: 'https://www.youtube.com/watch?v=c3TeLi6Ns1E',
      textContent: `# Final Project: Your Generative Art System

It's time to combine everything you've learned into a complete generative art piece!

## Project Guidelines

Create a generative system that:
1. Uses multiple shapes
2. Incorporates color variation
3. Has animated elements
4. Uses randomness or noise
5. Creates unique output each time

## Example Project Ideas

- Particle system with flowing movement
- Abstract landscape generator
- Geometric pattern maker
- Interactive visual music
- Organic growth simulation

## Tips for Success

- Start simple and iterate
- Experiment with parameters
- Use \`console.log()\` to debug
- Save interesting variations
- Have fun and be creative!

## Exporting Your Art

Save a frame as an image:
\`\`\`javascript
function mousePressed() {
  save('my-art.png');
}
\`\`\``,
      codeSnippet: `// Final Project Example
let system = [];

function setup() {
  createCanvas(800, 800);
  background(10, 10, 30);

  for (let i = 0; i < 50; i++) {
    system.push({
      x: width/2,
      y: height/2,
      vx: random(-2, 2),
      vy: random(-2, 2),
      hue: random(360),
      life: 255
    });
  }
}

function draw() {
  background(10, 10, 30, 25);

  for (let i = system.length - 1; i >= 0; i--) {
    let p = system[i];

    colorMode(HSB);
    fill(p.hue, 80, 90, p.life);
    noStroke();
    circle(p.x, p.y, 20);

    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    if (p.life < 0) {
      system.splice(i, 1);
    }
  }

  if (frameCount % 3 === 0) {
    system.push({
      x: width/2,
      y: height/2,
      vx: random(-2, 2),
      vy: random(-2, 2),
      hue: random(360),
      life: 255
    });
  }
}`,
      isFree: false,
    },
  ],
  'smart-contracts-101': [
    {
      id: 'lesson-1',
      courseId: 'smart-contracts-101',
      number: 1,
      title: 'Blockchain and Smart Contract Basics',
      duration: 14,
      contentType: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=M576WGiDBdQ',
      textContent: `Welcome to Smart Contracts 101! In this lesson, we'll cover the fundamentals of blockchain technology and smart contracts.

## What is a Blockchain?

A blockchain is a distributed ledger that records transactions across many computers. Once recorded, the data cannot be altered retroactively.

## What are Smart Contracts?

Smart contracts are self-executing programs stored on the blockchain. They automatically execute when predetermined conditions are met.`,
      isFree: true,
    },
    {
      id: 'lesson-2',
      courseId: 'smart-contracts-101',
      number: 2,
      title: 'Solidity Fundamentals',
      duration: 22,
      contentType: 'text',
      textContent: `# Introduction to Solidity

Solidity is the primary language for writing smart contracts on Ethereum and compatible blockchains.

## Basic Contract Structure

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyFirstContract {
    string public message;

    constructor(string memory _message) {
        message = _message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }
}
\`\`\`

## Key Concepts

- **State Variables**: Stored permanently on the blockchain
- **Functions**: Execute contract logic
- **Visibility**: public, private, internal, external
- **Data Types**: uint, string, bool, address, etc.`,
      codeSnippet: `pragma solidity ^0.8.0;

contract Counter {
    uint public count;

    function increment() public {
        count += 1;
    }

    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count -= 1;
    }
}`,
      isFree: false,
    },
    {
      id: 'lesson-3',
      courseId: 'smart-contracts-101',
      number: 3,
      title: 'Writing Your First Contract',
      duration: 26,
      contentType: 'mixed',
      videoUrl: 'https://www.youtube.com/watch?v=gyMwXuJrbJQ',
      textContent: `# Building a Simple Storage Contract

Let's create a contract that stores and retrieves data on the blockchain.

## The Storage Contract

This contract will allow users to store a number and retrieve it later.

## Adding Events

Events allow the blockchain to log important state changes:

\`\`\`solidity
event ValueStored(uint newValue);

function store(uint _value) public {
    value = _value;
    emit ValueStored(_value);
}
\`\`\``,
      isFree: false,
    },
    {
      id: 'lesson-4',
      courseId: 'smart-contracts-101',
      number: 4,
      title: 'Testing and Deployment',
      duration: 24,
      contentType: 'text',
      textContent: `# Testing Smart Contracts with Hardhat

Testing is crucial in smart contract development. A bug can mean lost funds!

## Setting Up Tests

\`\`\`javascript
const { expect } = require("chai");

describe("Counter", function () {
  it("Should increment count", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();

    await counter.increment();
    expect(await counter.count()).to.equal(1);
  });
});
\`\`\`

## Deploying to Testnet

1. Get test ETH from a faucet
2. Configure Hardhat with network details
3. Run deployment script
4. Verify your contract on Etherscan`,
      isFree: false,
    },
    {
      id: 'lesson-5',
      courseId: 'smart-contracts-101',
      number: 5,
      title: 'Building a Web3 Frontend',
      duration: 30,
      contentType: 'text',
      textContent: `# Connecting Your DApp to the Frontend

Learn to interact with your smart contract from a web application using ethers.js.

## Installing ethers.js

\`\`\`bash
npm install ethers
\`\`\`

## Connecting to MetaMask

\`\`\`javascript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
\`\`\`

## Calling Contract Functions

\`\`\`javascript
const contract = new ethers.Contract(address, abi, signer);

// Read
const count = await contract.count();

// Write
const tx = await contract.increment();
await tx.wait(); // Wait for transaction to be mined
\`\`\`

## Congratulations!

You now have the skills to build complete Web3 applications!`,
      codeSnippet: `import { ethers } from 'ethers';

async function connectContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contractAddress = "0x...";
  const abi = [...];

  const contract = new ethers.Contract(
    contractAddress,
    abi,
    signer
  );

  return contract;
}`,
      isFree: false,
    },
  ],
};

export function getLessonContent(courseId: string, lessonId: string): LessonContent | undefined {
  const courseLessons = lessonContentMap[courseId];
  if (!courseLessons) return undefined;
  return courseLessons.find(lesson => lesson.id === lessonId);
}

export function getAllLessonsForCourse(courseId: string): LessonContent[] {
  return lessonContentMap[courseId] || [];
}
