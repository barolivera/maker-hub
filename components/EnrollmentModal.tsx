'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

interface EnrollmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  coursePrice: number;
  courseId: string;
  onEnrollSuccess: () => void;
}

export function EnrollmentModal({
  open,
  onOpenChange,
  courseTitle,
  coursePrice,
  courseId,
  onEnrollSuccess,
}: EnrollmentModalProps) {
  const { isWalletConnected, enrollInCourse } = useApp();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const platformFee = coursePrice * 0.1;
  const total = coursePrice + platformFee;
  const mockBalance = 25.0;

  const handleEnroll = () => {
    if (!isWalletConnected) {
      return;
    }

    setIsEnrolling(true);
    setTimeout(() => {
      enrollInCourse(courseId);
      setIsEnrolling(false);
      setIsEnrolled(true);
      setTimeout(() => {
        onEnrollSuccess();
        onOpenChange(false);
        setIsEnrolled(false);
      }, 2000);
    }, 1500);
  };

  if (!isWalletConnected) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Connect Wallet First</DialogTitle>
            <DialogDescription className="text-gray-400">
              You need to connect your wallet to enroll in courses.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-800 hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isEnrolled) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-teal-500/10 p-4">
                <CheckCircle2 className="h-12 w-12 text-teal-500" />
              </div>
              <DialogTitle className="text-2xl">Enrolled Successfully!</DialogTitle>
              <DialogDescription className="text-gray-400 text-center">
                Redirecting to your first lesson...
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Enroll in Course</DialogTitle>
          <DialogDescription className="text-gray-400">
            {courseTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Course Price</span>
              <span className="font-semibold">${coursePrice.toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Platform Fee (10%)</span>
              <span className="font-semibold">${platformFee.toFixed(2)} USDC</span>
            </div>
            <div className="border-t border-gray-800 pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-teal-500">
                ${total.toFixed(2)} USDC
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-yellow-500 font-medium">
                  Funds held in escrow
                </p>
                <p className="text-xs text-gray-400">
                  Your payment will be held securely until you complete the course
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Your USDC Balance</span>
              <span className="font-semibold text-white">
                ${mockBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-800 hover:bg-gray-800"
            disabled={isEnrolling}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            className="flex-1 bg-teal-500 hover:bg-teal-600"
            disabled={isEnrolling}
          >
            {isEnrolling ? 'Processing...' : 'Confirm Enrollment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
