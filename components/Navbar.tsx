'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Plus, Award } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const router = useRouter();
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet, publishedCourses } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasPublishedCourses = publishedCourses.length > 0;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-white">MAKER</span>
                <span className="text-teal-500">.</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Browse
              </Link>
              {isWalletConnected && (
                <Link
                  href="/create"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Create Course
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isWalletConnected ? (
              <Button
                onClick={connectWallet}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium"
              >
                Connect Wallet
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-800 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {walletAddress}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gray-900 border-gray-800 text-white"
                >
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard')}
                    className="hover:bg-gray-800 cursor-pointer"
                  >
                    My Learning
                  </DropdownMenuItem>
                  {hasPublishedCourses && (
                    <DropdownMenuItem
                      onClick={() => router.push('/creator')}
                      className="hover:bg-gray-800 cursor-pointer flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Creator Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => router.push('/create')}
                    className="hover:bg-gray-800 cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Course
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={disconnectWallet}
                    className="hover:bg-gray-800 cursor-pointer text-red-400"
                  >
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            {isWalletConnected && (
              <Link
                href="/create"
                className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Course
              </Link>
            )}
            <div className="pt-4">
              {!isWalletConnected ? (
                <Button
                  onClick={() => {
                    connectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium"
                >
                  Connect Wallet
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-400">
                    {walletAddress}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white"
                  >
                    My Learning
                  </Button>
                  {hasPublishedCourses && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        router.push('/creator');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start text-gray-400 hover:text-white"
                    >
                      Creator Dashboard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push('/create');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-400 hover:text-white"
                  >
                    Create Course
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      disconnectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-400 hover:text-red-300"
                  >
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
