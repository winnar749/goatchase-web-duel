
import React from "react";
import { Player, Position } from "../types/game";

interface GamePieceProps {
  type: Player;
  position: Position;
  cellSize: number;
  isSelected?: boolean;
}

const GamePiece: React.FC<GamePieceProps> = ({ 
  type, 
  position, 
  cellSize,
  isSelected = false
}) => {
  // Make pieces smaller by reducing the multiplier from 0.6 to 0.5
  const pieceSize = cellSize * 0.5;
  
  // Define styles based on piece type
  let pieceStyles = "";
  
  if (type === "tiger") {
    pieceStyles = `bg-game-tiger hover:bg-game-tigerHover ${isSelected ? 'ring-4 ring-yellow-300' : ''}`;
  } else {
    pieceStyles = `bg-game-goat hover:bg-game-goatHover ${isSelected ? 'ring-4 ring-blue-300' : ''}`;
  }
  
  return (
    <div
      className={`absolute rounded-full shadow-md ${pieceStyles} transition-all duration-200 ease-in-out`}
      style={{
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
        left: `${position.col * cellSize}px`,
        top: `${position.row * cellSize}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        cursor: 'pointer'
      }}
    >
      {/* Icon or pattern inside the piece */}
      <div className="w-full h-full flex items-center justify-center text-white">
        {type === "tiger" ? (
          <svg viewBox="0 0 24 24" className="w-2/3 h-2/3" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M8 9h0M16 9h0M11 14c.8 0 2 .2 2 1M9 20l.1-1 1.9-6M15 20l-.1-1-1.9-6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-2/3 h-2/3" fill="none" stroke="white" strokeWidth="2">
            <path d="M17 7c0 4.333-5 7-5 7s-5-2.667-5-7c0-2.917 2.5-5 5-5s5 2.083 5 5z" />
            <path d="M12 14v7M9 18h6" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default GamePiece;
