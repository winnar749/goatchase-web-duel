
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
          position: 'absolute',
          top: `${i * cellSize}px`, 
          left: 0, 
          width: `${boardSize}px`,
          height: '2px',
          backgroundColor: '#8b4513',
          zIndex: 10
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
          position: 'absolute',
          left: `${i * cellSize}px`, 
          top: 0, 
          height: `${boardSize}px`,
          width: '2px',
          backgroundColor: '#8b4513',
          zIndex: 10
        }} 
      />
    );
  }
  
  // Main diagonal lines (center cross)
  gridLines.push(
    <div 
      key="d-main-1" 
      className="board-line diagonal-line" 
      style={{ 
        position: 'absolute',
        width: `${Math.sqrt(2) * boardSize}px`,
        height: '2px',
        backgroundColor: '#8b4513',
        left: '50%',
        top: '50%',
        transformOrigin: 'center',
        transform: `translate(-50%, -50%) rotate(45deg)`,
        zIndex: 10
      }} 
    />
  );
  gridLines.push(
    <div 
      key="d-main-2" 
      className="board-line diagonal-line" 
      style={{ 
        position: 'absolute',
        width: `${Math.sqrt(2) * boardSize}px`,
        height: '2px',
        backgroundColor: '#8b4513',
        left: '50%',
        top: '50%',
        transformOrigin: 'center',
        transform: `translate(-50%, -50%) rotate(-45deg)`,
        zIndex: 10
      }} 
    />
  );
  
  // Corner diagonal lines
  // Top-left to top-right diagonal
  gridLines.push(
    <div 
      key="corner-diag-1" 
      className="board-line diagonal-line" 
      style={{ 
        position: 'absolute',
        width: `${boardSize}px`,
        height: '2px',
        backgroundColor: '#8b4513',
        left: '0px',
        top: '0px',
        transformOrigin: 'left',
        transform: `rotate(${Math.atan2(cellSize, boardSize) * 180 / Math.PI}deg)`,
        zIndex: 10
      }} 
    />
  );
  
  // Top-left to bottom-left diagonal
  gridLines.push(
    <div 
      key="corner-diag-2" 
      className="board-line diagonal-line" 
      style={{ 
        position: 'absolute',
        width: `${boardSize}px`,
        height: '2px',
        backgroundColor: '#8b4513',
        left: '0px',
        top: '0px',
        transformOrigin: 'left',
        transform: `rotate(${Math.atan2(boardSize, cellSize) * 180 / Math.PI}deg)`,
        zIndex: 10
      }} 
    />
  );
  
  // Top-right to bottom-right diagonal
  gridLines.push(
    <div 
      key="corner-diag-3" 
      className="board-line diagonal-line" 
      style={{ 
        position: 'absolute',
        width: `${boardSize}px`,
        height: '2px',
        backgroundColor: '#8b4513',
        left: `${boardSize}px`,
        top: '0px',
        transformOrigin: 'left',
        transform: `rotate(${Math.atan2(boardSize, -cellSize) * 180 / Math.PI}deg)`,
        zIndex: 10
      }} 
    />
  );
  
  // Bottom-left to bottom-right diagonal
  gridLines.push(
    <div 
      key="corner-diag-4" 
      className="board-line diagonal-line" 
      style={{ 
        position: 'absolute',
        width: `${boardSize}px`,
        height: '2px',
        backgroundColor: '#8b4513',
        left: '0px',
        top: `${boardSize}px`,
        transformOrigin: 'left',
        transform: `rotate(${Math.atan2(-cellSize, boardSize) * 180 / Math.PI}deg)`,
        zIndex: 10
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
      // Show valid moves for the selected piece (works for both tigers and goats)
      const validMoves = getValidMovesForPosition(gameState, gameState.selectedPiece);
      console.log('Valid moves for selected piece:', validMoves, 'Player:', gameState.board[gameState.selectedPiece.row][gameState.selectedPiece.col]);
      setHighlightedPositions(validMoves);
    } else if (gameState.phase === 'placement' && gameState.turn === 'goat') {
      // Show all valid placement positions for goats during placement
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
    
    // If a piece is already selected
    if (selectedPiece) {
      // Check if the clicked position is a valid move
      if (highlightedPositions.some(pos => pos.row === position.row && pos.col === position.col)) {
        // Make the move
        console.log('Making move from', selectedPiece, 'to', position);
        onMove({ from: selectedPiece, to: position });
        return;
      }
      
      // If clicked on another piece of the current player, select it instead
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
    
    // No piece is selected
    // Handle goat placement during placement phase
    if (phase === 'placement' && turn === 'goat' && clickedPiece === null) {
      if (isValidMove(gameState, null, position)) {
        console.log('Making goat placement move');
        onMove({ from: null, to: position });
        return;
      }
    }
    
    // Handle piece selection for both tigers and goats
    if (clickedPiece === turn) {
      // Always allow selection, even if no moves available (for better UX)
      console.log('Selecting piece at', position, 'for player', turn);
      onMove({ 
        from: position, 
        to: position, 
        selection: true
      });
      return;
    }
    
    console.log('No valid action for click at', position);
  };

  // Handle piece click (for direct piece interaction)
  const handlePieceClick = (position: Position, piece: Player) => {
    if (readOnly || gameState.winner) return;
    
    console.log('Piece clicked:', position, 'Piece:', piece, 'Current turn:', gameState.turn);
    
    // Only allow clicking pieces of the current player
    if (piece === gameState.turn) {
      console.log('Selecting piece at', position, 'for player', piece);
      onMove({ 
        from: position, 
        to: position, 
        selection: true
      });
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
            onClick={() => handlePieceClick({ row, col }, piece)}
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
