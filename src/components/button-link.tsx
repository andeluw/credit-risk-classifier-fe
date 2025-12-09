import { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import {
  buttonClassName,
  buttonSizes,
  buttonVariants,
} from '@/components/button';
import { UnstyledLink, UnstyledLinkProps } from '@/components/unstyled-link';

type ButtonLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof buttonVariants)[number];
  size?: (typeof buttonSizes)[number];
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
    content?: string;
  };
  iconSize?: string | number;
  isIconFilled?: boolean;
  filledIcon?: string;
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      iconSize = '1em',
      isIconFilled = false,
      filledIcon = 'white',
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          cn(buttonClassName({ variant, size }), className),
          className,
        )}
      >
        {LeftIcon && (
          <div
            className={cn([
              size === 'base' && 'mr-1',
              size === 'sm' && 'mr-1.5',
              size === 'icon' && 'mr-0',
              size === 'lg' && 'mr-2',
              size === 'md' && 'mr-2',
            ])}
          >
            <LeftIcon
              size={iconSize}
              className={cn(
                [
                  size === 'base' && 'md:text-base text-base',
                  size === 'sm' && 'md:text-base text-sm',
                  size === 'icon' && 'text-base',
                  size === 'lg' && 'text-lg',
                  size === 'md' && 'text-base',
                ],
                classNames?.leftIcon,
              )}
              fill={isIconFilled ? filledIcon : 'none'}
              strokeWidth={isIconFilled ? 3 : 2.75}
            />
          </div>
        )}
        <span
          className={cn(
            'inline-flex items-center gap-1 whitespace-nowrap',
            classNames?.content,
          )}
        >
          {children}
        </span>
        {RightIcon && (
          <div
            className={cn([
              size === 'base' && 'ml-1',
              size === 'sm' && 'ml-1.5',
              size === 'icon' && 'ml-0',
              size === 'lg' && 'ml-2',
              size === 'md' && 'ml-2',
            ])}
          >
            <RightIcon
              size={iconSize}
              className={cn(
                [
                  size === 'base' && 'md:text-base text-base',
                  size === 'sm' && 'md:text-base text-sm',
                  size === 'icon' && 'text-base',
                  size === 'lg' && 'text-lg',
                  size === 'md' && 'text-base',
                ],
                classNames?.rightIcon,
              )}
              fill={isIconFilled ? filledIcon : 'none'}
              strokeWidth={isIconFilled ? 3 : 2.75}
            />
          </div>
        )}
      </UnstyledLink>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
export { ButtonLink };
