
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GameSettings, Player, GameMode, GameDifficulty, GameAIModel } from "../types/game";

interface GameSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (newSettings: GameSettings) => void;
}

const GameSettingsDialog: React.FC<GameSettingsDialogProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });
  
  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Game Settings</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="gameMode" className="text-left">Game Mode</Label>
            <RadioGroup
              id="gameMode"
              defaultValue={localSettings.mode}
              onValueChange={(value: GameMode) => {
                setLocalSettings({
                  ...localSettings, 
                  mode: value,
                  // Set default AI settings if mode is AI
                  ...(value === 'ai' ? { 
                    difficulty: localSettings.difficulty || 'easy', 
                    aiModel: localSettings.aiModel || 'dqn',
                    playerSide: localSettings.playerSide || 'goat'
                  } : {})
                });
              }}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="local" id="local" />
                <Label htmlFor="local">Local (2 Players)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai" id="ai" />
                <Label htmlFor="ai">Play Against AI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online Match</Label>
              </div>
            </RadioGroup>
          </div>
          
          {localSettings.mode === 'ai' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="difficulty-trigger" className="text-left">AI Difficulty</Label>
                <Select
                  value={localSettings.difficulty}
                  onValueChange={(value: GameDifficulty) => 
                    setLocalSettings({ ...localSettings, difficulty: value })
                  }
                >
                  <SelectTrigger id="difficulty-trigger">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="aiModel-trigger" className="text-left">AI Model</Label>
                <Select
                  value={localSettings.aiModel}
                  onValueChange={(value: GameAIModel) => 
                    setLocalSettings({ ...localSettings, aiModel: value })
                  }
                >
                  <SelectTrigger id="aiModel-trigger">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dqn">Deep Q-Network (DQN)</SelectItem>
                    <SelectItem value="ppo">Proximal Policy Optimization (PPO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="playerSide-trigger" className="text-left">Play As</Label>
                <Select
                  value={localSettings.playerSide}
                  onValueChange={(value: Player) => 
                    setLocalSettings({ ...localSettings, playerSide: value })
                  }
                >
                  <SelectTrigger id="playerSide-trigger">
                    <SelectValue placeholder="Select your side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goat">Goats</SelectItem>
                    <SelectItem value="tiger">Tigers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {localSettings.mode === 'online' && (
            <div className="bg-accent p-3 rounded-md">
              <p className="text-sm">
                Online mode allows you to play with friends by sharing a game link.
                You can create a new game or join an existing one.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameSettingsDialog;
