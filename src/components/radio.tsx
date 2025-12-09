import clsx from 'clsx';
import * as React from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { get, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { ErrorMessage } from '@/components/error-message';
import { HelperText } from '@/components/helper-text';
import { Typography } from '@/components/typography';

const RadioSize = ['sm', 'base'] as const;
type RadioSizeType = (typeof RadioSize)[number];

export type RadioProps = {
  /** Input label */
  label: string;
  name: string;
  value: string;
  /** Small text below input, useful for additional information */
  helperText?: string;
  /** Disables the input and shows defaultValue (can be set from React Hook Form) */
  readOnly?: boolean;
  /** Disable error style (not disabling error validation) */
  hideError?: boolean;
  /** Manual validation using RHF, it is encouraged to use yup resolver instead */
  validation?: RegisterOptions;
  size?: RadioSizeType;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'size'>;

const Radio = ({
  label,
  placeholder = '',
  helperText,
  name,
  value,
  readOnly = false,
  hideError = false,
  validation,
  size = 'base',
  disabled,
  ...rest
}: RadioProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);

  return (
    <div>
      <div className='flex items-center gap-2'>
        <input
          {...register(name, validation)}
          {...rest}
          aria-describedby={name}
          className={cn(
            '',
            'shrink-0 cursor-pointer',
            'focus:outline-none focus:ring-0 focus:ring-offset-0',
            'checked:bg-primary-500 checked:hover:bg-primary-600 checked:focus:bg-primary-500 checked:active:bg-primary-700',
            (readOnly || disabled) &&
              'cursor-not-allowed bg-gray-100 disabled:checked:bg-primary-400',
            error && 'border-danger-400 bg-danger-100',
            size === 'sm' && 'h-3.5 w-3.5',
          )}
          disabled={disabled}
          id={`${name}_${value}`}
          name={name}
          placeholder={placeholder}
          readOnly={readOnly}
          type='radio'
          value={value}
        />
        <Typography
          as='label'
          className={clsx((readOnly || disabled) && 'cursor-not-allowed')}
          htmlFor={`${name}_${value}`}
          variant={size === 'sm' ? 'b3' : 'b2'}
        >
          {label}
        </Typography>
      </div>
      {!hideError && error ? (
        <ErrorMessage className='mt-2'>
          {String(error.message ?? '')}
        </ErrorMessage>
      ) : null}
      {helperText ? (
        <HelperText helperTextClassName='mt-2'>{helperText}</HelperText>
      ) : null}
    </div>
  );
};
Radio.displayName = 'Radio';

export { Radio, RadioSize };
