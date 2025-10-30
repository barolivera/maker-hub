'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Lock, Play, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getCourseById } from '@/lib/courses';
import { EnrollmentModal } from '@/components/EnrollmentModal';
import { useApp } from '@/contexts/AppContext';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { enrolledCourses } = useApp();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const course = getCourseById(params.id as string);
  const isEnrolled = enrolledCourses.includes(params.id as string);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Course not found</h1>
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

  const difficultyColors = {
    Beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    Intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const handleEnrollSuccess = () => {
    router.push(`/learn/${course.id}/lesson-1`);
  };

  return (
    <>
      <div className="min-h-screen">
        <div
          className="h-80 w-full relative"
          style={{
            background: course.coverImage,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 -mt-40 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {course.title}
                </h1>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-gray-800">
                    <AvatarFallback className="bg-teal-500 text-white font-semibold">
                      {course.creator.slice(1, 3).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{course.creator}</p>
                    <p className="text-sm text-gray-400">{course.creatorBio}</p>
                  </div>
                </div>
              </div>

              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  About This Course
                </h2>
                <div className="text-gray-400 space-y-4 whitespace-pre-line leading-relaxed">
                  {course.description}
                </div>
              </Card>

              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  What You&apos;ll Learn
                </h2>
                <ul className="space-y-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-gray-900 border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Course Curriculum
                </h2>
                <div className="space-y-3">
                  {course.curriculum.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold text-white">
                          {lesson.number}
                        </div>
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {lesson.title}
                            {lesson.isFree && (
                              <Badge className="bg-teal-500/10 text-teal-500 border-teal-500/20 text-xs">
                                FREE PREVIEW
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-gray-400">{lesson.duration}</p>
                        </div>
                      </div>
                      {lesson.isFree ? (
                        <Play className="h-5 w-5 text-teal-500" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <Card className="bg-gray-900 border-gray-800 p-6 space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-teal-500 mb-2">
                      ${course.price} USDC
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollments} students enrolled</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={`${difficultyColors[course.difficulty]} border`}
                    >
                      {course.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-gray-700 text-gray-400">
                      {course.curriculum.length} Lessons
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {!isEnrolled ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full border-gray-800 hover:bg-gray-800"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Preview First Lesson
                        </Button>
                        <Button
                          onClick={() => setEnrollModalOpen(true)}
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg py-6"
                        >
                          Enroll Now
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => router.push(`/learn/${course.id}/lesson-1`)}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg py-6"
                      >
                        Continue Learning
                      </Button>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-sm font-semibold text-white mb-3">
                      This course includes:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        <span>Lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        <span>NFT certificate on completion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        <span>Project files included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        <span>Community access</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EnrollmentModal
        open={enrollModalOpen}
        onOpenChange={setEnrollModalOpen}
        courseTitle={course.title}
        coursePrice={course.price}
        courseId={course.id}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </>
  );
}
