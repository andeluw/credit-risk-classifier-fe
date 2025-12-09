import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { get, RegisterOptions, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { ErrorMessage } from '@/components/error-message';
import { HelperText } from '@/components/helper-text';
import { Label } from '@/components/label';
import { Typography } from '@/components/typography';

export type InputProps = {
  id: string;
  label?: string;
  helperText?: React.ReactNode;
  helperTextClassName?: string;
  labelTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  prefix?: string;
  suffix?: string;
  rightIcon?: LucideIcon;
  leftIcon?: LucideIcon;
  rightIconClassName?: string;
  leftIconClassName?: string;
  labelTextClasname?: string;
} & React.ComponentPropsWithoutRef<'input'>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      hideError = false,
      validation,
      prefix,
      suffix,
      className,
      type = 'text',
      readOnly = false,
      rightIcon: RightIcon,
      leftIcon: LeftIcon,
      rightIconClassName,
      leftIconClassName,
      labelTextClassName,
      helperTextClassName,
      ...rest
    },
    ref,
  ) => {
    const formContext = useFormContext();

    const [showPassword, setShowPassword] = useState(false);
    const error = formContext
      ? get(formContext.formState.errors, id)
      : undefined;

    const registerResult = formContext
      ? formContext.register(id, validation)
      : { ref: undefined };

    const { ref: hookFormRef, ...inputRegisterProps } = registerResult;

    return (
      <div className='w-full space-y-2'>
        {label && (
          <Label
            required={!!validation?.required}
            className={labelTextClassName}
          >
            {label}
          </Label>
        )}

        <div className='relative flex w-full gap-0'>
          <div
            className={cn(
              'pointer-events-none absolute h-full w-full rounded-md border-input ring-1 ring-inset ring-input',
            )}
          />

          {prefix && (
            <Typography
              variant='c1'
              className='flex w-min items-center rounded-l-md bg-transparent px-3 text-sm text-muted-foreground'
            >
              {prefix}
            </Typography>
          )}

          <div
            className={cn(
              'relative w-full rounded-md',
              prefix && 'rounded-l-md',
              suffix && 'rounded-r-md',
            )}
          >
            {LeftIcon && (
              <div
                className={cn(
                  'absolute left-0 top-0 h-full',
                  'flex items-center justify-center pl-2.5',
                  'text-lg text-foreground md:text-xs',
                  leftIconClassName,
                )}
              >
                <LeftIcon className='h-5 w-5' />
              </div>
            )}

            <input
              id={id}
              type={
                type === 'password'
                  ? showPassword
                    ? 'text'
                    : 'password'
                  : type
              }
              autoComplete={
                type === 'password' ? 'current-password' : undefined
              }
              readOnly={readOnly}
              disabled={readOnly}
              className={cn(
                'flex h-10 w-full rounded-md border-input bg-transparent px-3 py-1 text-base transition-colors file:py-1 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'hover:ring-[0.75px] hover:ring-inset hover:ring-input',
                LeftIcon && 'pl-9',
                RightIcon && 'pr-9',
                readOnly && 'cursor-not-allowed',
                error &&
                  'border-none ring-[1.25px] ring-inset ring-red-500 placeholder:text-muted-foreground focus:ring-red-500',
                prefix && 'rounded-l-none rounded-r-md',
                suffix && 'rounded-l-md rounded-r-none',
                prefix && suffix && 'rounded-none',
                className,
              )}
              aria-describedby={id}
              {...inputRegisterProps}
              {...rest}
              ref={(el) => {
                if (hookFormRef) {
                  hookFormRef(el);
                }
                if (typeof ref === 'function') {
                  ref(el);
                } else if (ref) {
                  (
                    ref as React.MutableRefObject<HTMLInputElement | null>
                  ).current = el;
                }
              }}
            />

            {RightIcon && type !== 'password' && (
              <div
                className={cn(
                  'absolute bottom-0 right-0 h-full',
                  'flex items-center justify-center pr-2.5',
                  'text-lg text-foreground md:text-xl',
                  rightIconClassName,
                )}
              >
                <RightIcon className='h-5 w-5' />
              </div>
            )}

            {type === 'password' && (
              <div
                className={cn(
                  'absolute bottom-0 right-0 h-full',
                  'flex items-center justify-center pr-3',
                  'text-lg text-muted-foreground md:text-xl cursor-pointer',
                  rightIconClassName,
                )}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </div>
            )}
          </div>

          {suffix && (
            <Typography
              variant='c1'
              className='flex w-min items-center rounded-l-md bg-transparent px-3 text-sm text-muted-foreground'
            >
              {suffix}
            </Typography>
          )}
        </div>

        {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
        {helperText && (
          <HelperText helperTextClassName={cn(helperTextClassName)}>
            {helperText}
          </HelperText>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export { Input };
