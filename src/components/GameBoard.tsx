
import React, { useState, useEffect } from "react";
import { GameState, Position, Player, Move } from "../types/game";
import { 
  isValidMove, 
  getValidMovesForPosition, 
  BOARD_SIZE,
  makeMove,
  isValidIntersection
} from "../lib/game-logic";
import GamePiece from "./GamePiece";

interface GameBoardProps {
  gameState: GameState;
  onMove: (move: Move) => void;
  readOnly?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  onMove,
  readOnly = false
}) => {
  const [highlightedPositions, setHighlightedPositions] = useState<Position[]>([]);
  
  // Responsive board sizing
  const viewportWidth = Math.min(window.innerWidth, 1200);
  const boardSizeMultiplier = viewportWidth < 768 ? 0.85 : 0.55;
  const boardSize = Math.min(viewportWidth * boardSizeMultiplier, 400);
  const cellSize = boardSize / (BOARD_SIZE - 1);
  
  // Generate board lines for BaghChal layout
  const generateBoardLines = () => {
    const lines = [];
    
    // Horizontal lines
    for (let row = 0; row < BOARD_SIZE; row++) {
      lines.push(
        <line
          key={`h-${row}`}
          x1={0}
          y1={row * cellSize}
          x2={boardSize}
          y2={row * cellSize}
          stroke="#8B4513"
          strokeWidth="2"
        />
      );
    }
    
    // Vertical lines
    for (let col = 0; col < BOARD_SIZE; col++) {
      lines.push(
        <line
          key={`v-${col}`}
          x1={col * cellSize}
          y1={0}
          x2={col * cellSize}
          y2={boardSize}
          stroke="#8B4513"
          strokeWidth="2"
        />
      );
    }
    
    // Diagonal lines
    // Main diagonals (full board)
    lines.push(
      <line
        key="d-main-1"
        x1={0}
        y1={0}
        x2={boardSize}
        y2={boardSize}
        stroke="#8B4513"
        strokeWidth="2"
      />
    );
    lines.push(
      <line
        key="d-main-2"
        x1={0}
        y1={boardSize}
        x2={boardSize}
        y2={0}
        stroke="#8B4513"
        strokeWidth="2"
      />
    );
    
    // Quarter diagonals
    const half = cellSize * 2;
    const center = cellSize * 2;
    
    // Top-left quarter
    lines.push(
      <line
        key="d-tl"
        x1={0}
        y1={0}
        x2={half}
        y2={half}
        stroke="#8B4513"
        strokeWidth="2"
      />
    );
    
    // Top-right quarter
    lines.push(
      <line
        key="d-tr"
        x1={boardSize}
        y1={0}
        x2={center}
        y2={half}
        stroke="#8B4513"
        strokeWidth="2"
      />
    );
    
    // Bottom-left quarter
    lines.push(
      <line
        key="d-bl"
        x1={0}
        y1={boardSize}
        x2={half}
        y2={center}
        stroke="#8B4513"
        strokeWidth="2"
      />
    );
    
    // Bottom-right quarter
    lines.push(
      <line
        key="d-br"
        x1={boardSize}
        y1={boardSize}
        x2={center}
        y2={center}
        stroke="#8B4513"
        strokeWidth="2"
      />
    );
    
    return lines;
  };
  
  // Update highlighted positions
  useEffect(() => {
    if (gameState.selectedPiece) {
      const validMoves = getValidMovesForPosition(gameState, gameState.selectedPiece);
      setHighlightedPositions(validMoves);
    } else if (gameState.phase === 'placement' && gameState.turn === 'goat') {
      const validPlacements: Position[] = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const position = { row, col };
          if (isValidIntersection(position) && gameState.board[row][col] === null) {
            validPlacements.push(position);
          }
        }
      }
      setHighlightedPositions(validPlacements);
    } else {
      setHighlightedPositions([]);
    }
  }, [gameState.selectedPiece, gameState.phase, gameState.turn, gameState.board]);
  
  // Handle intersection click
  const handleIntersectionClick = (position: Position) => {
    if (readOnly || gameState.winner) return;
    
    const { selectedPiece, turn, phase, board } = gameState;
    const clickedPiece = board[position.row][position.col];
    
    console.log('Intersection clicked:', position, 'Turn:', turn, 'Phase:', phase, 'Selected:', selectedPiece, 'Clicked piece:', clickedPiece);
    
    // If a piece is selected
    if (selectedPiece) {
      // Check if clicked position is a valid move
      if (highlightedPositions.some(pos => pos.row === position.row && pos.col === position.col)) {
        console.log('Making move from', selectedPiece, 'to', position);
        onMove({ from: selectedPiece, to: position });
        return;
      }
      
      // If clicked on another piece of current player, select it
      if (clickedPiece === turn) {
        console.log('Selecting new piece at', position);
        onMove({ 
          from: position, 
          to: position, 
          selection: true
        });
        return;
      }
      
      // Deselect if clicked elsewhere
      console.log('Deselecting piece');
      onMove({ 
        from: null, 
        to: position, 
        selection: true
      });
      return;
    }
    
    // No piece selected
    // Handle goat placement
    if (phase === 'placement' && turn === 'goat' && clickedPiece === null) {
      if (isValidMove(gameState, null, position)) {
        console.log('Making goat placement move');
        onMove({ from: null, to: position });
        return;
      }
    }
    
    // Handle piece selection
    if (clickedPiece === turn) {
      const validMoves = getValidMovesForPosition(gameState, position);
      console.log('Selecting piece at', position, 'with', validMoves.length, 'valid moves');
      onMove({ 
        from: position, 
        to: position, 
        selection: true
      });
      return;
    }
    
    console.log('No valid action for click at', position);
  };
  
  // Generate intersections
  const intersections = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const position = { row, col };
      
      if (isValidIntersection(position)) {
        const isHighlighted = highlightedPositions.some(
          pos => pos.row === row && pos.col === col
        );
        
        intersections.push(
          <circle
            key={`intersection-${row}-${col}`}
            cx={col * cellSize}
            cy={row * cellSize}
            r="8"
            fill={isHighlighted ? "#10B981" : "transparent"}
            stroke="#654321"
            strokeWidth="2"
            className="cursor-pointer hover:fill-gray-300"
            onClick={() => handleIntersectionClick(position)}
          />
        );
      }
    }
  }
  
  // Generate pieces
  const pieces = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = gameState.board[row][col];
      if (piece) {
        const isSelected = gameState.selectedPiece?.row === row && gameState.selectedPiece?.col === col;
        
        pieces.push(
          <GamePiece
            key={`piece-${row}-${col}`}
            type={piece}
            position={{ row, col }}
            cellSize={cellSize}
            isSelected={isSelected}
          />
        );
      }
    }
  }
  
  return (
    <div 
      className="relative bg-amber-50 rounded-lg shadow-xl border-4 border-amber-800"
      style={{ 
        width: `${boardSize + 40}px`, 
        height: `${boardSize + 40}px`,
        margin: '0 auto',
        padding: '20px'
      }}
    >
      <svg
        width={boardSize}
        height={boardSize}
        className="absolute top-5 left-5"
      >
        {generateBoardLines()}
        {intersections}
      </svg>
      
      {/* Pieces layer */}
      <div 
        className="absolute top-5 left-5"
        style={{ width: boardSize, height: boardSize }}
      >
        {pieces}
      </div>
    </div>
  );
};

export default GameBoard;
