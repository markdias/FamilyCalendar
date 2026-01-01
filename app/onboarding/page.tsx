'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export default function Onboarding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#052652] via-[#0D5775] to-[#0A8F8A] flex flex-col items-center justify-center p-xl text-white">
      <div className="flex flex-col items-center text-center gap-l max-w-sm">
        {/* Mock Logo */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
           <div className="grid grid-cols-2 gap-1 p-4">
             <div className="w-4 h-4 rounded-full bg-accent" />
             <div className="w-4 h-4 rounded-full bg-member-blue" />
             <div className="w-4 h-4 rounded-full bg-member-green" />
             <div className="w-4 h-4 rounded-full bg-member-yellow" />
           </div>
        </div>

        <div className="flex flex-col gap-s">
          <Typography variant="title1" className="text-white">FamCal</Typography>
          <Typography variant="headline" className="text-white/80">Family Calendar Made Easy</Typography>
        </div>

        <div className="w-full flex flex-col gap-m mt-xl">
          <Button 
            className="w-full bg-white text-[#0D5775] hover:bg-white/90" 
            onClick={() => router.push('/setup')}
          >
            Sign Up with Google
          </Button>
          <Button 
            className="w-full bg-white/20 text-white border-white/40 hover:bg-white/30" 
            variant="outline"
            onClick={() => router.push('/setup')}
          >
            Sign Up with Email
          </Button>
          
          <div className="flex flex-col gap-xs mt-s">
            <Typography variant="footnote" className="text-white/60">
              Already have an account? <button className="text-white underline font-semibold">Log In</button>
            </Typography>
            <button 
              className="text-white/80 underline text-subheadline mt-s"
              onClick={() => router.push('/')}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
