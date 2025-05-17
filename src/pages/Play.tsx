
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";
import GameInfo from "@/components/GameInfo";
import GameSettingsDialog from "@/components/GameSettings";
import ShareGame from "@/components/ShareGame";
import { initializeGameState, makeMove, getAIMoveEasy } from "@/lib/game-logic";
import { GameState, GameSettings, Move } from "@/types/game";

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
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  // Load game from URL if gameId is present
  useEffect(() => {
    if (gameId) {
      // In a real implementation, this would load the game state from the server
      // For now, we'll just show a toast message
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
        // In a real implementation, this would connect to a websocket
      }
    }
  }, [gameId]);
  
  // AI move logic
  useEffect(() => {
    // Only make AI moves if:
    // 1. Game mode is AI
    // 2. It's the AI's turn
    // 3. Game is not paused
    // 4. There's no winner yet
    if (
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
  }, [gameState, gameSettings, isPaused]);
  
  // Handle game moves
  const handleMove = (move: Move) => {
    if (isPaused || gameState.winner) return;
    
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
    toast.info("Game reset");
  };
  
  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Game resumed" : "Game paused");
  };
  
  const handleShare = () => {
    // In a real implementation, this would generate a unique ID for the game
    // and save the current game state to the server
    setShowShare(true);
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
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {gameSettings.mode === "local" ? "Local Game" : 
           gameSettings.mode === "ai" ? `Playing Against AI (${gameSettings.aiModel})` :
           "Online Game"}
        </h1>
        
        {/* Game Board */}
        <GameBoard 
          gameState={gameState}
          onMove={handleMove}
          readOnly={isPaused}
        />
        
        {/* Game Controls */}
        <GameControls 
          gameState={gameState}
          settings={gameSettings}
          onReset={handleReset}
          onUndo={handleUndo}
          onPause={handlePause}
          onShare={handleShare}
          onSettingsClick={() => setShowSettings(true)}
          isPaused={isPaused}
        />
        
        {/* Game Info */}
        <GameInfo />
        
        {/* Dialogs */}
        <GameSettingsDialog 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={gameSettings}
          onSettingsChange={handleSettingsChange}
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
