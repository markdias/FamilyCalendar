import React from 'react';
import { Card } from './Card';
import { Typography } from './Typography';
import { Button } from './Button';

interface UpgradePromptProps {
  feature?: string;
  onUpgrade?: () => void;
  onClose?: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature = "advanced features",
  onUpgrade,
  onClose
}) => {
  return (
    <Card className="bg-gradient-to-br from-accent to-member-pink p-m flex flex-col gap-m border-0">
      <div className="flex justify-between items-start text-white">
        <div className="flex flex-col gap-xxs">
          <Typography variant="title3" className="text-white">Get FamCal Pro</Typography>
          <Typography variant="subheadline" className="text-white/90">
            Unlock {feature} and more for your whole family.
          </Typography>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
      </div>
      
      <ul className="flex flex-col gap-xxs text-white/80">
        <li className="flex items-center gap-xs text-caption1">
          <span className="text-white">✓</span> Unlimited family members
        </li>
        <li className="flex items-center gap-xs text-caption1">
          <span className="text-white">✓</span> Shared widgets & spotlight events
        </li>
        <li className="flex items-center gap-xs text-caption1">
          <span className="text-white">✓</span> Custom themes & backgrounds
        </li>
      </ul>

      <Button 
        className="w-full bg-white text-accent hover:bg-white/90" 
        onClick={onUpgrade}
      >
        Upgrade Now
      </Button>
    </Card>
  );
};
