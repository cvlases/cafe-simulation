import { useState } from 'react';

interface DropZoneProps {
  onDrop: (data: any) => void;
  onDragEnter?: (data: any) => void; 
  onDragLeave?: (data: any) => void; 
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  highlightStyle?: React.CSSProperties;
  accepts?: string[];
}

/**
 * Drop zone component for receiving dragged items
 * Highlights when a draggable item hovers over it
 */
const DropZone = ({
  onDrop,
  onDragEnter, 
  onDragLeave,
  children,
  style = {},
  className = '',
  highlightStyle = {},
  accepts = [],
}: DropZoneProps) => {
  const [isOver, setIsOver] = useState(false);
  const [currentDragData, setCurrentDragData] = useState<any>(null); // to track drag data

  const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  
  // Call onDragEnter on first dragover (when not already over)
  if (!isOver) {
    setIsOver(true);
    
    // Use a simple approach - just call onDragEnter without trying to parse data
    // The ToppingStation will use the global currentlyDragging variable
    if (onDragEnter) {
      onDragEnter({ type: 'unknown' }); // Placeholder, real logic uses global state
    }
  }
};
  const handleDragLeave = (e: React.DragEvent) => {
    // Make sure we're actually leaving the drop zone (not entering a child)
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOver(false);
      
      // Call onDragLeave with the current drag data
      if (onDragLeave && currentDragData) {
        onDragLeave(currentDragData);
      }
      setCurrentDragData(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    try {
      const jsonData = e.dataTransfer.getData('application/json');
      
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
    }
    
    setCurrentDragData(null);
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