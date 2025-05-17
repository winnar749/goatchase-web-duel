
export type Player = 'goat' | 'tiger';
export type GamePhase = 'placement' | 'movement';
export type GameMode = 'local' | 'ai' | 'online';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameAIModel = 'dqn' | 'ppo';

export type Position = {
  row: number;
  col: number;
};

export type Move = {
  from: Position | null; // null for placement phase
  to: Position;
  capture?: Position[]; // positions of captured pieces
};

export type GamePiece = {
  type: Player;
  position: Position;
  id: string;
};

export type GameState = {
  board: (Player | null)[][];
  phase: GamePhase;
  turn: Player;
  goatsPlaced: number;
  goatsCaptured: number;
  selectedPiece: Position | null;
  validMoves: Position[];
  moveHistory: Move[];
  winner: Player | null;
};

export type GameSettings = {
  mode: GameMode;
  difficulty?: GameDifficulty;
  aiModel?: GameAIModel;
  playerSide?: Player;
};
