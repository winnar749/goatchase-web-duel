
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

interface ShareGameProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: string;
}

const ShareGame: React.FC<ShareGameProps> = ({ isOpen, onClose, gameId }) => {
  const [copied, setCopied] = useState(false);
  
  // Generate a game link based on the current URL and game ID
  const gameLink = gameId 
    ? `${window.location.origin}/game/${gameId}` 
    : `${window.location.origin}/game/new`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameLink);
      setCopied(true);
      toast.success("Game link copied to clipboard");
      
      // Reset copied status after a delay
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Share Game</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Share this link with a friend to invite them to play Baghchal with you.
          </p>
          
          <div className="flex items-center space-x-2">
            <Input 
              value={gameLink} 
              readOnly 
              className="flex-1"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button 
              size="icon" 
              onClick={copyToClipboard}
              variant="outline"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex justify-center space-x-4 mt-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                const url = encodeURIComponent(gameLink);
                const text = encodeURIComponent("Join me for a game of Baghchal!");
                window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
              }}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.57l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              Share on Twitter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareGame;
