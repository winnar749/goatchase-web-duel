
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
  
  // Use a more responsive approach to sizing based on the viewport
  const viewportWidth = Math.min(window.innerWidth, 1200);
  const boardSizeMultiplier = viewportWidth < 768 ? 0.85 : 0.55;
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
  
  // Update highlighted positions when selected piece changes or for placement phase
  useEffect(() => {
    if (gameState.selectedPiece) {
      // Show valid moves for the selected piece
      const validMoves = getValidMovesForPosition(gameState, gameState.selectedPiece);
      console.log('Valid moves for selected piece:', validMoves);
      setHighlightedPositions(validMoves);
    } else if (gameState.phase === 'placement' && gameState.turn === 'goat') {
      // Show all valid placement positions for goats
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
    
    const { selectedPiece, turn, phase } = gameState;
    
    console.log('Intersection clicked:', position, 'Turn:', turn, 'Phase:', phase, 'Selected:', selectedPiece);
    
    // If it's placement phase for goats
    if (phase === 'placement' && turn === 'goat') {
      if (isValidMove(gameState, null, position)) {
        console.log('Making goat placement move');
        onMove({ from: null, to: position });
        return;
      }
    }
    
    // If a piece is already selected
    if (selectedPiece) {
      // Check if the clicked position is a valid move
      if (highlightedPositions.some(pos => pos.row === position.row && pos.col === position.col)) {
        // Make the move
        console.log('Making move from', selectedPiece, 'to', position);
        onMove({ from: selectedPiece, to: position });
        return;
      }
      
      // If clicked on another own piece, select it instead
      const clickedPiece = gameState.board[position.row][position.col];
      if (clickedPiece === turn) {
        console.log('Selecting new piece at', position);
        onMove({ 
          from: position, 
          to: position, 
          selection: true
        });
        return;
      }
      
      // If clicked elsewhere, deselect
      console.log('Deselecting piece');
      onMove({ 
        from: null, 
        to: position, 
        selection: true
      });
      return;
    }
    
    // If no piece is selected, check if clicking on current player's piece
    const clickedPiece = gameState.board[position.row][position.col];
    if (clickedPiece === turn) {
      // Select the piece
      console.log('Selecting piece at', position, 'for player', turn);
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
      if (isValidIntersection(position)) {
        // Check if this position is highlighted (valid move)
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
              zIndex: 20,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
            onClick={() => handleIntersectionClick(position)}
          >
            {/* Add green point for valid moves */}
            {isHighlighted && (
              <div 
                className="valid-move-indicator" 
                style={{
                  position: 'absolute',
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#10B981', // Green color for the indicator
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%',
                  boxShadow: '0 0 5px rgba(16, 185, 129, 0.7)',
                  zIndex: 25
                }}
              />
            )}
          </div>
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
