import type { CSSProperties } from 'react';


interface GameImageProps {
  src: string;
  alt: string;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
}

/**
 * Base image component for all game assets
 * Handles common functionality like loading, error states, and interactions
 */
const GameImage = ({
  src,
  alt,
  style = {},
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOver,
}: GameImageProps) => {
  const defaultStyle: CSSProperties = {
    userSelect: 'none',
    ...style,
 };

  return (
    <img
      src={src}
      alt={alt}
      style={defaultStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onDragOver={onDragOver}
    />
  );
};

export default GameImage;