
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GameInfo: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-4 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">About Baghchal</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="rules">
          <AccordionTrigger>Game Rules</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-left">
              <p>
                <strong>Baghchal</strong> (Nepali: बाघचाल) is a traditional board game from Nepal, played on a 5×5 grid.
              </p>
              
              <p>
                <strong>Pieces:</strong> The game consists of 4 tigers (predators) and 20 goats (prey).
              </p>
              
              <p>
                <strong>Initial Setup:</strong> The tigers are placed at the four corners of the board. 
                The goats are not on the board at the start.
              </p>
              
              <h4 className="font-medium mt-2">Game Flow</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>The game begins with the goats turn.</li>
                <li>Goat Phase 1: Goats must place all 20 goats on the board, one per turn.</li>
                <li>Once all goats are placed, Goat Phase 2 begins: goats can move one step per turn.</li>
                <li>Tigers can move one step or capture goats by jumping over them.</li>
              </ol>
              
              <h4 className="font-medium mt-2">Win Conditions</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tigers win if they capture 5 goats.</li>
                <li>Goats win if they trap all tigers so they cannot move.</li>
              </ul>
              
              <h4 className="font-medium mt-2">Movement</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>All pieces move along the lines to adjacent intersections.</li>
                <li>Tigers can jump over goats (capturing them) if there is an empty space behind the goat.</li>
                <li>Goats cannot jump or capture tigers.</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="strategy">
          <AccordionTrigger>Strategy Tips</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-left">
              <h4 className="font-medium">Tips for Goats:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Form tight formations to block tiger movements.</li>
                <li>Try to occupy the center of the board to limit tiger mobility.</li>
                <li>Protect vulnerable goats by positioning other goats nearby.</li>
                <li>Focus on trapping tigers in corners or edges.</li>
              </ul>
              
              <h4 className="font-medium mt-2">Tips for Tigers:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Keep tigers spread out to maintain maximum mobility.</li>
                <li>Look for capturing opportunities by creating fork situations.</li>
                <li>Try to create positions where multiple goats can be threatened simultaneously.</li>
                <li>Prevent goats from forming blocking formations early in the game.</li>
              </ul>
              
              <p className="mt-2">
                The key to winning is thinking several moves ahead and understanding the balance 
                between offense and defense in different phases of the game.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ai">
          <AccordionTrigger>AI Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-left">
              <p>
                This game features two advanced AI models trained using reinforcement learning techniques:
              </p>
              
              <h4 className="font-medium">Deep Q-Network (DQN):</h4>
              <p>
                A value-based reinforcement learning algorithm that learns to predict the value of 
                taking each action in a given state. The DQN model excels at tactical play and capturing opportunities.
              </p>
              
              <h4 className="font-medium mt-2">Proximal Policy Optimization (PPO):</h4>
              <p>
                A policy-based reinforcement learning algorithm that directly learns the best policy 
                for action selection. The PPO model demonstrates strong strategic thinking and positional play.
              </p>
              
              <h4 className="font-medium mt-2">Difficulty Levels:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Easy:</strong> The AI uses basic heuristics with some random moves.</li>
                <li><strong>Medium:</strong> The AI uses a moderately trained model with limited search depth.</li>
                <li><strong>Hard:</strong> The AI uses fully trained models with optimized decision making.</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default GameInfo;
