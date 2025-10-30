'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { getCourseById } from '@/lib/courses';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { certificates, walletAddress } = useApp();

  const courseId = params.courseId as string;
  const course = getCourseById(courseId);
  const certificate = certificates.find(cert => cert.courseId === courseId);

  useEffect(() => {
    if (!certificate) {
      router.push('/dashboard');
    }
  }, [certificate, router]);

  if (!course || !certificate) {
    return null;
  }

  const certificateDate = new Date(certificate.mintedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const mockContractAddress = '0xabcd...ef01';
  const mockExplorerUrl = `https://basescan.org/token/${mockContractAddress}`;

  const handleShare = () => {
    const text = `I just completed "${course.title}" on MAKER Hub and earned my NFT certificate! 🎓`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-8 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-8">
          <Card className="bg-gray-900 border-gray-800 p-12">
            <div
              className="relative aspect-[4/3] rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%), ${course.coverImage}`,
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-8">
                  <span className="text-2xl font-bold">
                    <span className="text-white">MAKER</span>
                    <span className="text-teal-500">.</span>
                  </span>
                  <p className="text-sm text-gray-400 mt-2">Certificate of Completion</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {course.title}
                  </h1>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Completed by</p>
                    <p className="text-white font-mono text-lg">{walletAddress}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Date of Completion</p>
                    <p className="text-white font-semibold">{certificateDate}</p>
                  </div>

                  <div className="pt-8 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">Course Creator</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                        {course.creator.slice(1, 3).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{course.creator}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">NFT Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Token ID</span>
                  <span className="text-white font-mono">#{certificate.tokenId}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Contract Address</span>
                  <span className="text-white font-mono">{mockContractAddress}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Network</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    <span className="text-white">Base</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Minted</span>
                  <span className="text-white">{certificateDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 space-y-3">
              <Button
                onClick={handleShare}
                className="w-full bg-teal-500 hover:bg-teal-600"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
              <Button
                onClick={() => window.open(mockExplorerUrl, '_blank')}
                variant="outline"
                className="w-full border-gray-800 hover:bg-gray-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Block Explorer
              </Button>
            </div>
          </Card>

          <Card className="bg-teal-500/10 border-teal-500/20 p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Congratulations on Your Achievement!
                </h3>
                <p className="text-gray-400 text-sm">
                  This NFT certificate is permanently stored on the blockchain and proves your
                  completion of {course.title}. You can view it in any Web3 wallet that supports NFTs.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
