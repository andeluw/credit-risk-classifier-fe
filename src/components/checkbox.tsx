import clsx from 'clsx';
import * as React from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { ErrorMessage } from '@/components/error-message';
import { HelperText } from '@/components/helper-text';
import { Typography } from '@/components/typography';

const CheckboxSize = ['sm', 'base'] as const;
type CheckboxSizeType = (typeof CheckboxSize)[number];

export type CheckboxProps = {
  /** Input label */
  label: string;
  name: string;
  /** Add value only if you're using grouped checkbox, omit value if using a single checkbox */
  value?: string | number;
  /** Small text below input, useful for additional information */
  helperText?: string;
  /** Disables the input and shows defaultValue (can be set from React Hook Form) */
  readOnly?: boolean;
  /** Disable error style (not disabling error validation) */
  hideError?: boolean;
  /** Manual validation using RHF, it is encouraged to use yup resolver instead */
  validation?: RegisterOptions;
  size?: CheckboxSizeType;
  containerClassName?: string;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'size'>;

const Checkbox = ({
  label,
  name,
  value,
  placeholder = '',
  helperText,
  readOnly = false,
  hideError = false,
  validation,
  size = 'base',
  disabled,
  containerClassName,
  ...rest
}: CheckboxProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] || null;

  return (
    <div className={containerClassName}>
      <div className='flex items-start gap-2'>
        <input
          {...register(name, validation)}
          {...rest}
          aria-describedby={name}
          className={cn(
            // add top margin so the checkbox align with the text
            'mt-[0.25em]',
            'shrink-0 cursor-pointer',
            'rounded-sm focus:ring-0 focus:ring-offset-0',
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
          type='checkbox'
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
Checkbox.displayName = 'Checkbox';

export { Checkbox, CheckboxSize };
