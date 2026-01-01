'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function FamilySetup() {
  const [step, setStep] = useState(1);
  const [familyName, setFamilyName] = useState('Smith Family');
  const [members] = useState([
    { name: 'John', color: '#4A90E2' },
    { name: 'Jane', color: '#E74C3C' }
  ]);
  const router = useRouter();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const complete = () => router.push('/');

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-m animate-in fade-in slide-in-from-right duration-300">
            <Typography variant="subheadline" className="text-secondary-text uppercase">Step 1 of 3</Typography>
            <Typography variant="title2">Name Your Family</Typography>
            <Typography variant="body" className="text-secondary-text">What&apos;s your family name? This will be used to identify your shared calendar.</Typography>
            <Input 
              value={familyName} 
              onChange={(e) => setFamilyName(e.target.value)} 
              placeholder="e.g. Smith Family"
            />
            <div className="mt-l">
              <Button className="w-full" onClick={nextStep}>Next</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-m animate-in fade-in slide-in-from-right duration-300">
            <Typography variant="subheadline" className="text-secondary-text uppercase">Step 2 of 3</Typography>
            <Typography variant="title2">Add Family Members</Typography>
            <Typography variant="body" className="text-secondary-text">Who&apos;s in your family? Each person gets their own color.</Typography>
            <div className="flex flex-col gap-s">
              {members.map((member, i) => (
                <Card key={i} className="flex items-center justify-between p-s">
                  <div className="flex items-center gap-m">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: member.color }} />
                    <Typography variant="headline">{member.name}</Typography>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Card>
              ))}
              <Button variant="outline" className="border-dashed">+ Add Member</Button>
            </div>
            <div className="flex gap-m mt-l">
              <Button variant="secondary" className="flex-1" onClick={prevStep}>Back</Button>
              <Button className="flex-1" onClick={nextStep}>Next</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-m text-center animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-success text-white rounded-full flex items-center justify-center text-title1 self-center mb-m">
               ✓
             </div>
             <Typography variant="title1">All Set!</Typography>
             <Typography variant="body" className="text-secondary-text">
               Your {familyName} calendar is ready with {members.length} members.
             </Typography>
             <div className="bg-system-gray bg-opacity-5 rounded-l p-m mt-m text-left">
               <Typography variant="footnote" className="text-secondary-text uppercase mb-s">Calendar Preview</Typography>
               <div className="flex gap-xs">
                 {members.map((m, i) => (
                   <div key={i} className="flex items-center gap-xxs bg-card px-xs py-xxs rounded-full border border-border">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                     <Typography variant="caption1">{m.name}</Typography>
                   </div>
                 ))}
               </div>
             </div>
             <div className="mt-xl">
               <Button className="w-full" onClick={complete}>Get Started</Button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-m">
      <div className="w-full max-w-xl bg-card rounded-xl shadow-xl p-xl border border-border">
        {renderStep()}
      </div>
    </div>
  );
}
