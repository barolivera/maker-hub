'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { getCourseById } from '@/lib/courses';
import { getAllLessonsForCourse } from '@/lib/lessons';

export default function DashboardPage() {
  const router = useRouter();
  const { isWalletConnected, enrolledCourses, completedLessons, certificates } = useApp();

  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
    }
  }, [isWalletConnected, router]);

  if (!isWalletConnected) {
    return null;
  }

  const enrolledCoursesData = enrolledCourses.map((courseId) => {
    const course = getCourseById(courseId);
    const lessons = getAllLessonsForCourse(courseId);
    const completed = completedLessons[courseId] || [];
    const progress = (completed.length / lessons.length) * 100;
    return {
      course,
      lessons,
      completed,
      progress,
      isCompleted: completed.length === lessons.length,
    };
  }).filter(data => data.course !== undefined);

  const activeCourses = enrolledCoursesData.filter(data => !data.isCompleted);
  const completedCourses = enrolledCoursesData.filter(data => data.isCompleted);

  const continueLearningSuggestion = activeCourses.sort((a, b) => b.progress - a.progress)[0];

  const stats = {
    active: activeCourses.length,
    completed: completedCourses.length,
    points: completedCourses.length * 50,
  };

  const getNextLesson = (courseId: string, completedLessonIds: string[]) => {
    const lessons = getAllLessonsForCourse(courseId);
    const nextLesson = lessons.find(lesson => !completedLessonIds.includes(lesson.id));
    return nextLesson || lessons[lessons.length - 1];
  };

  const getCertificateDate = (courseId: string) => {
    const cert = certificates.find(c => c.courseId === courseId);
    if (!cert) return null;
    return new Date(cert.mintedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">My Learning</h1>
          <p className="text-gray-400 mt-2">Track your progress and continue your journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-teal-500/10 p-3">
                <BookOpen className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
                <p className="text-sm text-gray-400">Active Courses</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-teal-500/10 p-3">
                <Award className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.completed}</p>
                <p className="text-sm text-gray-400">Completed Courses</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-teal-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.points}</p>
                <p className="text-sm text-gray-400">Points Earned</p>
              </div>
            </div>
          </Card>
        </div>

        {continueLearningSuggestion && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Continue Learning</h2>
            <Card className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div
                  className="w-full md:w-80 h-48 md:h-auto"
                  style={{ background: continueLearningSuggestion.course?.coverImage }}
                />
                <div className="flex-1 p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {continueLearningSuggestion.course?.title}
                    </h3>
                    <p className="text-gray-400">
                      {continueLearningSuggestion.course?.creator}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {continueLearningSuggestion.completed.length} of{' '}
                        {continueLearningSuggestion.lessons.length} lessons complete
                      </span>
                      <span className="text-sm font-semibold text-teal-500">
                        {Math.round(continueLearningSuggestion.progress)}%
                      </span>
                    </div>
                    <Progress value={continueLearningSuggestion.progress} className="h-2" />
                  </div>
                  <Button
                    onClick={() => {
                      const nextLesson = getNextLesson(
                        continueLearningSuggestion.course!.id,
                        continueLearningSuggestion.completed
                      );
                      router.push(
                        `/learn/${continueLearningSuggestion.course!.id}/${nextLesson.id}`
                      );
                    }}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    Resume at Lesson {continueLearningSuggestion.completed.length + 1}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">My Courses</h2>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-gray-900 border-gray-800">
              <TabsTrigger value="active">Active ({activeCourses.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {activeCourses.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800 p-12 text-center">
                  <p className="text-gray-400 mb-4">No active courses yet</p>
                  <Button
                    onClick={() => router.push('/')}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    Browse Courses
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeCourses.map((data) => {
                    const nextLesson = getNextLesson(data.course!.id, data.completed);
                    return (
                      <Card
                        key={data.course!.id}
                        className="bg-gray-900 border-gray-800 overflow-hidden hover:border-teal-500 transition-colors"
                      >
                        <div
                          className="h-48 w-full"
                          style={{ background: data.course!.coverImage }}
                        />
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">
                              {data.course!.title}
                            </h3>
                            <p className="text-sm text-gray-400">{data.course!.creator}</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">
                                {data.completed.length}/{data.lessons.length} lessons
                              </span>
                              <span className="text-xs font-semibold text-teal-500">
                                {Math.round(data.progress)}%
                              </span>
                            </div>
                            <Progress value={data.progress} className="h-1.5" />
                          </div>
                          <Button
                            onClick={() =>
                              router.push(`/learn/${data.course!.id}/${nextLesson.id}`)
                            }
                            className="w-full bg-teal-500 hover:bg-teal-600"
                          >
                            Continue
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedCourses.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800 p-12 text-center">
                  <p className="text-gray-400">No completed courses yet</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((data) => {
                    const completionDate = getCertificateDate(data.course!.id);
                    const hasCert = certificates.some(c => c.courseId === data.course!.id);
                    return (
                      <Card
                        key={data.course!.id}
                        className="bg-gray-900 border-gray-800 overflow-hidden"
                      >
                        <div
                          className="h-48 w-full relative"
                          style={{ background: data.course!.coverImage }}
                        >
                          <Badge className="absolute top-4 right-4 bg-teal-500 text-white border-none">
                            Completed
                          </Badge>
                        </div>
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">
                              {data.course!.title}
                            </h3>
                            <p className="text-sm text-gray-400">{data.course!.creator}</p>
                            {completionDate && (
                              <p className="text-xs text-gray-500 mt-2">
                                Completed on {completionDate}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            {hasCert && (
                              <Button
                                onClick={() => router.push(`/certificate/${data.course!.id}`)}
                                variant="outline"
                                className="w-full border-gray-800 hover:bg-gray-800"
                              >
                                View Certificate
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="w-full border-gray-800 hover:bg-gray-800"
                            >
                              Review Course
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
