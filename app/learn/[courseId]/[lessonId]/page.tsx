'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Lock, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getCourseById } from '@/lib/courses';
import { getLessonContent, getAllLessonsForCourse } from '@/lib/lessons';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { completedLessons, markLessonComplete, enrolledCourses, isCourseCompleted, mintCertificate, certificates } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const course = getCourseById(courseId);
  const lesson = getLessonContent(courseId, lessonId);
  const allLessons = getAllLessonsForCourse(courseId);

  const isEnrolled = enrolledCourses.includes(courseId);
  const completedLessonIds = completedLessons[courseId] || [];
  const isLessonCompleted = completedLessonIds.includes(lessonId);

  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;
  const isLastLesson = currentLessonIndex === allLessons.length - 1;

  const progressPercentage = (completedLessonIds.length / allLessons.length) * 100;

  useEffect(() => {
    if (!isEnrolled && !lesson?.isFree) {
      router.push(`/course/${courseId}`);
    }
  }, [isEnrolled, lesson, courseId, router]);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Lesson not found</h1>
          <Button
            onClick={() => router.push('/')}
            className="mt-4 bg-teal-500 hover:bg-teal-600"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (isLessonCompleted) return;

    markLessonComplete(courseId, lessonId);
    toast.success('Lesson completed! ✓');

    if (isLastLesson && isCourseCompleted(courseId, allLessons.length)) {
      setTimeout(() => {
        setShowConfetti(true);
        setShowCompletionModal(true);
      }, 500);
    } else if (hasNext) {
      setTimeout(() => {
        const nextLesson = allLessons[currentLessonIndex + 1];
        router.push(`/learn/${courseId}/${nextLesson.id}`);
      }, 1000);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      router.push(`/learn/${courseId}/${prevLesson.id}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      router.push(`/learn/${courseId}/${nextLesson.id}`);
    }
  };

  const handleMintCertificate = () => {
    setIsMinting(true);
    setTimeout(() => {
      mintCertificate(courseId);
      setIsMinting(false);
      toast.success('Certificate minted! 🎊');
      setTimeout(() => {
        router.push(`/certificate/${courseId}`);
      }, 1500);
    }, 2000);
  };

  const hasCertificate = certificates.some(cert => cert.courseId === courseId);

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="flex h-screen overflow-hidden bg-gray-950">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed lg:relative lg:translate-x-0 z-30 w-80 h-full bg-gray-900 border-r border-gray-800 transition-transform duration-300 flex flex-col`}
        >
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white mb-1">{course.title}</h2>
            <p className="text-sm text-gray-400">{course.creator}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {allLessons.map((l) => {
                const isCompleted = completedLessonIds.includes(l.id);
                const isCurrent = l.id === lessonId;
                const isLocked = !l.isFree && !isEnrolled;

                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      if (!isLocked) {
                        router.push(`/learn/${courseId}/${l.id}`);
                      }
                    }}
                    disabled={isLocked}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-teal-500/10 border-l-2 border-teal-500'
                        : 'hover:bg-gray-800'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-teal-500" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5 text-gray-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isCurrent ? 'text-teal-500' : 'text-white'}`}>
                          {l.number}. {l.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{l.duration} min</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="w-full border-gray-800 hover:bg-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-20 bg-gray-950 border-b border-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden text-white"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <span className="text-sm text-gray-400">
                    Lesson {lesson.number} of {allLessons.length}
                  </span>
                </div>
                <span className="text-sm font-semibold text-teal-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
              <p className="text-gray-400">{lesson.duration} minutes</p>
            </div>

            {(lesson.contentType === 'video' || lesson.contentType === 'mixed') && lesson.videoUrl && (
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <ReactPlayer
                  url={lesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls={true}
                />
              </div>
            )}

            {lesson.textContent && (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {lesson.textContent}
                </ReactMarkdown>
              </div>
            )}

            {lesson.codeSnippet && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Code Example</h3>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language="javascript"
                  PreTag="div"
                  customStyle={{ borderRadius: '0.5rem' }}
                >
                  {lesson.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t border-gray-800">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={!hasPrevious}
                className="border-gray-800 hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleMarkComplete}
                disabled={isLessonCompleted}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8"
              >
                {isLessonCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  'Mark as Complete'
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleNext}
                disabled={!hasNext}
                className="border-gray-800 hover:bg-gray-800"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>

      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Course Complete!</h2>
            <p className="text-gray-400 mb-6">
              Congratulations on finishing <span className="text-white font-semibold">{course.title}</span>
            </p>
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-teal-500">
                Your payment of ${course.price} USDC has been released to the creator
              </p>
            </div>
            <div className="space-y-3">
              {!hasCertificate && (
                <Button
                  onClick={handleMintCertificate}
                  disabled={isMinting}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                >
                  {isMinting ? 'Minting your NFT certificate...' : 'Claim Your Certificate NFT'}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="w-full border-gray-800 hover:bg-gray-800"
              >
                Back to My Courses
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
