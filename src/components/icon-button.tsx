import { VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { buttonClassName } from './button';

type IconButtonProps = {
  isLoading?: boolean;
  icon: LucideIcon;
  iconSize?: string | number;
  isIconFilled?: boolean;
  filledIcon?: string;
  classNames?: {
    icon?: string;
  };
} & React.ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonClassName>;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      size = 'icon',
      icon: Icon,
      iconSize = '1em',
      isIconFilled = false,
      filledIcon = 'white',
      classNames,
      ...rest
    },
    ref,
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={cn(
          buttonClassName({ variant, size }),
          isLoading &&
            'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
          className,
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              {
                'text-white': [
                  'primary',
                  'secondary',
                  'dark',
                  'destructive',
                ].includes(variant as string),
                'text-black': ['light', 'outlineblack'].includes(
                  variant as string,
                ),
                'text-primary-500': ['outline', 'ghost'].includes(
                  variant as string,
                ),
              },
            )}
          >
            <LoaderCircle className='animate-spin' />
          </div>
        )}
        <Icon
          size={iconSize}
          className={cn('[&_svg]:size-4 shrink-0', classNames?.icon)}
          fill={isIconFilled ? filledIcon : 'none'}
          strokeWidth={isIconFilled ? 3 : 2.75}
        />
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
