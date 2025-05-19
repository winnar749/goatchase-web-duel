
import React from "react";
import { Player, Position } from "../types/game";
import { Cat, CircleUser } from "lucide-react"; // Using Cat for tiger and CircleUser for goat

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
  // Adjust piece size based on the board size
  const pieceSize = cellSize * 0.5; // Slightly larger for better visibility
  
  // Define styles based on piece type
  let pieceStyles = "";
  
  if (type === "tiger") {
    pieceStyles = `bg-game-tiger hover:bg-game-tigerHover ${isSelected ? 'ring-4 ring-yellow-300' : ''}`;
  } else {
    pieceStyles = `bg-game-goat hover:bg-game-goatHover ${isSelected ? 'ring-4 ring-blue-300' : ''}`;
  }
  
  return (
    <div
      className={`absolute rounded-full shadow-md ${pieceStyles} transition-all duration-200 ease-in-out flex items-center justify-center`}
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
      {type === "tiger" ? (
        <Cat size={pieceSize * 0.6} color="white" strokeWidth={2} />
      ) : (
        <CircleUser size={pieceSize * 0.6} color="white" strokeWidth={2} />
      )}
    </div>
  );
};

export default GamePiece;
