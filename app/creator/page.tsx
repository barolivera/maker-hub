'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, TrendingUp, DollarSign, Users, Award, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

export default function CreatorDashboardPage() {
  const router = useRouter();
  const { isWalletConnected, walletAddress, publishedCourses, totalEarnings, availableBalance, pendingBalance, withdrawEarnings, enrolledCourses } = useApp();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
    }
  }, [isWalletConnected, router]);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);

    setTimeout(() => {
      withdrawEarnings();
      setIsWithdrawing(false);
      setWithdrawModalOpen(false);
      toast.success('Withdrawal successful! Funds sent to your wallet.');
    }, 2000);
  };

  const getCourseStats = (courseId: string) => {
    const enrollments = enrolledCourses.filter(e => e.courseId === courseId);
    const completions = enrollments.filter(e => e.progress === 100);
    const course = publishedCourses.find(c => c.id === courseId);
    const earned = completions.length * (course?.price || 0) * 0.85;

    return {
      enrollments: enrollments.length,
      completions: completions.length,
      completionRate: enrollments.length > 0 ? Math.round((completions.length / enrollments.length) * 100) : 0,
      earned,
    };
  };

  if (!isWalletConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-gray-400">Manage your courses and track earnings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-teal-500" />
              <span className="text-gray-400 text-sm">Total Earned</span>
            </div>
            <p className="text-3xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">USDC</p>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="h-5 w-5 text-green-500" />
              <span className="text-gray-400 text-sm">Available to Withdraw</span>
            </div>
            <p className="text-3xl font-bold text-white">${availableBalance.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">USDC</p>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <span className="text-gray-400 text-sm">Pending</span>
            </div>
            <p className="text-3xl font-bold text-white">${pendingBalance.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Students in progress</p>
          </Card>
        </div>

        {availableBalance > 0 && (
          <Card className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-teal-500/30 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Ready to withdraw ${availableBalance.toFixed(2)} USDC
                </h3>
                <p className="text-gray-400 text-sm">
                  Funds from completed courses are ready to be sent to your wallet
                </p>
              </div>
              <Button
                onClick={() => setWithdrawModalOpen(true)}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Withdraw to Wallet
              </Button>
            </div>
          </Card>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">My Published Courses</h2>
          <Button
            onClick={() => router.push('/create')}
            className="bg-teal-500 hover:bg-teal-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {publishedCourses.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800 p-12">
            <div className="text-center">
              <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No published courses yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first course and start earning
              </p>
              <Button
                onClick={() => router.push('/create')}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedCourses.map((course) => {
              const stats = getCourseStats(course.id);

              return (
                <Card key={course.id} className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                  <div className="relative h-40 bg-gradient-to-br from-teal-500 to-blue-600 overflow-hidden">
                    {course.coverImageUrl ? (
                      <img
                        src={course.coverImageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-400">by @{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Enrollments
                        </span>
                        <span className="text-white font-semibold">{stats.enrollments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Completions
                        </span>
                        <span className="text-white font-semibold">
                          {stats.completions} ({stats.completionRate}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Earned
                        </span>
                        <span className="text-teal-500 font-semibold">
                          ${stats.earned.toFixed(2)} USDC
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-800">
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-700 hover:bg-gray-800"
                        onClick={() => router.push(`/course/${course.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        View Course
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-700 hover:bg-gray-800"
                        onClick={() => router.push(`/creator/course/${course.id}`)}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <AlertDialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <Wallet className="h-5 w-5 text-teal-500" />
                Withdraw Earnings
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400 space-y-3 pt-4">
                <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold text-white">${availableBalance.toFixed(2)} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>To:</span>
                    <span className="font-mono text-white">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </span>
                  </div>
                </div>
                <p className="text-sm">
                  Funds will be sent to your connected wallet within a few minutes.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-700 hover:bg-gray-800" disabled={isWithdrawing}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleWithdraw}
                className="bg-teal-500 hover:bg-teal-600"
                disabled={isWithdrawing}
              >
                {isWithdrawing ? 'Processing...' : 'Confirm Withdrawal'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
