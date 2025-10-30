import { Course } from './courses';
import { LessonContent } from './lessons';

export type PaymentModel = 'free' | 'upfront' | 'deferred';

export interface CreatorCourseData {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  paymentModel: PaymentModel;
  paymentToken?: string;
  escrowId?: number;
  coverImageUrl: string;
  creator: string;
  creatorBio: string;
  learningOutcomes: string[];
  lessons: CreatorLesson[];
  createdAt: string;
  published: boolean;
  featured?: boolean;
  enableReviews?: boolean;
  creatorAddress: string;
}

export interface CreatorLesson {
  id: string;
  number: number;
  title: string;
  contentType: 'video' | 'text' | 'mixed';
  videoUrl?: string;
  textContent?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  duration: number;
  isFree: boolean;
}

const CREATOR_COURSES_KEY = 'makerHub_creatorCourses';

export function saveCreatorCourse(course: CreatorCourseData) {
  const courses = getCreatorCourses();
  const existingIndex = courses.findIndex(c => c.id === course.id);

  if (existingIndex >= 0) {
    courses[existingIndex] = course;
  } else {
    courses.push(course);
  }

  localStorage.setItem(CREATOR_COURSES_KEY, JSON.stringify(courses));
}

export function getCreatorCourses(): CreatorCourseData[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(CREATOR_COURSES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getCreatorCourse(id: string): CreatorCourseData | undefined {
  return getCreatorCourses().find(c => c.id === id);
}

export function deleteCreatorCourse(id: string) {
  const courses = getCreatorCourses().filter(c => c.id !== id);
  localStorage.setItem(CREATOR_COURSES_KEY, JSON.stringify(courses));
}

export function convertToPublicCourse(creatorCourse: CreatorCourseData): Course {
  return {
    id: creatorCourse.id,
    title: creatorCourse.title,
    creator: creatorCourse.creator,
    creatorBio: creatorCourse.creatorBio,
    price: creatorCourse.price,
    difficulty: creatorCourse.difficulty,
    coverImage: creatorCourse.coverImageUrl || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    enrollments: 0,
    description: creatorCourse.fullDescription,
    learningOutcomes: creatorCourse.learningOutcomes,
    curriculum: creatorCourse.lessons.map(lesson => ({
      id: lesson.id,
      number: lesson.number,
      title: lesson.title,
      duration: `${lesson.duration} min`,
      isFree: lesson.isFree,
    })),
  };
}

export function convertToLessonContent(creatorLesson: CreatorLesson, courseId: string): LessonContent {
  return {
    id: creatorLesson.id,
    courseId,
    number: creatorLesson.number,
    title: creatorLesson.title,
    duration: creatorLesson.duration,
    contentType: creatorLesson.contentType,
    videoUrl: creatorLesson.videoUrl,
    textContent: creatorLesson.textContent,
    codeSnippet: creatorLesson.codeSnippet,
    isFree: creatorLesson.isFree,
  };
}

export const COURSE_CATEGORIES = [
  'Creative Coding',
  'Web3',
  'Interactive Art',
  'Hardware',
];

export const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'solidity',
  'html',
  'css',
  'rust',
  'go',
];
