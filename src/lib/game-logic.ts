
import { GameState, Position, Player, Move } from "../types/game";

// Constants
export const BOARD_SIZE = 5;
export const TOTAL_GOATS = 20;
export const TIGERS_COUNT = 4;
export const GOATS_TO_WIN = 5;

// Initialize a new game state
export function initializeGameState(): GameState {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  // Place tigers at the corners
  board[0][0] = 'tiger';
  board[0][BOARD_SIZE - 1] = 'tiger';
  board[BOARD_SIZE - 1][0] = 'tiger';
  board[BOARD_SIZE - 1][BOARD_SIZE - 1] = 'tiger';
  
  return {
    board,
    phase: 'placement',
    turn: 'goat',
    goatsPlaced: 0,
    goatsCaptured: 0,
    selectedPiece: null,
    validMoves: [],
    moveHistory: [],
    winner: null
  };
}

// Check if a position is on the board
export function isValidPosition(position: Position): boolean {
  const { row, col } = position;
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

// Check if a position is a valid intersection on the board
export function isValidIntersection(position: Position): boolean {
  const { row, col } = position;
  
  // All positions on the outer edge are valid
  if (row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1) {
    return true;
  }
  
  // All positions on the diagonals are valid
  if (row === col || row + col === BOARD_SIZE - 1) {
    return true;
  }
  
  // Middle positions of each row and column are valid
  if (row === Math.floor(BOARD_SIZE / 2) || col === Math.floor(BOARD_SIZE / 2)) {
    return true;
  }
  
  return false;
}

// Get adjacent positions
export function getAdjacentPositions(position: Position): Position[] {
  const { row, col } = position;
  const adjacentPositions: Position[] = [];
  
  // Horizontal and vertical adjacents
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];
  
  // Add diagonal adjacents if on a diagonal intersection
  if (row === col || row + col === BOARD_SIZE - 1) {
    directions.push(
      { row: -1, col: -1 }, // top-left
      { row: -1, col: 1 },  // top-right
      { row: 1, col: -1 },  // bottom-left
      { row: 1, col: 1 }    // bottom-right
    );
  }
  
  for (const dir of directions) {
    const newPos = { row: row + dir.row, col: col + dir.col };
    if (isValidPosition(newPos) && isValidIntersection(newPos)) {
      adjacentPositions.push(newPos);
    }
  }
  
  return adjacentPositions;
}

// Check if a move is valid
export function isValidMove(gameState: GameState, from: Position | null, to: Position): boolean {
  const { board, phase, turn } = gameState;
  
  // Ensure the destination is a valid intersection
  if (!isValidIntersection(to)) {
    return false;
  }
  
  // Ensure the destination is empty
  if (board[to.row][to.col] !== null) {
    return false;
  }
  
  // Handle placement phase for goats
  if (phase === 'placement' && turn === 'goat') {
    return from === null; // In placement phase, 'from' should be null
  }
  
  // Handle movement phase
  if (from && phase === 'movement') {
    // Ensure 'from' position contains the current player's piece
    if (board[from.row][from.col] !== turn) {
      return false;
    }
    
    // For normal moves, check if the destination is adjacent
    const adjacentPositions = getAdjacentPositions(from);
    const isAdjacent = adjacentPositions.some(
      pos => pos.row === to.row && pos.col === to.col
    );
    
    if (isAdjacent) {
      return true;
    }
    
    // For tiger jumps, check if it's jumping over a goat
    if (turn === 'tiger') {
      // Calculate the middle position
      const middleRow = (from.row + to.row) / 2;
      const middleCol = (from.col + to.col) / 2;
      
      // Check if the middle position is a valid intersection and contains a goat
      if (
        Number.isInteger(middleRow) && 
        Number.isInteger(middleCol) && 
        isValidPosition({ row: middleRow, col: middleCol }) &&
        isValidIntersection({ row: middleRow, col: middleCol }) &&
        board[middleRow][middleCol] === 'goat'
      ) {
        return true;
      }
    }
  }
  
  return false;
}

// Get valid moves for a position
export function getValidMovesForPosition(gameState: GameState, position: Position): Position[] {
  const validMoves: Position[] = [];
  const { board } = gameState;
  
  // Ensure the position contains a piece
  const piece = board[position.row][position.col];
  if (!piece) {
    return [];
  }
  
  // Check adjacent positions for normal moves
  const adjacentPositions = getAdjacentPositions(position);
  for (const pos of adjacentPositions) {
    if (board[pos.row][pos.col] === null) {
      validMoves.push(pos);
    }
  }
  
  // For tigers, check if they can capture (jump over goats)
  if (piece === 'tiger') {
    // Check in all valid directions for possible jumps
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 },  // right
      { row: -1, col: -1 }, // top-left
      { row: -1, col: 1 },  // top-right
      { row: 1, col: -1 },  // bottom-left
      { row: 1, col: 1 }    // bottom-right
    ];
    
    for (const dir of directions) {
      // Check if there's a goat in this direction
      const midPos = {
        row: position.row + dir.row,
        col: position.col + dir.col
      };
      
      if (
        isValidPosition(midPos) && 
        isValidIntersection(midPos) && 
        board[midPos.row][midPos.col] === 'goat'
      ) {
        // Check if there's an empty space after the goat
        const jumpPos = {
          row: midPos.row + dir.row,
          col: midPos.col + dir.col
        };
        
        if (
          isValidPosition(jumpPos) && 
          isValidIntersection(jumpPos) && 
          board[jumpPos.row][jumpPos.col] === null
        ) {
          validMoves.push(jumpPos);
        }
      }
    }
  }
  
  return validMoves;
}

