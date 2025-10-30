'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Eye, Users, Award, DollarSign, Clock, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export default function CourseAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { isWalletConnected, publishedCourses, enrolledCourses } = useApp();

  const [course, setCourse] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
      return;
    }

    const foundCourse = publishedCourses.find((c) => c.id === courseId);
    if (!foundCourse) {
      router.push('/creator');
      return;
    }

    setCourse(foundCourse);

    const enrollments = enrolledCourses.filter((e) => e.courseId === courseId);
    const completions = enrollments.filter((e) => e.progress === 100);
    const views = enrollments.length + Math.floor(Math.random() * 10) + 10;
    const earned = completions.length * foundCourse.price * 0.85;

    const lessonPerformance = foundCourse.lessons.map((lesson: any, index: number) => {
      const lessonCompletions = enrollments.filter(
        (e) => e.completedLessons.includes(lesson.id)
      ).length;
      const completionRate =
        enrollments.length > 0 ? (lessonCompletions / enrollments.length) * 100 : 0;

      return {
        lessonNumber: lesson.number,
        title: lesson.title,
        completionRate: Math.round(completionRate),
      };
    });

    const recentEnrollments = enrollments
      .slice(-5)
      .reverse()
      .map((e) => ({
        address: e.studentAddress,
        daysAgo: Math.floor(Math.random() * 14) + 1,
      }));

    setAnalytics({
      views,
      enrollments: enrollments.length,
      completions: completions.length,
      completionRate:
        enrollments.length > 0
          ? Math.round((completions.length / enrollments.length) * 100)
          : 0,
      earned,
      lessonPerformance,
      recentEnrollments,
    });
  }, [isWalletConnected, courseId, publishedCourses, enrolledCourses, router]);

  if (!isWalletConnected || !course || !analytics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/creator')}
            className="mb-4 border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-white mb-2">Course Analytics</h1>
          <p className="text-gray-400">{course.title}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <span className="text-gray-400 text-sm">Views</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.views}</p>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-teal-500" />
                <span className="text-gray-400 text-sm">Enrollments</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.enrollments}</p>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="text-gray-400 text-sm">Completion</span>
              </div>
              <p className="text-3xl font-bold text-white">{analytics.completionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.completions} students
              </p>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-gray-400 text-sm">Earned</span>
              </div>
              <p className="text-3xl font-bold text-white">
                ${analytics.earned.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">USDC</p>
            </Card>
          </div>
        </div>

        {analytics.recentEnrollments.length > 0 && (
          <Card className="bg-gray-900 border-gray-800 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Recent Enrollments</h3>
            <div className="space-y-3">
              {analytics.recentEnrollments.map((enrollment: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-teal-500" />
                    </div>
                    <span className="text-white font-mono text-sm">
                      {enrollment.address.slice(0, 6)}...{enrollment.address.slice(-4)}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {enrollment.daysAgo} {enrollment.daysAgo === 1 ? 'day' : 'days'} ago
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="bg-gray-900 border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Lesson Performance</h3>
          <p className="text-sm text-gray-400 mb-6">
            Track which lessons students complete and identify drop-off points
          </p>
          <div className="space-y-3">
            {analytics.lessonPerformance.map((lesson: any) => (
              <div key={lesson.lessonNumber} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-semibold">
                      {lesson.lessonNumber}.
                    </span>
                    <span className="text-white">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      {lesson.completionRate}%
                    </span>
                    {lesson.completionRate < 70 && (
                      <TrendingDown className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      lesson.completionRate >= 70
                        ? 'bg-teal-500'
                        : lesson.completionRate >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${lesson.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {analytics.lessonPerformance.some((l: any) => l.completionRate < 70) && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-amber-500 font-semibold mb-1">
                    Drop-off Detected
                  </h4>
                  <p className="text-sm text-gray-400">
                    Some lessons have lower completion rates. Consider reviewing
                    content difficulty or length to improve student retention.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
