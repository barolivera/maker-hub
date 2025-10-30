'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Certificate {
  courseId: string;
  mintedAt: string;
  tokenId: string;
}

interface DraftCourse {
  id: string;
  step: number;
  data: any;
  updatedAt: string;
}

interface AppState {
  isWalletConnected: boolean;
  walletAddress: string | null;
  walletType: string | null;
  networkName: string;
  isConnecting: boolean;
  enrolledCourses: string[];
  completedLessons: Record<string, string[]>;
  certificates: Certificate[];
  publishedCourses: string[];
  draftCourses: DraftCourse[];
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
}

interface AppContextType extends AppState {
  connectWallet: (walletType: string) => void;
  disconnectWallet: () => void;
  enrollInCourse: (courseId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  isCourseCompleted: (courseId: string, totalLessons: number) => boolean;
  mintCertificate: (courseId: string) => void;
  publishCourse: (courseId: string) => void;
  saveDraft: (draft: DraftCourse) => void;
  getDraft: (id: string) => DraftCourse | undefined;
  deleteDraft: (id: string) => void;
  withdrawEarnings: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isWalletConnected: false,
    walletAddress: null,
    walletType: null,
    networkName: 'Base Network',
    isConnecting: false,
    enrolledCourses: [],
    completedLessons: {},
    certificates: [],
    publishedCourses: [],
    draftCourses: [],
    totalEarnings: 0,
    availableBalance: 0,
    pendingBalance: 0,
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

  const connectWallet = (walletType: string) => {
    setState(prev => ({ ...prev, isConnecting: true }));

    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      setState(prev => ({
        ...prev,
        isWalletConnected: true,
        walletAddress: mockAddress,
        walletType,
        isConnecting: false,
      }));
    }, 1000);
  };

  const disconnectWallet = () => {
    setState(prev => ({
      ...prev,
      isWalletConnected: false,
      walletAddress: null,
      walletType: null,
      isConnecting: false,
    }));
  };

  const enrollInCourse = (courseId: string) => {
    setState(prev => ({
      ...prev,
      enrolledCourses: [...prev.enrolledCourses, courseId],
    }));
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setState(prev => {
      const currentCompleted = prev.completedLessons[courseId] || [];
      if (currentCompleted.includes(lessonId)) {
        return prev;
      }
      return {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [courseId]: [...currentCompleted, lessonId],
        },
      };
    });
  };

  const isCourseCompleted = (courseId: string, totalLessons: number) => {
    const completed = state.completedLessons[courseId] || [];
    return completed.length === totalLessons;
  };

  const mintCertificate = (courseId: string) => {
    const tokenId = Math.floor(Math.random() * 10000).toString();
    const certificate: Certificate = {
      courseId,
      mintedAt: new Date().toISOString(),
      tokenId,
    };
    setState(prev => ({
      ...prev,
      certificates: [...prev.certificates, certificate],
    }));
  };

  const publishCourse = (courseId: string) => {
    setState(prev => ({
      ...prev,
      publishedCourses: [...prev.publishedCourses, courseId],
    }));
  };

  const saveDraft = (draft: DraftCourse) => {
    setState(prev => ({
      ...prev,
      draftCourses: [
        ...prev.draftCourses.filter(d => d.id !== draft.id),
        { ...draft, updatedAt: new Date().toISOString() },
      ],
    }));
  };

  const getDraft = (id: string) => {
    return state.draftCourses.find(d => d.id === id);
  };

  const deleteDraft = (id: string) => {
    setState(prev => ({
      ...prev,
      draftCourses: prev.draftCourses.filter(d => d.id !== id),
    }));
  };

  const withdrawEarnings = (amount: number) => {
    setState(prev => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
      totalEarnings: prev.totalEarnings,
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
        isCourseCompleted,
        mintCertificate,
        publishCourse,
        saveDraft,
        getDraft,
        deleteDraft,
        withdrawEarnings,
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
