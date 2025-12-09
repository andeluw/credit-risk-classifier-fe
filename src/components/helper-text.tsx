import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Typography } from '@/components/typography';

const HelperText = ({
  children,
  helperTextClassName,
}: {
  children: ReactNode;
  helperTextClassName?: string;
}) => {
  return (
    <div className='flex space-x-1'>
      <Typography
        as='p'
        variant='c1'
        className={cn(
          'text-xs !leading-tight text-muted-foreground',
          helperTextClassName,
        )}
      >
        {children}
      </Typography>
    </div>
  );
};

HelperText.displayName = 'HelperText';
export { HelperText };
