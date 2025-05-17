
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-center mb-8">About BaghChal AI</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-background rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Project</h2>
            <p className="mb-4">
              BaghChal AI is a modern implementation of the traditional Nepali board game, enhanced with 
              artificial intelligence opponents trained using reinforcement learning techniques.
            </p>
            <p className="mb-4">
              Our mission is to preserve this culturally significant game while making it accessible to a wider 
              audience through an engaging digital format. We've combined traditional gameplay with cutting-edge 
              AI technology to create a unique gaming experience.
            </p>
          </div>
          
          <div className="bg-background rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Reinforcement Learning AI</h2>
            <p className="mb-4">
              The artificial intelligence in our game is powered by advanced reinforcement learning algorithms. 
              We've trained our AI using two primary approaches:
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Deep Q-Network (DQN)</h3>
            <p className="mb-4">
              Our DQN model uses a neural network to approximate the value of taking specific actions in 
              different game states. This allows the AI to learn optimal moves through repeated gameplay and 
              reward signals.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Proximal Policy Optimization (PPO)</h3>
            <p className="mb-4">
              The PPO algorithm directly optimizes the AI's policy (decision-making strategy) through gradient-based 
              optimization. This leads to more stable training and helps the AI develop sophisticated strategic patterns.
            </p>
            
            <p className="mb-4">
              Both models were trained against each other and against human gameplay data, allowing them to develop 
              unique playing styles and strategies. The AI continuously improves through self-play and analysis of 
              game outcomes.
            </p>
          </div>
          
          <div className="bg-background rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
            <p className="mb-4">
              Our application is built using modern web technologies:
            </p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>React & TypeScript for the frontend interface</li>
              <li>Tailwind CSS for responsive, elegant styling</li>
              <li>Real-time multiplayer functionality for online games</li>
              <li>AI models integrated directly into the browser</li>
              <li>Smooth animations and intuitive controls</li>
            </ul>
            
            <p>
              The application is designed to be fully responsive, working seamlessly on desktop, tablet, 
              and mobile devices. Our focus has been on creating an accessible, user-friendly interface 
              that preserves the strategic depth of the original game.
            </p>
          </div>
          
          <div className="bg-background rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Future Plans</h2>
            <p className="mb-4">
              We're committed to continuing the development of BaghChal AI with several planned features:
            </p>
            
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Advanced tutorial system for learning optimal strategies</li>
              <li>Player rankings and competitive multiplayer leagues</li>
              <li>Additional AI models with different playing styles</li>
              <li>Game analysis tools to review and learn from your matches</li>
              <li>Mobile applications for iOS and Android</li>
            </ul>
            
            <div className="mt-8 flex justify-center">
              <Link to="/play">
                <Button size="lg">
                  Start Playing Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