// Check if a tiger can capture any goat
export function canTigerCapture(gameState: GameState): boolean {
  const { board } = gameState;
  
  // Find all tigers
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === 'tiger') {
        const position = { row, col };
        const validMoves = getValidMovesForPosition(gameState, position);
        
        // Check if any valid move is a capture
        for (const move of validMoves) {
          // Calculate if it's a jump (capture)
          const deltaRow = Math.abs(move.row - row);
          const deltaCol = Math.abs(move.col - col);
          if (deltaRow > 1 || deltaCol > 1) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
}

// Check if a player is trapped (can't move)
export function isPlayerTrapped(gameState: GameState, player: Player): boolean {
  const { board } = gameState;
  
  // If it's placement phase for goats, they are not trapped
  if (player === 'goat' && gameState.phase === 'placement') {
    return false;
  }
  
  // Check each piece of the player
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === player) {
        const position = { row, col };
        const validMoves = getValidMovesForPosition(gameState, position);
        if (validMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Make a move and return the updated game state
export function makeMove(gameState: GameState, move: Move): GameState {
  // If this is just a selection, not an actual move
  if (move.selection) {
    return {
      ...gameState,
      selectedPiece: move.from
    };
  }
  
  const { from, to } = move;
  let { board, phase, turn, goatsPlaced, goatsCaptured, moveHistory, winner } = gameState;
  
  // Create a deep copy of the board
  const newBoard = board.map(row => [...row]);
  const newMoveHistory = [...moveHistory, move];
  let newCaptured = goatsCaptured;
  let capture: Position[] = [];
  let newPhase = phase;
  let newGoatsPlaced = goatsPlaced;
  
  // If in placement phase for goats
  if (phase === 'placement' && turn === 'goat' && from === null) {
    newBoard[to.row][to.col] = 'goat';
    newGoatsPlaced++;
    
    // Check if all goats have been placed
    if (newGoatsPlaced === TOTAL_GOATS) {
      newPhase = 'movement';
    }
  } else if (from) {
    // Movement phase - move the piece
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;
    
    // Check for tiger capture
    if (turn === 'tiger') {
      const deltaRow = Math.abs(to.row - from.row);
      const deltaCol = Math.abs(to.col - from.col);
      
      if (deltaRow > 1 || deltaCol > 1) {
        // It's a jump, so there's a capture
        const midRow = (from.row + to.row) / 2;
        const midCol = (from.col + to.col) / 2;
        
        if (Number.isInteger(midRow) && Number.isInteger(midCol) && newBoard[midRow][midCol] === 'goat') {
          newBoard[midRow][midCol] = null;
          newCaptured++;
          capture = [{ row: midRow, col: midCol }];
        }
      }
    }
  }
  
  // Update move with capture information
  if (capture.length > 0) {
    newMoveHistory[newMoveHistory.length - 1].capture = capture;
  }
  
  // Check win conditions
  if (newCaptured >= GOATS_TO_WIN) {
    winner = 'tiger';
  } else if (newPhase === 'movement' && isPlayerTrapped({ ...gameState, board: newBoard, turn: 'tiger' }, 'tiger')) {
    winner = 'goat';
  }
  
  // Switch turns
  let newTurn = turn;
  if (phase === 'placement' && turn === 'goat') {
    // In placement phase, after goat places, it's tiger's turn (but tigers don't place)
    // So we switch to tiger only if we're moving to movement phase
    if (newPhase === 'movement') {
      newTurn = 'tiger';
    } else {
      // Stay with goat for next placement
      newTurn = 'goat';
    }
  } else {
    // In movement phase, switch turns normally
    newTurn = turn === 'goat' ? 'tiger' : 'goat';
  }
  
  return {
    board: newBoard,
    phase: newPhase,
    turn: newTurn,
    goatsPlaced: newGoatsPlaced,
    goatsCaptured: newCaptured,
    selectedPiece: null,
    validMoves: [],
    moveHistory: newMoveHistory,
    winner
  };
}

// Minimax AI for easy difficulty (can be replaced with more advanced AI)
export function getAIMoveEasy(gameState: GameState): Move {
  const { phase, turn } = gameState;
  
  if (phase === 'placement' && turn === 'goat') {
    // Random placement for goats
    const emptyPositions: Position[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const position = { row, col };
        if (gameState.board[row][col] === null && isValidIntersection(position)) {
          emptyPositions.push(position);
        }
      }
    }
    
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    return { from: null, to: emptyPositions[randomIndex] };
  } else {
    // Find all pieces of the current player
    const pieces: Position[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (gameState.board[row][col] === turn) {
          pieces.push({ row, col });
        }
      }
    }
    
    // Shuffle pieces for randomness
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    // Find the first piece with valid moves
    for (const piece of pieces) {
      const validMoves = getValidMovesForPosition(gameState, piece);
      if (validMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        return { from: piece, to: validMoves[randomIndex] };
      }
    }
    
    // If no valid moves (shouldn't happen), return a dummy move
    return { from: pieces[0], to: pieces[0] };
  }
}

// Add new AI move function that uses custom models
export async function getAIMoveCustom(gameState: GameState, player: 'tiger' | 'goat'): Promise<Move> {
  const { aiService } = await import('./ai-service');
  
  if (aiService.isModelsLoaded()) {
    return await aiService.getAIMove(gameState, player);
  } else {
    // Fallback to easy AI if models aren't loaded
    console.warn('Custom AI models not loaded, using fallback AI');
    return getAIMoveEasy(gameState);
  }
}
