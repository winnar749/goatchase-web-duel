
import React, { useState, useEffect } from "react";
import { GameState, Position, Player, Move } from "../types/game";
import { 
  isValidMove, 
  getValidMovesForPosition, 
  BOARD_SIZE,
  makeMove
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
  const [pieceAnimation, setPieceAnimation] = useState<string | null>(null);
  
  // Use a more responsive approach to sizing based on the viewport
  // Calculate board size relative to viewport, but with a maximum limit
  const viewportWidth = Math.min(window.innerWidth, 1200);
  const boardSizeMultiplier = viewportWidth < 768 ? 0.85 : 0.55; // Higher percentage on mobile
  const boardSize = Math.min(viewportWidth * boardSizeMultiplier, 380);
  const cellSize = boardSize / (BOARD_SIZE - 1);
  
  // Set up the grid lines
  const gridLines = [];
  
  // Horizontal lines
  for (let i = 0; i < BOARD_SIZE; i++) {
    gridLines.push(
      <div 
        key={`h-${i}`} 
        className="board-line horizontal-line" 
        style={{ 
          top: `${i * cellSize}px`, 
          left: 0, 
          width: `${boardSize}px`
        }} 
      />
    );
  }
  
  // Vertical lines
  for (let i = 0; i < BOARD_SIZE; i++) {
    gridLines.push(
      <div 
        key={`v-${i}`} 
        className="board-line vertical-line" 
        style={{ 
          left: `${i * cellSize}px`, 
          top: 0, 
          height: `${boardSize}px`
        }} 
      />
    );
  }
  
  // Diagonal lines
  gridLines.push(
    <div 
      key="d-1" 
      className="board-line diagonal-line" 
      style={{ 
        width: `${Math.sqrt(2) * boardSize}px`,
        transform: `translateX(-${(Math.sqrt(2) * boardSize - boardSize) / 2}px) rotate(45deg)`
      }} 
    />
  );
  gridLines.push(
    <div 
      key="d-2" 
      className="board-line diagonal-line" 
      style={{ 
        width: `${Math.sqrt(2) * boardSize}px`,
        transform: `translateX(-${(Math.sqrt(2) * boardSize - boardSize) / 2}px) rotate(-45deg)`
      }} 
    />
  );
  
  // Clear highlighted positions when turn changes or game state updates
  useEffect(() => {
    setHighlightedPositions([]);
  }, [gameState.turn, gameState.phase]);
  
  // Update highlighted positions when selected piece changes
  useEffect(() => {
    if (gameState.selectedPiece) {
      const validMoves = getValidMovesForPosition(gameState, gameState.selectedPiece);
      setHighlightedPositions(validMoves);
    } else {
      setHighlightedPositions([]);
    }
  }, [gameState.selectedPiece]);
  
  // Handle intersection click
  const handleIntersectionClick = (position: Position) => {
    if (readOnly || gameState.winner) return;
    
    const { selectedPiece, turn, phase } = gameState;
    
    // If it's placement phase for goats
    if (phase === 'placement' && turn === 'goat') {
      if (isValidMove(gameState, null, position)) {
        onMove({ from: null, to: position });
        return;
      }
    }
    
    // If a piece is already selected, check if the clicked position is a valid move
    if (selectedPiece) {
      // Check if the clicked position is a valid move
      if (highlightedPositions.some(pos => pos.row === position.row && pos.col === position.col)) {
        // Make the move
        onMove({ from: selectedPiece, to: position });
        return;
      }
      
      // If clicked on another own piece, select it instead
      const clickedPiece = gameState.board[position.row][position.col];
      if (clickedPiece === turn) {
        onMove({ 
          from: position, 
          to: position, 
          selection: true
        });
        return;
      }
      
      // If clicked elsewhere, deselect
      onMove({ 
        from: null, 
        to: position, 
        selection: true
      });
      return;
    }
    
    // If the clicked position contains a piece of the current player
    const clickedPiece = gameState.board[position.row][position.col];
    if (clickedPiece === turn) {
      // Select the piece and show valid moves
      const validMoves = getValidMovesForPosition(gameState, position);
      
      // Update game state with selected piece through onMove callback
      onMove({ 
        from: position, 
        to: position, 
        selection: true
      });
      return;
    }
  };
  
  // Generate board intersections
  const intersections = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const position = { row, col };
      
      // Check if this is a valid intersection
      if (row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1 || 
          row === col || row + col === BOARD_SIZE - 1 || 
          row === Math.floor(BOARD_SIZE / 2) || col === Math.floor(BOARD_SIZE / 2)) {
        
        // Check if this position is highlighted
        const isHighlighted = highlightedPositions.some(
          pos => pos.row === row && pos.col === col
        );
        
        intersections.push(
          <div 
            key={`intersection-${row}-${col}`}
            className={`board-intersection ${isHighlighted ? 'bg-game-highlight' : ''}`}
            style={{
              position: 'absolute',
              left: `${col * cellSize}px`,
              top: `${row * cellSize}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20
            }}
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
        // Check if this is the selected piece
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
      className="relative bg-game-board rounded-md shadow-xl"
      style={{ 
        width: `${boardSize}px`, 
        height: `${boardSize}px`,
        margin: '0 auto'
      }}
    >
      {/* Grid lines */}
      {gridLines}
      
      {/* Intersections */}
      {intersections}
      
      {/* Pieces */}
      {pieces}
    </div>
  );
};

export default GameBoard;
