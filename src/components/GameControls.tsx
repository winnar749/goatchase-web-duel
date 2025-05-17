
import React from "react";
import { Button } from "@/components/ui/button";
import { GameState, Player, GameSettings } from "../types/game";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, RotateCcw, Play, Pause, Share, Settings } from "lucide-react";

interface GameControlsProps {
  gameState: GameState;
  settings: GameSettings;
  onReset: () => void;
  onUndo: () => void;
  onPause: () => void;
  onShare: () => void;
  onSettingsClick: () => void;
  isPaused: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  settings,
  onReset,
  onUndo,
  onPause,
  onShare,
  onSettingsClick,
  isPaused
}) => {
  const { turn, phase, goatsPlaced, goatsCaptured, winner } = gameState;
  
  // Format status message
  let statusMessage = "";
  if (winner) {
    statusMessage = `Game Over - ${winner === 'tiger' ? 'Tigers' : 'Goats'} Win!`;
  } else {
    statusMessage = `${turn === 'tiger' ? 'Tigers' : 'Goats'} Turn`;
    if (phase === 'placement') {
      statusMessage += ` - Placement (${goatsPlaced}/20 goats placed)`;
    } else {
      statusMessage += " - Movement";
    }
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-4 bg-background rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onUndo}
                  disabled={gameState.moveHistory.length === 0}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Undo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo last move</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onReset}
                  className="mr-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset the game</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onPause}
                  className="mr-2"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Pause</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPaused ? 'Resume game' : 'Pause game'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSettingsClick}
                  className="mr-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Game settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onShare}
                >
                  <Share className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share this game</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          <span className="text-game-goat">Goats: {goatsPlaced}</span> 
          <span className="mx-1">|</span>
          <span className="text-game-tiger">Captured: {goatsCaptured}</span>
        </div>
        <div className="text-sm font-medium">
          {settings.mode === 'ai' ? `AI: ${settings.aiModel}` : settings.mode}
        </div>
      </div>

      <div className="mt-2 w-full bg-secondary p-2 rounded-md text-center font-medium">
        {statusMessage}
      </div>
    </div>
  );
};

export default GameControls;
