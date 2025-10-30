'use client';

import { Search, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/CourseCard';
import { mockCourses } from '@/lib/courses';
import { useApp } from '@/contexts/AppContext';

export default function Home() {
  const { isWalletConnected, connectWallet } = useApp();

  return (
    <div className="w-full">
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-purple-500/10" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Learn from Makers.
            <br />
            <span className="text-teal-500">Earn Onchain.</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-400 max-w-2xl mx-auto">
            Interactive courses with NFT credentials. Pay only when you complete.
          </p>
          {!isWalletConnected && (
            <div className="mt-10">
              <Button
                onClick={connectWallet}
                size="lg"
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg px-8 py-6 h-auto"
              >
                Connect Wallet to Start
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-16 bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-teal-500/10 p-4 border border-teal-500/20">
                <Search className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Choose Your Path
              </h3>
              <p className="text-gray-400">
                Browse courses from expert makers in creative coding, Web3, and interactive art
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-teal-500/10 p-4 border border-teal-500/20">
                <BookOpen className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Complete Tutorials
              </h3>
              <p className="text-gray-400">
                Learn at your own pace with interactive lessons, videos, and hands-on projects
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-teal-500/10 p-4 border border-teal-500/20">
                <Award className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Earn NFT Badges
              </h3>
              <p className="text-gray-400">
                Prove your skills with verifiable onchain certificates
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
            <p className="mt-2 text-gray-400">
              Start learning from the best makers in the space
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
