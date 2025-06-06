
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
    turn: 'goat', // Goats start first in placement phase
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

// Get adjacent positions with proper connectivity
export function getAdjacentPositions(position: Position): Position[] {
  const { row, col } = position;
  const adjacentPositions: Position[] = [];
  
  // Basic directions (horizontal and vertical)
  const basicDirections = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];
  
  // Add basic adjacent positions
  for (const dir of basicDirections) {
    const newPos = { row: row + dir.row, col: col + dir.col };
    if (isValidPosition(newPos) && isValidIntersection(newPos)) {
      adjacentPositions.push(newPos);
    }
  }
  
  // Add diagonal adjacents based on position
  const diagonalDirections = [
    { row: -1, col: -1 }, // top-left
    { row: -1, col: 1 },  // top-right
    { row: 1, col: -1 },  // bottom-left
    { row: 1, col: 1 }    // bottom-right
  ];
  
  // Diagonal moves are valid from certain positions
  const isDiagonalPosition = (row === col) || (row + col === BOARD_SIZE - 1) || 
                            (row === Math.floor(BOARD_SIZE / 2) && col === Math.floor(BOARD_SIZE / 2));
  
  if (isDiagonalPosition) {
    for (const dir of diagonalDirections) {
      const newPos = { row: row + dir.row, col: col + dir.col };
      if (isValidPosition(newPos) && isValidIntersection(newPos)) {
        // Check if the diagonal connection is valid
        const targetIsDiagonal = (newPos.row === newPos.col) || (newPos.row + newPos.col === BOARD_SIZE - 1);
        if (targetIsDiagonal || newPos.row === Math.floor(BOARD_SIZE / 2) || newPos.col === Math.floor(BOARD_SIZE / 2)) {
          adjacentPositions.push(newPos);
        }
      }
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
  
  // Handle goat placement during placement phase
  if (phase === 'placement' && turn === 'goat' && from === null) {
    return gameState.goatsPlaced < TOTAL_GOATS;
  }
  
  // Handle movement (for both tigers and goats)
  if (from) {
    // Ensure 'from' position contains the current player's piece
    if (board[from.row][from.col] !== turn) {
      return false;
    }
    
    // Tigers can always move (during placement and movement phases)
    // Goats can move only during movement phase (after all goats are placed)
    if (turn === 'goat' && phase === 'placement') {
      return false; // Goats cannot move during placement phase
    }
    
    // Check for normal adjacent moves
    const adjacentPositions = getAdjacentPositions(from);
    const isAdjacent = adjacentPositions.some(
      pos => pos.row === to.row && pos.col === to.col
    );
    
    if (isAdjacent) {
      return true;
    }
    
    // Check for tiger jumps (captures)
    if (turn === 'tiger') {
      return isValidTigerJump(gameState, from, to);
    }
  }
  
  return false;
}

// Check if a tiger jump is valid
function isValidTigerJump(gameState: GameState, from: Position, to: Position): boolean {
  const { board } = gameState;
  
  // Calculate direction and distance
  const deltaRow = to.row - from.row;
  const deltaCol = to.col - from.col;
  
  // Must be exactly 2 steps in one or both directions
  if (Math.abs(deltaRow) > 2 || Math.abs(deltaCol) > 2) {
    return false;
  }
  
  // Must be jumping over exactly one position
  if (Math.abs(deltaRow) !== 2 && Math.abs(deltaCol) !== 2 && 
      !(Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 0) &&
      !(Math.abs(deltaRow) === 0 && Math.abs(deltaCol) === 2)) {
    return false;
  }
  
  // Calculate the middle position
  const middleRow = from.row + Math.sign(deltaRow);
  const middleCol = from.col + Math.sign(deltaCol);
  const middlePos = { row: middleRow, col: middleCol };
  
  // Check if middle position is valid and contains a goat
  if (!isValidIntersection(middlePos) || board[middleRow][middleCol] !== 'goat') {
    return false;
  }
  
  // Check if the jump path is valid (both positions must be connected)
  const adjacentToFrom = getAdjacentPositions(from);
  const middleIsAdjacentToFrom = adjacentToFrom.some(pos => pos.row === middleRow && pos.col === middleCol);
  
  const adjacentToMiddle = getAdjacentPositions(middlePos);
  const toIsAdjacentToMiddle = adjacentToMiddle.some(pos => pos.row === to.row && pos.col === to.col);
  
  return middleIsAdjacentToFrom && toIsAdjacentToMiddle;
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
  
  // For tigers, check for possible jumps
  if (piece === 'tiger') {
    // Check all possible jump positions
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const jumpTo = { row, col };
        if (board[row][col] === null && isValidTigerJump(gameState, position, jumpTo)) {
          validMoves.push(jumpTo);
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
          if (isValidTigerJump(gameState, position, move)) {
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
  console.log('Making move:', move, 'Current turn:', gameState.turn, 'Phase:', gameState.phase);
  
  // If this is just a selection, not an actual move
  if (move.selection) {
    console.log('Selection move, updating selected piece to:', move.from);
    return {
      ...gameState,
      selectedPiece: move.from
    };
  }
  
  const { from, to } = move;
  let newGameState = { ...gameState };
  
  // Create a deep copy of the board
  const newBoard = gameState.board.map(row => [...row]);
  const newMoveHistory = [...gameState.moveHistory, move];
  let newCaptured = gameState.goatsCaptured;
  let capture: Position[] = [];
  
  // Handle placement phase for goats
  if (gameState.phase === 'placement' && gameState.turn === 'goat' && from === null) {
    console.log('Placing goat at:', to);
    newBoard[to.row][to.col] = 'goat';
    newGameState.goatsPlaced++;
    
    // Check if all goats have been placed
    if (newGameState.goatsPlaced === TOTAL_GOATS) {
      console.log('All goats placed, switching to movement phase');
      newGameState.phase = 'movement';
    }
    
    // Switch turn to tiger
    newGameState.turn = 'tiger';
    console.log('Switching turn to tiger');
  } 
  // Handle movement (tigers during placement or any piece during movement)
  else if (from) {
    console.log('Moving piece from', from, 'to', to);
    // Move the piece
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;
    
    // Check for tiger capture
    if (gameState.turn === 'tiger' && isValidTigerJump(gameState, from, to)) {
      const deltaRow = to.row - from.row;
      const deltaCol = to.col - from.col;
      const midRow = from.row + Math.sign(deltaRow);
      const midCol = from.col + Math.sign(deltaCol);
      
      console.log('Tiger jump detected, capturing goat at:', { row: midRow, col: midCol });
      if (newBoard[midRow][midCol] === 'goat') {
        newBoard[midRow][midCol] = null;
        newCaptured++;
        capture = [{ row: midRow, col: midCol }];
      }
    }
    
    // Switch turns
    newGameState.turn = gameState.turn === 'goat' ? 'tiger' : 'goat';
    console.log('Switching turn to:', newGameState.turn);
  }
  
  // Update move with capture information
  if (capture.length > 0) {
    newMoveHistory[newMoveHistory.length - 1].capture = capture;
  }
  
  // Check win conditions
  let winner = null;
  if (newCaptured >= GOATS_TO_WIN) {
    winner = 'tiger';
    console.log('Tigers win by capturing enough goats');
  } else if (newGameState.phase === 'movement' && isPlayerTrapped({ ...newGameState, board: newBoard, turn: 'tiger' }, 'tiger')) {
    winner = 'goat';
    console.log('Goats win by trapping tigers');
  }
  
  return {
    ...newGameState,
    board: newBoard,
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
  try {
    const { aiService } = await import('./ai-service');
    
    if (aiService.isModelsLoaded()) {
      console.log(`Using ONNX model for ${player} move`);
      return await aiService.getAIMove(gameState, player);
    } else if (aiService.isLoading()) {
      console.log('Models are still loading, using fallback AI');
      return getAIMoveEasy(gameState);
    } else {
      throw new Error('Models not loaded');
    }
  } catch (error) {
    console.error(`Error getting AI move for ${player}:`, error);
    console.log('Falling back to easy AI');
    return getAIMoveEasy(gameState);
  }
}

// Enhanced AI move function that tries different difficulty levels
export async function getAIMoveAdvanced(gameState: GameState, player: 'tiger' | 'goat', difficulty: string = 'easy'): Promise<Move> {
  try {
    switch (difficulty) {
      case 'custom':
        return await getAIMoveCustom(gameState, player);
      case 'hard':
        // For now, use custom models for hard difficulty too
        return await getAIMoveCustom(gameState, player);
      case 'medium':
        // Enhanced easy AI with some strategic thinking
        return getAIMoveStrategic(gameState, player);
      case 'easy':
      default:
        return getAIMoveEasy(gameState);
    }
  } catch (error) {
    console.error('Advanced AI move failed, using easy AI:', error);
    return getAIMoveEasy(gameState);
  }
}

// Strategic AI that considers captures and blocks
function getAIMoveStrategic(gameState: GameState, player: 'tiger' | 'goat'): Move {
  const { phase, turn } = gameState;
  
  if (phase === 'placement' && player === 'goat') {
    // Strategic placement: try to block tigers or create defensive positions
    const emptyPositions: Position[] = [];
    const strategicPositions: Position[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const position = { row, col };
        if (gameState.board[row][col] === null && isValidIntersection(position)) {
          emptyPositions.push(position);
          
          // Prefer center and edge positions
          if (row === 2 && col === 2) {
            strategicPositions.push(position);
          } else if (row === 0 || row === 4 || col === 0 || col === 4) {
            strategicPositions.push(position);
          }
        }
      }
    }
    
    const positions = strategicPositions.length > 0 ? strategicPositions : emptyPositions;
    const randomIndex = Math.floor(Math.random() * positions.length);
    return { from: null, to: positions[randomIndex] };
  } else {
    // Strategic movement: prioritize captures for tigers, blocks for goats
    const pieces: Position[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (gameState.board[row][col] === player) {
          pieces.push({ row, col });
        }
      }
    }
    
    // For tigers, prioritize captures
    if (player === 'tiger') {
      for (const piece of pieces) {
        const validMoves = getValidMovesForPosition(gameState, piece);
        for (const move of validMoves) {
          if (isValidTigerJump(gameState, piece, move)) {
            return { from: piece, to: move };
          }
        }
      }
    }
    
    // Find any valid move
    for (const piece of pieces) {
      const validMoves = getValidMovesForPosition(gameState, piece);
      if (validMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        return { from: piece, to: validMoves[randomIndex] };
      }
    }
    
    // Fallback
    return { from: pieces[0], to: pieces[0] };
  }
}
