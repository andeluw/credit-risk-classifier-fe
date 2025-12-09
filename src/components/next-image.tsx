import type { ImageProps } from 'next/image';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type NextImageProps = {
  useSkeleton?: boolean;
  imgClassName?: string;
  blurClassName?: string;
  alt: string;
} & (
  | { width: string | number; height: string | number }
  | { layout: 'fill'; width?: string | number; height?: string | number }
) &
  ImageProps;

/**
 * Sdada
 * @param className - Must set width using `w-` className
 * @param useSkeleton - Add background with pulse animation, don't use it if image is transparent
 */
const NextImage = ({
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  className,
  imgClassName,
  blurClassName,
  ...rest
}: NextImageProps) => {
  const [status, setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete',
  );
  const widthIsSet = className?.includes('w-') ?? false;

  let ResolvedImage = Image;
  if ('default' in ResolvedImage) {
    ResolvedImage = (ResolvedImage as unknown as { default: typeof Image })
      .default;
  }

  return (
    <figure
      className={className}
      style={!widthIsSet ? { width: `${width}px` } : undefined}
    >
      <ResolvedImage
        alt={alt}
        className={cn(
          imgClassName,
          status === 'loading' && cn('animate-pulse', blurClassName),
        )}
        height={height}
        onLoad={() => setStatus('complete')}
        src={src}
        width={width}
        {...rest}
      />
    </figure>
  );
};
NextImage.displayName = 'NextImage';

export { NextImage };
