import { useState, useRef } from 'react';
import GameImage from './GameImage';

interface DraggableImageProps {
  src: string;
  draggingSrc?: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
  dragData?: any;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DraggableImage = ({
  src,
  draggingSrc,
  alt,
  style = {},
  className = '',
  dragData,
  onDragStart,
  onDragEnd,
}: DraggableImageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  // const imgRef = useRef<HTMLImageElement>(null);
  const dragPreviewRef = useRef<HTMLImageElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // Use the hidden preview image
    if (dragPreviewRef.current) {
      e.dataTransfer.setDragImage(
        dragPreviewRef.current,
        dragPreviewRef.current.width / 2,
        dragPreviewRef.current.height / 2
      );
    }
    
    if (dragData) {
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    }
    if (onDragStart) {
      onDragStart();
    }
  };

  const handleDragEnd = (_e: React.DragEvent) => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const draggableStyle: React.CSSProperties = {
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.3 : 1,
    transition: 'all 0.2s',
    ...style,
  };

  return (
    <>
      {/* Hidden drag preview image */}
      <img
        ref={dragPreviewRef}
        src={draggingSrc || src}
        alt={alt}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '120px', // Fixed size for preview
          opacity: 0.8,
          pointerEvents: 'none'
        }}
      />
      
      {/* Visible draggable image */}
      <GameImage
        src={isDragging && draggingSrc ? draggingSrc : src}
        alt={alt}
        style={draggableStyle}
        className={className}
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </>
  );
};

export default DraggableImage;