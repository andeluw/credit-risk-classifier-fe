import * as React from 'react';

import { cn } from '@/lib/utils';

const TextButtonVariant = ['primary', 'basic'] as const;

type TextButtonProps = {
  variant?: (typeof TextButtonVariant)[number];
} & React.ComponentPropsWithRef<'button'>;

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      disabled: buttonDisabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type='button'
        disabled={buttonDisabled}
        className={cn(
          'button inline-flex items-center justify-center font-semibold',
          'focus-visible:ring-primary-500 focus:outline-hidden focus-visible:ring',
          'transition duration-100 cursor-pointer hover:cursor-pointer',
          //#region  //*=========== Variant ===========
          variant === 'primary' && [
            'text-primary-500 hover:text-primary-600 active:text-primary-700',
            'disabled:text-primary-200',
          ],
          variant === 'basic' && [
            'text-primary hover:text-muted-foreground active:text-muted-foreground',
            'disabled:text-muted-foreground',
          ],
          //#endregion  //*======== Variant ===========
          'disabled:cursor-not-allowed disabled:brightness-105 disabled:hover:underline',
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

TextButton.displayName = 'TextButton';

export { TextButton, TextButtonVariant };
