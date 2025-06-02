
import * as ort from 'onnxruntime-web';
import { GameState, Move, Position } from '../types/game';
import { getValidMovesForPosition, isValidMove } from './game-logic';

export class AIService {
  private tigerModel: ort.InferenceSession | null = null;
  private goatModel: ort.InferenceSession | null = null;
  private isLoading = false;

  async loadModels(tigerModelUrl: string, goatModelUrl: string) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      console.log('Loading AI models...');
      
      // Load the ONNX models
      this.tigerModel = await ort.InferenceSession.create(tigerModelUrl);
      this.goatModel = await ort.InferenceSession.create(goatModelUrl);
      
      console.log('AI models loaded successfully');
    } catch (error) {
      console.error('Failed to load AI models:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private gameStateToInput(gameState: GameState): Float32Array {
    // Convert game state to model input format
    // This is a simple flattened representation - adjust based on your model's input format
    const input = new Float32Array(25 + 4); // 5x5 board + 4 additional features
    
    // Flatten the board (0 = empty, 1 = goat, -1 = tiger)
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = gameState.board[row][col];
        input[row * 5 + col] = piece === 'goat' ? 1 : piece === 'tiger' ? -1 : 0;
      }
    }
    
    // Add additional features
    input[25] = gameState.phase === 'placement' ? 1 : 0;
    input[26] = gameState.turn === 'goat' ? 1 : 0;
    input[27] = gameState.goatsPlaced / 20; // Normalized
    input[28] = gameState.goatsCaptured / 5; // Normalized
    
    return input;
  }

  private outputToMove(output: Float32Array, gameState: GameState, player: 'tiger' | 'goat'): Move {
    // Convert model output to a valid move
    // This assumes your model outputs action probabilities
    // Adjust based on your model's output format
    
    if (gameState.phase === 'placement' && player === 'goat') {
      // Find valid placement positions
      const validPositions: Position[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const position = { row, col };
          if (isValidMove(gameState, null, position)) {
            validPositions.push(position);
          }
        }
      }
      
      if (validPositions.length === 0) {
        throw new Error('No valid placement positions');
      }
      
      // Select position based on model output (simplified)
      const selectedIndex = Math.floor(Math.random() * validPositions.length);
      return { from: null, to: validPositions[selectedIndex] };
    } else {
      // Movement phase - find pieces and their valid moves
      const pieces: Position[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if (gameState.board[row][col] === player) {
            pieces.push({ row, col });
          }
        }
      }
      
      for (const piece of pieces) {
        const validMoves = getValidMovesForPosition(gameState, piece);
        if (validMoves.length > 0) {
          // Select move based on model output (simplified)
          const selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          return { from: piece, to: selectedMove };
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
      const input = this.gameStateToInput(gameState);
      
      // Run inference
      const feeds = { input: new ort.Tensor('float32', input, [1, input.length]) };
      const results = await model.run(feeds);
      
      // Get the output tensor
      const outputTensor = results[Object.keys(results)[0]];
      const output = outputTensor.data as Float32Array;
      
      return this.outputToMove(output, gameState, player);
    } catch (error) {
      console.error(`Error getting AI move for ${player}:`, error);
      // Fallback to random move
      return this.getRandomMove(gameState, player);
    }
  }

  private getRandomMove(gameState: GameState, player: 'tiger' | 'goat'): Move {
    if (gameState.phase === 'placement' && player === 'goat') {
      const validPositions: Position[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const position = { row, col };
          if (isValidMove(gameState, null, position)) {
            validPositions.push(position);
          }
        }
      }
      
      const randomIndex = Math.floor(Math.random() * validPositions.length);
      return { from: null, to: validPositions[randomIndex] };
    } else {
      const pieces: Position[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
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
}

export const aiService = new AIService();
