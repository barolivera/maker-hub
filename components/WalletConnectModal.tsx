'use client';

import { useState } from 'react';
import { Wallet, ExternalLink, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => void;
}

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect using MetaMask browser extension',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
        <path d="M37.5 5L22.5 16.25L25.25 10L37.5 5Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25"/>
        <path d="M2.5 5L17.25 16.375L14.75 10L2.5 5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
        <path d="M32 27.5L28 34L36.25 36.25L38.5 27.75L32 27.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
        <path d="M1.5 27.75L3.75 36.25L12 34L8 27.5L1.5 27.75Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
        <path d="M11.5 17.5L9.25 21.25L17.5 21.625L17.25 12.75L11.5 17.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
        <path d="M28.5 17.5L22.625 12.5L22.5 21.625L30.75 21.25L28.5 17.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25"/>
      </svg>
    ),
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connect using Coinbase Wallet',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="20" fill="#0052FF"/>
        <path d="M20 28C24.4183 28 28 24.4183 28 20C28 15.5817 24.4183 12 20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28Z" fill="white"/>
        <path d="M17 20H23V18H17V20Z" fill="#0052FF"/>
        <path d="M20 23V17H22V23H20Z" fill="#0052FF"/>
      </svg>
    ),
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Scan with your mobile wallet',
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="20" fill="#3B99FC"/>
        <path d="M12 16.5C16.5 12 24.5 12 29 16.5L29.5 17L27 19.5L26.5 19C23.5 16 17.5 16 14.5 19L14 19.5L11.5 17L12 16.5Z" fill="white"/>
        <path d="M16 20.5L18.5 23L16 25.5C16 25.5 15.5 26 15.5 26L13 23.5V23L15.5 20.5C15.5 20.5 16 20.5 16 20.5Z" fill="white"/>
        <path d="M24 20.5L26.5 23L24 25.5L23.5 26L21 23.5V23L23.5 20.5H24Z" fill="white"/>
      </svg>
    ),
  },
];

export function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId);

    setTimeout(() => {
      onConnect(walletId);
      setConnecting(null);
      onClose();
      toast.success('Wallet connected successfully!');
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Wallet className="h-6 w-6 text-teal-500" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a wallet to connect to MAKER Hub
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={connecting !== null}
              className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-teal-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex-shrink-0">{wallet.icon}</div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-white group-hover:text-teal-500 transition-colors">
                  {wallet.name}
                </h3>
                <p className="text-sm text-gray-400">{wallet.description}</p>
              </div>
              {connecting === wallet.id ? (
                <Loader2 className="h-5 w-5 text-teal-500 animate-spin" />
              ) : (
                <ExternalLink className="h-5 w-5 text-gray-500 group-hover:text-teal-500 transition-colors" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            By connecting a wallet, you agree to MAKER Hub's Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
