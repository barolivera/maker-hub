'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppState {
  isWalletConnected: boolean;
  walletAddress: string | null;
  enrolledCourses: string[];
  completedLessons: Record<string, string[]>;
}

interface AppContextType extends AppState {
  connectWallet: () => void;
  disconnectWallet: () => void;
  enrollInCourse: (courseId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isWalletConnected: false,
    walletAddress: null,
    enrolledCourses: [],
    completedLessons: {},
  });

  useEffect(() => {
    const stored = localStorage.getItem('makerHubState');
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored state');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('makerHubState', JSON.stringify(state));
  }, [state]);

  const connectWallet = () => {
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
    setState(prev => ({
      ...prev,
      isWalletConnected: true,
      walletAddress: mockAddress,
    }));
  };

  const disconnectWallet = () => {
    setState(prev => ({
      ...prev,
      isWalletConnected: false,
      walletAddress: null,
    }));
  };

  const enrollInCourse = (courseId: string) => {
    setState(prev => ({
      ...prev,
      enrolledCourses: [...prev.enrolledCourses, courseId],
    }));
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setState(prev => ({
      ...prev,
      completedLessons: {
        ...prev.completedLessons,
        [courseId]: [...(prev.completedLessons[courseId] || []), lessonId],
      },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        connectWallet,
        disconnectWallet,
        enrollInCourse,
        markLessonComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
