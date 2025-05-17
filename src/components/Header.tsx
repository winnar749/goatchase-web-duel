
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";

const Header: React.FC = () => {
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="font-bold text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-game-tiger to-game-goat">
                BaghChal
              </span>
              <span className="text-muted-foreground ml-2">AI</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/play" className="font-medium transition-colors hover:text-primary">
            Play
          </Link>
          <Link to="/learn" className="font-medium transition-colors hover:text-primary">
            Learn
          </Link>
          <Link to="/about" className="font-medium transition-colors hover:text-primary">
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link to="/play">
            <Button className="hidden md:flex">
              Play Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
