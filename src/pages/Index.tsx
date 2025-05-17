
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-background overflow-hidden">
          <div className="container py-16 md:py-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Play <span className="text-primary">Baghchal</span> with Advanced AI
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Experience the ancient Nepali board game powered by state-of-the-art 
                  reinforcement learning AI. Play against friends or challenge our DQN and PPO models.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/play">
                    <Button size="lg" className="w-full sm:w-auto">
                      Play Now
                    </Button>
                  </Link>
                  <Link to="/learn">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Learn How to Play
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative lg:h-[500px] flex items-center justify-center">
                <div className="w-full max-w-md aspect-square bg-accent rounded-lg shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
                    {Array.from({ length: 5 }).map((_, rowIndex) =>
                      Array.from({ length: 5 }).map((_, colIndex) => (
                        <div 
                          key={`${rowIndex}-${colIndex}`} 
                          className="border border-muted relative"
                        >
                          {(rowIndex === 0 || rowIndex === 4 || colIndex === 0 || colIndex === 4 || 
                            rowIndex === colIndex || rowIndex + colIndex === 4 || 
                            (rowIndex === 2 || colIndex === 2)) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                            </div>
                          )}
                          
                          {/* Tigers in corners */}
                          {((rowIndex === 0 && colIndex === 0) || 
                           (rowIndex === 0 && colIndex === 4) || 
                           (rowIndex === 4 && colIndex === 0) || 
                           (rowIndex === 4 && colIndex === 4)) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-5 rounded-full bg-game-tiger shadow-lg"></div>
                            </div>
                          )}
                          
                          {/* Sample goats */}
                          {((rowIndex === 2 && colIndex === 1) || 
                           (rowIndex === 2 && colIndex === 2) || 
                           (rowIndex === 1 && colIndex === 2) || 
                           (rowIndex === 3 && colIndex === 2)) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 rounded-full bg-game-goat shadow-lg"></div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-accent/30 py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Game Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Beautiful Interface</h3>
                <p className="text-muted-foreground">
                  Enjoy a clean, responsive design with smooth animations and intuitive controls 
                  on any device.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Multiple Game Modes</h3>
                <p className="text-muted-foreground">
                  Play against AI, challenge a friend locally, or compete online with players from around the world.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Advanced AI</h3>
                <p className="text-muted-foreground">
                  Challenge our reinforcement learning models (DQN and PPO) at different difficulty levels.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Real-time Multiplayer</h3>
                <p className="text-muted-foreground">
                  Share a game link with friends and play together in real-time from anywhere.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Learn the Game</h3>
                <p className="text-muted-foreground">
                  Discover the ancient rules and strategies of Baghchal through our comprehensive tutorial section.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Customizable Experience</h3>
                <p className="text-muted-foreground">
                  Choose difficulty levels, select different AI models, and personalize your game experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="container py-16">
          <div className="bg-accent rounded-xl p-8 md:p-12 shadow-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Test Your Skills?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Challenge our AI or play with friends. Experience the strategic depth of this ancient game.
              </p>
              <Link to="/play">
                <Button size="lg" className="px-8">
                  Start Playing Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
