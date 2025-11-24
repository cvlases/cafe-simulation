import { CSSProperties } from 'react';

interface GameButtonProps {
  imageSrc?: string;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
  disabled?: boolean;
}

const GameButton = ({ imageSrc, text, x, y, width, height, onClick, disabled }: GameButtonProps) => {
  const style: CSSProperties = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    background: imageSrc ? 'transparent' : '#4c77afff',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold'
  };

  if (imageSrc) {
    return (
      <img 
        src={imageSrc}
        alt={text || 'button'}
        style={style}
        onClick={disabled ? undefined : onClick}
      />
    );
  }

  return (
    <button 
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default GameButton;