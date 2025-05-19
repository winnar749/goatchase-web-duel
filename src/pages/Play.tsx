import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";
import GameSettingsDialog from "@/components/GameSettings";
import ShareGame from "@/components/ShareGame";
import { initializeGameState, makeMove, getAIMoveEasy } from "@/lib/game-logic";
import { GameState, GameSettings, Move } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, PlayIcon } from "lucide-react";

const Play: React.FC = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  // Game state and settings
  const [gameState, setGameState] = useState<GameState>(initializeGameState());
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    mode: "local"
  });
  const [previousStates, setPreviousStates] = useState<GameState[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Timer state
  const [tigerTime, setTigerTime] = useState(600); // 10 minutes in seconds
  const [goatTime, setGoatTime] = useState(600);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  // Load game from URL if gameId is present
  useEffect(() => {
    if (gameId) {
      // In a real implementation, this would load the game state from the server
      toast.info(`Joining game ${gameId}`);
      
      if (gameId === "ai") {
        setGameSettings({ 
          mode: "ai", 
          difficulty: "easy", 
          aiModel: "dqn",
          playerSide: "goat" 
        });
      } else if (gameId === "local") {
        setGameSettings({ mode: "local" });
      } else if (gameId === "online") {
        setGameSettings({ mode: "online" });
      }
    } else {
      // Show settings dialog by default when no gameId
      setShowSettings(true);
    }
  }, [gameId]);
  
  // Timer logic
  useEffect(() => {
    // Only run timer when game is started and not paused
    if (gameStarted && !isPaused && !gameState.winner) {
      timerIntervalRef.current = setInterval(() => {
        if (gameState.turn === 'tiger') {
          setTigerTime(prevTime => Math.max(0, prevTime - 1));
        } else {
          setGoatTime(prevTime => Math.max(0, prevTime - 1));
        }
      }, 1000);
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameStarted, isPaused, gameState.turn, gameState.winner]);
  
  // Check for timer expiration
  useEffect(() => {
    if (tigerTime === 0) {
      toast.error("Time's up! Goats win!");
      setGameState({ ...gameState, winner: 'goat' });
    } else if (goatTime === 0) {
      toast.error("Time's up! Tigers win!");
      setGameState({ ...gameState, winner: 'tiger' });
    }
  }, [tigerTime, goatTime, gameState]);
  
  // AI move logic
  useEffect(() => {
    // Only make AI moves if game has started, it's AI mode, it's AI's turn, and game is not paused
    if (
      gameStarted &&
      gameSettings.mode === "ai" && 
      gameSettings.playerSide !== gameState.turn && 
      !isPaused &&
      !gameState.winner
    ) {
      // Add a small delay to make it feel more natural
      const timeoutId = setTimeout(() => {
        // Get AI move based on difficulty
        let aiMove: Move;
        
        if (gameSettings.difficulty === "easy") {
          aiMove = getAIMoveEasy(gameState);
        } else {
          // For medium and hard, we'd use the more advanced models
          // but for now, let's use the easy AI
          aiMove = getAIMoveEasy(gameState);
        }
        
        handleMove(aiMove);
      }, 700);
      
      return () => clearTimeout(timeoutId);
    }
  }, [gameState, gameSettings, isPaused, gameStarted]);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle game moves
  const handleMove = (move: Move) => {
    if (isPaused || gameState.winner || !gameStarted) return;
    
    // Check if this is just a selection, not an actual move
    if (move.selection) {
      // If selecting null, it means deselect
      if (move.from === null) {
        setGameState({
          ...gameState,
          selectedPiece: null
        });
        return;
      }
      
      // Just update the selected piece without changing turn or other state
      setGameState({
        ...gameState,
        selectedPiece: move.from
      });
      return;
    }
    
    // For actual moves
    if (move.from && move.to && move.from.row === move.to.row && move.from.col === move.to.col) {
      // This is just selecting a piece, not making a move
      return;
    }
    
    // Save current state for undo
    setPreviousStates(prev => [...prev, gameState]);
    
    // Make the move
    const newState = makeMove(gameState, move);
    setGameState(newState);
    
    // Check for winner
    if (newState.winner) {
      toast.success(`Game Over! ${newState.winner === 'tiger' ? 'Tigers' : 'Goats'} Win!`);
    }
  };
  
  // Game control handlers
  const handleUndo = () => {
    if (previousStates.length === 0) return;
    
    // Pop the last state
    const lastState = previousStates.pop();
    setPreviousStates([...previousStates]);
    
    // Set it as current state
    if (lastState) {
      setGameState(lastState);
      toast.info("Move undone");
    }
  };
  
  const handleReset = () => {
    setGameState(initializeGameState());
    setPreviousStates([]);
    setTigerTime(600);
    setGoatTime(600);
    setGameStarted(false);
    toast.info("Game reset");
  };
  
  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Game resumed" : "Game paused");
  };
  
  const handleShare = () => {
    setShowShare(true);
  };
  
  const handleStartGame = () => {
    setGameStarted(true);
    toast.success("Game started!");
  };
  
  const handleSettingsChange = (newSettings: GameSettings) => {
    setGameSettings(newSettings);
    handleReset();
    
    // Update URL based on game mode
    if (newSettings.mode === "ai") {
      navigate("/play/ai");
    } else if (newSettings.mode === "local") {
      navigate("/play/local");
    } else if (newSettings.mode === "online") {
      navigate("/play/online");
    }
    
    toast.success(`Game mode set to ${newSettings.mode}`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-4">
        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center space-y-8 mt-10">
            <h1 className="text-4xl font-bold text-center">
              Welcome to BaghChal AI
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              <Card className="p-6 hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => {
                setGameSettings({ mode: "local" });
                setShowSettings(true);
              }}>
                <h2 className="text-xl font-bold mb-2">Play Locally</h2>
                <p className="text-muted-foreground">Play against a friend on the same device</p>
              </Card>
              
              <Card className="p-6 hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => {
                setGameSettings({ mode: "ai", difficulty: "easy", aiModel: "dqn", playerSide: "goat" });
                setShowSettings(true);
              }}>
                <h2 className="text-xl font-bold mb-2">Play vs AI</h2>
                <p className="text-muted-foreground">Challenge our reinforcement learning AI</p>
              </Card>
              
              <Card className="p-6 hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => {
                setGameSettings({ mode: "online" });
                setShowSettings(true);
              }}>
                <h2 className="text-xl font-bold mb-2">Play Online</h2>
                <p className="text-muted-foreground">Play with friends online by sharing a link</p>
              </Card>
            </div>
            
            <Button size="lg" onClick={() => setShowSettings(true)} className="mt-4">
              <PlayIcon className="mr-2 h-4 w-4" /> Start New Game
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Game info sidebar - left side */}
            <div className="w-full md:w-64 lg:w-72 space-y-3">
              {/* Game mode and timer header */}
              <Card className="p-3">
                <h2 className="text-xl font-bold mb-2">
                  {gameSettings.mode === "local" ? "Local Game" : 
                  gameSettings.mode === "ai" ? `AI (${gameSettings.aiModel})` :
                  "Online Game"}
                </h2>
                
                {/* Timer display */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${gameState.turn === 'tiger' ? 'bg-game-tiger animate-pulse' : 'bg-gray-300'} mr-2`}></div>
                      <span className="text-muted-foreground">Tigers</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className={`font-mono ${tigerTime < 60 ? 'text-red-500' : ''}`}>
                        {formatTime(tigerTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${gameState.turn === 'goat' ? 'bg-game-goat animate-pulse' : 'bg-gray-300'} mr-2`}></div>
                      <span className="text-muted-foreground">Goats</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className={`font-mono ${goatTime < 60 ? 'text-red-500' : ''}`}>
                        {formatTime(goatTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Game status */}
              <Card className="p-3">
                <div className="text-center font-medium bg-secondary p-2 rounded-md">
                  {gameState.winner ? 
                    `Game Over - ${gameState.winner === 'tiger' ? 'Tigers' : 'Goats'} Win!` : 
                    `${gameState.turn === 'tiger' ? 'Tigers' : 'Goats'} Turn ${
                    gameState.phase === 'placement' ? 
                      `- Placement (${gameState.goatsPlaced}/20)` : 
                      '- Movement'
                    }`
                  }
                </div>
              </Card>
              
              {/* Game statistics */}
              <Card className="p-3">
                <h3 className="font-medium mb-2">Game Statistics</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Goats Placed:</span>
                    <span className="font-medium">{gameState.goatsPlaced}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Goats Captured:</span>
                    <span className="font-medium">{gameState.goatsCaptured}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phase:</span>
                    <span className="font-medium">{gameState.phase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moves Made:</span>
                    <span className="font-medium">{gameState.moveHistory.length}</span>
                  </div>
                </div>
              </Card>
              
              {/* Game controls */}
              <Card className="p-3">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={handleUndo} disabled={previousStates.length === 0}>
                    Undo
                  </Button>
                  <Button size="sm" variant="outline" onClick={handlePause}>
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowSettings(true)}>
                    Settings
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleShare}>
                    Share
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Game Board - center/right side */}
            <div className="flex-1 flex flex-col">
              <div className="bg-card p-4 rounded-lg flex flex-col items-center">
                <GameBoard 
                  gameState={gameState}
                  onMove={handleMove}
                  readOnly={isPaused}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Dialogs */}
        <GameSettingsDialog 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={gameSettings}
          onSettingsChange={handleSettingsChange}
          onStartGame={handleStartGame}
        />
        
        <ShareGame 
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          gameId={gameId}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Play;
