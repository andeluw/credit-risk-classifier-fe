import { get, RegisterOptions, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { ErrorMessage } from '@/components/error-message';
import { HelperText } from '@/components/helper-text';
import { Label } from '@/components/label';

export type TextareaProps = {
  id: string;
  label?: string;
  helperText?: React.ReactNode;
  helperTextClassName?: string;
  labelTextClassName?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
} & React.ComponentPropsWithoutRef<'textarea'>;

const Textarea = ({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  className,
  readOnly = false,
  labelTextClassName,
  helperTextClassName,
  ...rest
}: TextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  return (
    <div className='w-full space-y-2'>
      {label && (
        <Label required={!!validation?.required} className={labelTextClassName}>
          {label}
        </Label>
      )}

      <textarea
        {...register(id, validation)}
        id={id}
        name={id}
        readOnly={readOnly}
        disabled={readOnly}
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'hover:ring-[0.75px] hover:ring-inset hover:ring-input',
          readOnly && 'cursor-not-allowed',
          error &&
            'border-none ring-[1.5px] ring-inset ring-red-500 placeholder:text-muted-foreground focus:ring-red-500',
          className,
        )}
        aria-describedby={id}
        {...rest}
      />

      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {helperText && (
        <HelperText
          helperTextClassName={cn(
            helperTextClassName,
            !hideError && error && 'text-red-500',
          )}
        >
          {helperText}
        </HelperText>
      )}
    </div>
  );
};
Textarea.displayName = 'Textarea';
export { Textarea };
