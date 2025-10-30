import Link from 'next/link';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/lib/courses';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const difficultyColors = {
    Beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    Intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <Link href={`/course/${course.id}`}>
      <Card className="group overflow-hidden border-gray-800 bg-gray-900 transition-all duration-300 hover:border-teal-500 hover:scale-[1.02] cursor-pointer h-full">
        <div
          className="h-48 w-full"
          style={{
            background: course.coverImage,
          }}
        />
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white group-hover:text-teal-500 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-400">by {course.creator}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-teal-500">
              ${course.price} USDC
            </span>
            <Badge
              variant="outline"
              className={`${difficultyColors[course.difficulty]} border`}
            >
              {course.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span>{course.enrollments} students</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
