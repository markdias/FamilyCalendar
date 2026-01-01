import React from 'react';

type TypographyVariant = 
  | 'title1' 
  | 'title2' 
  | 'title3' 
  | 'headline' 
  | 'body' 
  | 'callout' 
  | 'subheadline' 
  | 'footnote' 
  | 'caption1' 
  | 'caption2';

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  className = '',
  as: Component = 'p',
}) => {
  const variants = {
    title1: 'text-title1 font-bold leading-[41px]',
    title2: 'text-title2 font-bold leading-[34px]',
    title3: 'text-title3 font-semibold leading-[28px]',
    headline: 'text-headline font-semibold leading-[22px]',
    body: 'text-body font-regular leading-[22px]',
    callout: 'text-callout font-regular leading-[21px]',
    subheadline: 'text-subheadline font-regular leading-[20px]',
    footnote: 'text-footnote font-regular leading-[18px]',
    caption1: 'text-caption1 font-regular leading-[16px]',
    caption2: 'text-caption2 font-regular leading-[13px]',
  };

  const classes = `${variants[variant]} ${className}`;

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};
