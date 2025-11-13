/**
 * Mock for next/image in Storybook
 *
 * Next.js Image component is not available in Storybook,
 * so we provide a simple mock that renders a regular img tag.
 */
import React from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Storybook-compatible Image component
 * Renders as a regular img tag
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, width, height, className, style, loading, onLoad, onError, fill, ...props }, ref) => {
    const imgStyle: React.CSSProperties = {
      ...style,
    };

    // If fill is true, add object-fit styles
    if (fill) {
      imgStyle.width = '100%';
      imgStyle.height = '100%';
      imgStyle.objectFit = 'cover';
    } else if (width || height) {
      if (width) imgStyle.width = typeof width === 'number' ? `${width}px` : width;
      if (height) imgStyle.height = typeof height === 'number' ? `${height}px` : height;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        style={imgStyle}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;
