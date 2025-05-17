
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t mt-16">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-medium mb-4">BaghChal AI</h3>
            <p className="text-sm text-muted-foreground">
              A modern implementation of the traditional Nepali board game with
              advanced AI opponents using reinforcement learning.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/play" className="text-muted-foreground hover:text-foreground transition-colors">
                  Play Game
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                  Learn Rules
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Game Modes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/play/local" className="text-muted-foreground hover:text-foreground transition-colors">
                  Local 2-Player
                </Link>
              </li>
              <li>
                <Link to="/play/ai" className="text-muted-foreground hover:text-foreground transition-colors">
                  Play vs. AI
                </Link>
              </li>
              <li>
                <Link to="/play/online" className="text-muted-foreground hover:text-foreground transition-colors">
                  Online Multiplayer
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Technical Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Built with React & TypeScript
              </li>
              <li className="text-muted-foreground">
                AI: DQN & PPO Models
              </li>
              <li className="text-muted-foreground">
                Real-time multiplayer
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Learn More
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BaghChal AI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              A modern implementation of a traditional game
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
