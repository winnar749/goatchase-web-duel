
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Learn = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Learn to Play Baghchal</h1>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="introduction">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="introduction">Introduction</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="introduction" className="bg-background rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Introduction to Baghchal</h2>
              
              <div className="prose max-w-none">
                <p className="mb-4">
                  <strong>Baghchal</strong> (Nepali: बाघचाल) is a traditional board game that originated in Nepal. 
                  It represents a battle between tigers and goats. The tigers try to capture the goats while 
                  the goats try to immobilize the tigers.
                </p>
                
                <p className="mb-4">
                  The game is played on a 5×5 grid with pieces placed at the intersections rather than in the squares. 
                  The grid contains diagonal lines that add additional paths of movement and capture.
                </p>
                
                <div className="my-6 flex justify-center">
                  <div className="w-64 h-64 relative bg-game-board rounded-md shadow">
                    {/* Simplified board representation */}
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
                      {Array.from({ length: 5 }).map((_, rowIndex) =>
                        Array.from({ length: 5 }).map((_, colIndex) => (
                          <div 
                            key={`${rowIndex}-${colIndex}`} 
                            className="border border-game-line relative"
                          />
                        ))
                      )}
                    </div>
                    {/* Diagonal lines */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 bottom-0 border-t-0 border-l-0" 
                           style={{ borderBottom: '1px solid #8b4513', transform: 'rotate(45deg)', transformOrigin: 'center' }} />
                      <div className="absolute top-0 left-0 right-0 bottom-0 border-b-0 border-l-0" 
                           style={{ borderTop: '1px solid #8b4513', transform: 'rotate(-45deg)', transformOrigin: 'center' }} />
                    </div>
                  </div>
                </div>
                
                <p className="mb-4">
                  The game features two distinct sides:
                </p>
                
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">
                    <strong className="text-game-tiger">Tigers (4)</strong>: Start at the four corners of the board and can capture goats by jumping over them.
                  </li>
                  <li className="mb-2">
                    <strong className="text-game-goat">Goats (20)</strong>: Start off the board and enter one by one during the placement phase.
                  </li>
                </ul>
                
                <p>
                  Baghchal is a game of perfect information with no element of chance, similar to chess or checkers. 
                  It combines strategic depth with relatively simple rules, making it accessible yet challenging to master.
                </p>
                
                <div className="mt-8 flex justify-center">
                  <Link to="/play">
                    <Button size="lg">
                      Try Playing Now
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rules" className="bg-background rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Game Rules</h2>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-2">Setup</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">The game is played on a 5×5 grid with pieces placed at intersections.</li>
                  <li className="mb-2">Four tigers are placed at the four corners of the board.</li>
                  <li className="mb-2">The 20 goats start off the board.</li>
                </ul>
                
                <h3 className="text-xl font-bold mb-2">Game Flow</h3>
                <ol className="list-decimal pl-5 mb-4">
                  <li className="mb-2">The game always begins with the goats' turn.</li>
                  <li className="mb-2">
                    <strong>Phase 1: Goat Placement</strong> - Goats are placed one by one on any vacant intersection on the board.
                  </li>
                  <li className="mb-2">
                    <strong>Phase 2: Movement</strong> - Once all 20 goats are placed, they can move one step along any line to an adjacent vacant intersection.
                  </li>
                  <li className="mb-2">
                    Tigers can move one step along any line to an adjacent vacant intersection at any time during the game.
                  </li>
                  <li className="mb-2">
                    Tigers can also capture goats by jumping over them (similar to checkers) if there is a vacant space directly beyond the goat along a straight line.
                  </li>
                  <li className="mb-2">Players take turns moving their pieces.</li>
                </ol>
                
                <h3 className="text-xl font-bold mb-2">Capturing</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">
                    Tigers can capture goats by jumping over them to a vacant intersection directly beyond, along a straight line.
                  </li>
                  <li className="mb-2">
                    Captured goats are removed from the board.
                  </li>
                  <li className="mb-2">
                    Multiple captures in a single move are not allowed.
                  </li>
                  <li className="mb-2">
                    Goats cannot capture tigers.
                  </li>
                </ul>
                
                <h3 className="text-xl font-bold mb-2">Winning Conditions</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">
                    <strong className="text-game-tiger">Tigers win</strong> if they capture 5 or more goats.
                  </li>
                  <li className="mb-2">
                    <strong className="text-game-goat">Goats win</strong> if they surround all tigers so that no tiger can move.
                  </li>
                </ul>
                
                <h3 className="text-xl font-bold mb-2">Movement Restrictions</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">
                    Both tigers and goats can only move along the marked lines on the board.
                  </li>
                  <li className="mb-2">
                    Pieces can only move to vacant intersections.
                  </li>
                  <li className="mb-2">
                    Tigers cannot jump over other tigers.
                  </li>
                  <li className="mb-2">
                    Goats cannot jump over any pieces.
                  </li>
                </ul>
                
                <div className="mt-8 flex justify-center">
                  <Link to="/play">
                    <Button size="lg">
                      Start Playing
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="strategy" className="bg-background rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Strategy Guide</h2>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-4">Goat Strategy</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Early Game (Placement Phase)</h4>
                  <ul className="list-disc pl-5 mb-4">
                    <li className="mb-2">
                      <strong>Center Control:</strong> Establish a presence in the center of the board as early as possible.
                      The center offers maximum connectivity and movement options.
                    </li>
                    <li className="mb-2">
                      <strong>Defensive Formation:</strong> Place goats in ways that prevent tigers from having capturing opportunities.
                      Avoid creating "leap-frog" situations where tigers can easily jump.
                    </li>
                    <li className="mb-2">
                      <strong>Group Protection:</strong> Create groups of goats that protect each other, making it harder for tigers to capture.
                    </li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Mid to Late Game (Movement Phase)</h4>
                  <ul className="list-disc pl-5 mb-4">
                    <li className="mb-2">
                      <strong>Encirclement:</strong> Gradually work to surround and trap tigers, particularly focusing on one tiger at a time.
                    </li>
                    <li className="mb-2">
                      <strong>Corner Trapping:</strong> Pushing tigers into corners is effective as it limits their movement options.
                    </li>
                    <li className="mb-2">
                      <strong>Sacrifice Strategy:</strong> Sometimes sacrificing a goat is worth it if it allows you to trap a tiger in the next few moves.
                    </li>
                    <li className="mb-2">
                      <strong>Preserve Numbers:</strong> While sacrifices can be strategic, remember that losing 5 goats means defeat.
                      Balance aggression with preservation.
                    </li>
                  </ul>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Tiger Strategy</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Early Game</h4>
                  <ul className="list-disc pl-5 mb-4">
                    <li className="mb-2">
                      <strong>Central Movement:</strong> Move toward the center to increase mobility and capture opportunities.
                    </li>
                    <li className="mb-2">
                      <strong>Coordinate Tigers:</strong> Position tigers to support each other, creating multiple threats.
                    </li>
                    <li className="mb-2">
                      <strong>Disrupt Formations:</strong> Prevent goats from creating solid, protective formations.
                    </li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Mid to Late Game</h4>
                  <ul className="list-disc pl-5 mb-4">
                    <li className="mb-2">
                      <strong>Capture Efficiently:</strong> Focus on captures that don't leave your tigers vulnerable to being trapped.
                    </li>
                    <li className="mb-2">
                      <strong>Create Forks:</strong> Position tigers to threaten multiple goats simultaneously.
                    </li>
                    <li className="mb-2">
                      <strong>Maintain Mobility:</strong> Always ensure each tiger has at least one escape route.
                    </li>
                    <li className="mb-2">
                      <strong>Hunt in Pairs:</strong> Coordinate pairs of tigers to trap goats between them.
                    </li>
                  </ul>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Advanced Techniques</h3>
                
                <div className="mb-6">
                  <ul className="list-disc pl-5 mb-4">
                    <li className="mb-2">
                      <strong>Double Threat:</strong> Create positions where you threaten two different actions, forcing your opponent to choose which threat to address.
                    </li>
                    <li className="mb-2">
                      <strong>Tempo Play:</strong> Use moves that force your opponent to respond in predictable ways, allowing you to control the flow of the game.
                    </li>
                    <li className="mb-2">
                      <strong>Zugzwang Creation:</strong> Create positions where any move your opponent makes will worsen their position.
                    </li>
                  </ul>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Link to="/play">
                    <Button size="lg">
                      Apply These Strategies
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="bg-background rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">History and Cultural Significance</h2>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-2">Origins</h3>
                <p className="mb-4">
                  Baghchal is believed to be several centuries old, originating in Nepal. The exact date of its creation 
                  is unknown, but it has been a popular traditional game throughout Nepal's history, especially in rural areas.
                </p>
                
                <p className="mb-4">
                  The name "Baghchal" comes from two Nepali words: "Bagh" meaning tiger and "Chal" meaning move. 
                  This reflects the central theme of the game - the movement and strategy of tigers.
                </p>
                
                <h3 className="text-xl font-bold mb-2">Cultural Significance</h3>
                <p className="mb-4">
                  In Nepali culture, Baghchal represents more than just a game - it symbolizes the struggle between 
                  predator and prey, the few versus the many, and illustrates important strategic thinking that was 
                  valuable in traditional societies.
                </p>
                
                <p className="mb-4">
                  The game has been traditionally played on wooden boards with carved pieces, often made by local artisans. 
                  In many villages, it served as both entertainment and a way to develop strategic thinking skills.
                </p>
                
                <h3 className="text-xl font-bold mb-2">Modern Revival</h3>
                <p className="mb-4">
                  In recent decades, there has been a renewed interest in Baghchal as part of preserving cultural heritage. 
                  The game has attracted attention from game theorists and AI researchers due to its asymmetric gameplay 
                  and mathematical properties.
                </p>
                
                <p className="mb-4">
                  Today, Baghchal is studied as an example of a perfect information game with interesting mathematical 
                  properties. It has been the subject of computational analysis and AI research, including reinforcement 
                  learning applications.
                </p>
                
                <h3 className="text-xl font-bold mb-2">Similar Games Around the World</h3>
                <p className="mb-4">
                  Baghchal belongs to a family of asymmetric hunt games found throughout the world:
                </p>
                
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">
                    <strong>Aadu Puli Attam</strong> (Goat-Tiger Game) in South India
                  </li>
                  <li className="mb-2">
                    <strong>Bagh-Chal</strong> in India
                  </li>
                  <li className="mb-2">
                    <strong>Catch the Hare</strong> in various European countries
                  </li>
                  <li className="mb-2">
                    <strong>Rimau-rimau</strong> (Tiger Game) in Malaysia
                  </li>
                </ul>
                
                <p>
                  These games share the common theme of a small number of predators attempting to capture numerous prey, 
                  while the prey attempt to surround and immobilize the predators.
                </p>
                
                <div className="mt-8 flex justify-center">
                  <Link to="/play">
                    <Button size="lg">
                      Experience the Tradition
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Learn;
