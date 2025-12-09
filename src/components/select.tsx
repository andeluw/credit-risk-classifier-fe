'use client';
import get from 'lodash.get';
import { ChevronDown, X } from 'lucide-react';
import * as React from 'react';
import type { RegisterOptions } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import type { MultiValue, StylesConfig } from 'react-select';
import ReactSelect, { components } from 'react-select';

import type { ExtractProps } from '@/lib/helper';
import { cn } from '@/lib/utils';

import { ErrorMessage } from '@/components/error-message';
import { HelperText } from '@/components/helper-text';
import { Label } from '@/components/label';

export type SelectProps = {
  label: string | null;
  id: string;
  placeholder?: React.ReactNode;
  helperText?: string;
  type?: string;
  isFixed?: boolean;
  isMulti?: boolean;
  readOnly?: boolean;
  hideError?: boolean;
  validation?: RegisterOptions;
  options: { value: string; label: string }[];
  containerClassName?: string;
} & React.ComponentPropsWithoutRef<'select'> &
  ExtractProps<ReactSelect>;

const Select = ({
  disabled,
  readOnly,
  label,
  helperText,
  id,
  isFixed = false,
  isMulti = false,
  placeholder,
  validation,
  options,
  hideError = false,
  containerClassName,
  ...rest
}: SelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);
  const withLabel = label !== null;

  // st
  const reactSelectInstanceId = React.useId();

  //#region  //*=========== Styles ===========
  const customStyles: StylesConfig = {
    control: (styles, state) => ({
      ...styles,
      borderWidth: '1px',
      borderColor: error
        ? 'var(--destructive)'
        : state.isFocused
          ? 'var(--color-primary-500)'
          : 'var(--input)',
      '&:hover': {
        borderColor: error
          ? 'var(--destructive)'
          : state.isFocused
            ? 'var(--color-primary-500)'
            : 'var(--input)',
      },
      boxShadow: 'none',
      transition: 'all 0.2s ease',
      '&:focus-within': {
        borderWidth: '1px',
        borderColor: error ? 'var(--destructive)' : 'var(--color-primary-500)',
        boxShadow: `0 0 0 1px ${
          error ? 'var(--destructive)' : 'var(--color-primary-500)'
        }`,
      },
      borderRadius: 'calc(var(--radius) - 2px)',
      padding: '0 0.75rem',
      background: disabled || readOnly ? 'var(--muted)' : 'transparent',
      color: 'var(--foreground)',
      cursor: disabled || readOnly ? 'not-allowed' : 'pointer',
      minHeight: '2.5rem', // h-10
      height: '2.5rem',
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: 0,
      gap: '0.5rem',
    }),
    input: (styles) => ({
      ...styles,
      padding: 0,
      margin: 0,
      caretColor: 'var(--color-primary-500)',
      color: 'var(--foreground)',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'var(--foreground)',
    }),
    placeholder: (styles) => ({
      ...styles,
      color: 'var(--muted-foreground)',
    }),
    indicatorsContainer: (styles) => ({
      ...styles,
      '&>div': {
        padding: 0,
      },
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      color: 'var(--muted-foreground)',
      '&:hover': {
        color: 'var(--muted-foreground)',
      },
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'var(--popover)',
      borderColor: 'var(--border)',
      borderWidth: '1px',
      borderRadius: 'var(--radius)',
      boxShadow:
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      overflow: 'hidden',
      zIndex: 50,
    }),
    option: (styles, state) => ({
      ...styles,
      color: state.isSelected
        ? 'var(--select-item-selected-text)'
        : 'var(--foreground)',
      background: state.isFocused
        ? 'var(--select-item-active)'
        : state.isSelected
          ? 'var(--select-item-selected)'
          : 'transparent',
      ':hover': {
        background: 'var(--select-item-hover)',
      },
      cursor: 'pointer',
      fontSize: '0.875rem',
    }),
    multiValue: (styles) => ({
      ...styles,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      backgroundColor: 'var(--muted)',
      borderRadius: '0.375rem',
      padding: '0.125rem 0.5rem',
      margin: 0,
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: 'var(--foreground)',
      padding: 0,
      fontSize: '0.875rem',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: 'var(--muted-foreground)',
      padding: 0,
      paddingLeft: '0.25rem',
      '&:hover': {
        color: 'var(--destructive)',
        backgroundColor: 'transparent',
      },
    }),
    menuPortal: (styles) => ({
      ...styles,
      zIndex: 50,
    }),
  };
  //#endregion  //*======== Styles ===========

  return (
    <div className={containerClassName}>
      {withLabel ? (
        <Label required={!!validation?.required}>{label}</Label>
      ) : null}
      <div
        className={cn(
          'relative',
          withLabel && 'mt-1',
          (disabled || readOnly) && 'cursor-not-allowed',
        )}
      >
        <Controller
          control={control}
          name={id}
          rules={validation}
          render={({ field }) => (
            <ReactSelect
              {...field}
              classNames={{
                control: () => '!h-[2.5rem]',
              }}
              instanceId={rest.instanceId ?? reactSelectInstanceId}
              inputId={id}
              isClearable
              isDisabled={disabled || readOnly}
              isMulti={isMulti}
              menuPosition={isFixed ? 'fixed' : undefined}
              closeMenuOnSelect={!isMulti}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: (props) => (
                  <components.DropdownIndicator {...props}>
                    <ChevronDown size={18} />
                  </components.DropdownIndicator>
                ),
                ClearIndicator: (props) => (
                  <components.ClearIndicator {...props}>
                    <X
                      className='mr-0.5 text-typo-icons hover:text-typo-secondary'
                      size={18}
                    />
                  </components.ClearIndicator>
                ),
                MultiValueRemove: (props) => (
                  <components.MultiValueRemove {...props}>
                    <X size={18} />
                  </components.MultiValueRemove>
                ),
              }}
              options={options}
              placeholder={placeholder}
              styles={customStyles}
              onChange={(selectedOptions) => {
                if (isMulti) {
                  field.onChange(
                    (
                      selectedOptions as MultiValue<(typeof options)[number]>
                    ).map((option) => option?.value ?? ''),
                  );
                } else {
                  field.onChange(
                    (selectedOptions as (typeof options)[number])?.value ?? '',
                  );
                }
              }}
              // null is needed so if the selected value is not found in options, it clears the value
              value={
                isMulti
                  ? field.value?.map(
                      (value: unknown) =>
                        options.find((option) => option.value === value) ??
                        null,
                    )
                  : (options.find((opt) => opt.value === field.value) ?? null)
              }
              {...rest}
            />
          )}
        />

        {!hideError && error ? (
          <ErrorMessage className='mt-2'>
            {String(error.message ?? '')}
          </ErrorMessage>
        ) : null}

        {helperText ? (
          <HelperText helperTextClassName='mt-2'>{helperText}</HelperText>
        ) : null}
      </div>
    </div>
  );
};

Select.displayName = 'Select';

export { Select };
