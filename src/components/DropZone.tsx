import { useState } from 'react';

interface DropZoneProps {
  onDrop: (data: any) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  highlightStyle?: React.CSSProperties; // Style when item is hovering over
  accepts?: string[]; // What types of items this zone accepts
}

/**
 * Drop zone component for receiving dragged items
 * Highlights when a draggable item hovers over it
 */
const DropZone = ({
  onDrop,
  children,
  style = {},
  className = '',
  highlightStyle = {},
  accepts = [],
}: DropZoneProps) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    try {
        const jsonData = e.dataTransfer.getData('application/json');
        
        // Check if we actually got data
        if (!jsonData) {
        console.warn('No drag data received');
        return;
        }
        
        const data = JSON.parse(jsonData);
        
        // Check if this zone accepts this type of item
        if (accepts.length === 0 || accepts.includes(data.type)) {
        onDrop(data);
        }
    } catch (error) {
        console.error('Error parsing drop data:', error);
        // Don't break - just ignore bad drops
    }
    };

  const dropZoneStyle: React.CSSProperties = {
    position: 'relative',
    ...style,
    ...(isOver ? highlightStyle : {}),
  };

  return (
    <div
      style={dropZoneStyle}
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

export default DropZone;