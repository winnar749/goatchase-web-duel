
import * as ort from 'onnxruntime-web';
import { GameState, Move, Position } from '../types/game';
import { getValidMovesForPosition, isValidMove, BOARD_SIZE } from './game-logic';

export class AIService {
  private tigerModel: ort.InferenceSession | null = null;
  private goatModel: ort.InferenceSession | null = null;
  private isLoading = false;

  async loadModels(tigerModelUrl: string, goatModelUrl: string) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      console.log('Loading AI models...');
      console.log('Tiger model URL:', tigerModelUrl);
      console.log('Goat model URL:', goatModelUrl);
      
      // Load the ONNX models
      this.tigerModel = await ort.InferenceSession.create(tigerModelUrl);
      this.goatModel = await ort.InferenceSession.create(goatModelUrl);
      
      console.log('AI models loaded successfully');
      console.log('Tiger model input names:', this.tigerModel.inputNames);
      console.log('Goat model input names:', this.goatModel.inputNames);
    } catch (error) {
      console.error('Failed to load AI models:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private gameStateToInput(gameState: GameState): Float32Array {
    // Convert game state to model input format
    // Create a comprehensive input representation
    const boardSize = BOARD_SIZE * BOARD_SIZE;
    const additionalFeatures = 8;
    const input = new Float32Array(boardSize * 3 + additionalFeatures);
    
    let index = 0;
    
    // Channel 1: Goat positions (1 for goat, 0 for empty/tiger)
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        input[index++] = gameState.board[row][col] === 'goat' ? 1 : 0;
      }
    }
    
    // Channel 2: Tiger positions (1 for tiger, 0 for empty/goat)
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        input[index++] = gameState.board[row][col] === 'tiger' ? 1 : 0;
      }
    }
    
    // Channel 3: Empty positions (1 for empty, 0 for occupied)
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        input[index++] = gameState.board[row][col] === null ? 1 : 0;
      }
    }
    
    // Additional features
    input[index++] = gameState.phase === 'placement' ? 1 : 0;
    input[index++] = gameState.turn === 'goat' ? 1 : 0;
    input[index++] = gameState.turn === 'tiger' ? 1 : 0;
    input[index++] = gameState.goatsPlaced / 20; // Normalized
    input[index++] = gameState.goatsCaptured / 5; // Normalized
    input[index++] = gameState.moveHistory.length / 100; // Normalized move count
    input[index++] = gameState.selectedPiece ? 1 : 0;
    input[index++] = gameState.winner ? 1 : 0;
    
    return input;
  }

  private async runModelInference(model: ort.InferenceSession, input: Float32Array): Promise<Float32Array> {
    try {
      const inputName = model.inputNames[0];
      const feeds = { [inputName]: new ort.Tensor('float32', input, [1, input.length]) };
      const results = await model.run(feeds);
      
      const outputName = Object.keys(results)[0];
      const outputTensor = results[outputName];
      return outputTensor.data as Float32Array;
    } catch (error) {
      console.error('Model inference failed:', error);
      throw error;
    }
  }

  private outputToMove(output: Float32Array, gameState: GameState, player: 'tiger' | 'goat'): Move {
    console.log('Converting model output to move for player:', player);
    console.log('Output length:', output.length);
    
    if (gameState.phase === 'placement' && player === 'goat') {
      // Find valid placement positions
      const validPositions: Position[] = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const position = { row, col };
          if (isValidMove(gameState, null, position)) {
            validPositions.push(position);
          }
        }
      }
      
      if (validPositions.length === 0) {
        throw new Error('No valid placement positions');
      }
      
      // Use model output to select position
      // If output is action probabilities, find the best valid position
      let bestPosition = validPositions[0];
      let bestScore = -Infinity;
      
      for (const pos of validPositions) {
        const posIndex = pos.row * BOARD_SIZE + pos.col;
        if (posIndex < output.length) {
          const score = output[posIndex];
          if (score > bestScore) {
            bestScore = score;
            bestPosition = pos;
          }
        }
      }
      
      console.log('Selected placement position:', bestPosition, 'with score:', bestScore);
      return { from: null, to: bestPosition };
    } else {
      // Movement phase - find pieces and their valid moves
      const pieces: Position[] = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (gameState.board[row][col] === player) {
            pieces.push({ row, col });
          }
        }
      }
      
      let bestMove: Move | null = null;
      let bestScore = -Infinity;
      
      for (const piece of pieces) {
        const validMoves = getValidMovesForPosition(gameState, piece);
        for (const move of validMoves) {
          // Calculate move index in output
          const fromIndex = piece.row * BOARD_SIZE + piece.col;
          const toIndex = move.row * BOARD_SIZE + move.col;
          const moveIndex = fromIndex * BOARD_SIZE + toIndex;
          
          if (moveIndex < output.length) {
            const score = output[moveIndex];
            if (score > bestScore) {
              bestScore = score;
              bestMove = { from: piece, to: move };
            }
          }
        }
      }
      
      if (bestMove) {
        console.log('Selected move:', bestMove, 'with score:', bestScore);
        return bestMove;
      }
      
      // Fallback to first available move
      for (const piece of pieces) {
        const validMoves = getValidMovesForPosition(gameState, piece);
        if (validMoves.length > 0) {
          const fallbackMove = { from: piece, to: validMoves[0] };
          console.log('Using fallback move:', fallbackMove);
          return fallbackMove;
        }
      }
      
      throw new Error('No valid moves available');
    }
  }

  async getAIMove(gameState: GameState, player: 'tiger' | 'goat'): Promise<Move> {
    const model = player === 'tiger' ? this.tigerModel : this.goatModel;
    
    if (!model) {
      throw new Error(`${player} model not loaded`);
    }

    try {
      console.log(`Getting AI move for ${player}`);
      const input = this.gameStateToInput(gameState);
      console.log('Input tensor shape:', input.length);
      
      // Run inference
      const output = await this.runModelInference(model, input);
      console.log('Model output received, length:', output.length);
      
      return this.outputToMove(output, gameState, player);
    } catch (error) {
      console.error(`Error getting AI move for ${player}:`, error);
      // Fallback to random move
      return this.getRandomMove(gameState, player);
    }
  }

  private getRandomMove(gameState: GameState, player: 'tiger' | 'goat'): Move {
    console.log('Using random fallback move for', player);
    
    if (gameState.phase === 'placement' && player === 'goat') {
      const validPositions: Position[] = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const position = { row, col };
          if (isValidMove(gameState, null, position)) {
            validPositions.push(position);
          }
        }
      }
      
      if (validPositions.length === 0) {
        throw new Error('No valid placement positions');
      }
      
      const randomIndex = Math.floor(Math.random() * validPositions.length);
      return { from: null, to: validPositions[randomIndex] };
    } else {
      const pieces: Position[] = [];
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (gameState.board[row][col] === player) {
            pieces.push({ row, col });
          }
        }
      }
      
      for (const piece of pieces) {
        const validMoves = getValidMovesForPosition(gameState, piece);
        if (validMoves.length > 0) {
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          return { from: piece, to: randomMove };
        }
      }
      
      throw new Error('No valid moves available');
    }
  }

  isModelsLoaded(): boolean {
    return this.tigerModel !== null && this.goatModel !== null;
  }

  isLoading(): boolean {
    return this.isLoading;
  }
}

export const aiService = new AIService();
