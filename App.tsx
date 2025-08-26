
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, AsteroidType, LaserEffect, MathType } from './types';

// --- CONSTANTS ---
const PLANET_DAMAGE = 20;
const ASTEROID_SPAWN_INTERVAL = 2800;
const GAME_LOOP_INTERVAL = 50;
const ASTEROID_SPEED = 0.5;
const MAX_ASTEROIDS = 8;
const LOCAL_STORAGE_KEY = 'asteroRakningHighScore';

// --- HELPER FUNCTIONS ---
const generateProblem = (type: MathType): AsteroidType['problem'] => {
  switch (type) {
    case 'multiplication': {
      const a = Math.floor(Math.random() * 9) + 2; // 2-10
      const b = Math.floor(Math.random() * 9) + 2; // 2-10
      return {
        question: `${a} × ${b}`,
        answer: a * b,
      };
    }
    case 'addition': {
      const a = Math.floor(Math.random() * 81) + 10; // 10-90
      const b = Math.floor(Math.random() * 81) + 10; // 10-90
      return {
        question: `${a} + ${b}`,
        answer: a + b,
      };
    }
    case 'subtraction': {
      const a = Math.floor(Math.random() * 81) + 20; // 20-100
      const b = Math.floor(Math.random() * (a - 10)) + 10; // 10 up to a-10
      return {
        question: `${a} − ${b}`,
        answer: a - b,
      };
    }
    case 'division': {
      const answer = Math.floor(Math.random() * 9) + 2; // 2-10
      const b = Math.floor(Math.random() * 9) + 2; // 2-10
      const a = answer * b;
      return {
        question: `${a} ÷ ${b}`,
        answer: answer,
      };
    }
  }
};


const getHighScoreFromStorage = (): number => {
    try {
        const storedScore = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedScore ? parseInt(storedScore, 10) : 0;
    } catch (error) {
        console.error("Could not read high score from localStorage", error);
        return 0;
    }
};

const setHighScoreInStorage = (score: number) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, score.toString());
    } catch (error) {
        console.error("Could not save high score to localStorage", error);
    }
};


// --- UI COMPONENTS (Defined outside App to prevent re-creation on re-renders) ---

interface HealthBarProps {
    health: number;
}
const HealthBar: React.FC<HealthBarProps> = ({ health }) => {
    const healthColor = health > 60 ? 'bg-green-500' : health > 30 ? 'bg-yellow-500' : 'bg-red-600';
    return (
        <div className="w-full bg-gray-700 rounded-full h-6 border-2 border-gray-500">
            <div
                className={`${healthColor} h-full rounded-full transition-all duration-300 ease-linear`}
                style={{ width: `${health}%` }}
            ></div>
        </div>
    );
};

interface StartScreenProps {
    onStartGame: (type: MathType) => void;
    highScore?: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, highScore }) => (
    <div className="text-center text-white flex flex-col items-center justify-center h-full bg-black bg-opacity-50 p-8 rounded-xl max-w-lg mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)] mb-4" style={{ fontFamily: 'monospace' }}>
            Julias Astero-Räkning
        </h1>
        <p className="text-lg md:text-xl mb-6 text-gray-300">Hej Julia! Rädda planeten genom att lösa tal!</p>
        <p className="text-lg mb-6 text-yellow-300">Högsta poäng: {highScore}</p>
        <div className="w-full mt-4">
          <p className="text-xl mb-4 text-gray-200">Välj ett räknesätt för att börja:</p>
          <div className="grid grid-cols-2 gap-4">
              <button
                  onClick={() => onStartGame('multiplication')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-b-4 border-cyan-700 active:border-b-0"
              >
                  Gånger (×)
              </button>
              <button
                  onClick={() => onStartGame('addition')}
                  className="bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-b-4 border-green-700 active:border-b-0"
              >
                  Plus (+)
              </button>
              <button
                  onClick={() => onStartGame('subtraction')}
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-b-4 border-yellow-700 active:border-b-0"
              >
                  Minus (−)
              </button>
              <button
                  onClick={() => onStartGame('division')}
                  className="bg-purple-500 hover:bg-purple-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-b-4 border-purple-700 active:border-b-0"
              >
                  Delat (÷)
              </button>
          </div>
        </div>
    </div>
);

interface GameOverScreenProps {
    onGoToStart: () => void;
    score?: number;
    highScore?: number;
}
const GameOverScreen: React.FC<GameOverScreenProps> = ({ onGoToStart, score, highScore }) => (
    <div className="text-center text-white flex flex-col items-center justify-center h-full bg-black bg-opacity-50 p-8 rounded-xl">
        <h2 className="text-5xl font-bold text-red-500 mb-4">Spelet Över</h2>
        <p className="text-xl mb-4">Bra kämpat, Julia!</p>
        <p className="text-2xl mb-4">Din poäng: <span className="font-bold text-white">{score}</span></p>
        <p className="text-2xl mb-8">Högsta poäng: <span className="font-bold text-yellow-300">{highScore}</span></p>
        <button
            onClick={onGoToStart}
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-4 px-8 rounded-lg text-2xl shadow-lg transform hover:scale-105 transition-all duration-300 border-b-4 border-cyan-700 active:border-b-0"
        >
            Tillbaka till Start
        </button>
    </div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
    const [gameState, setGameState] = useState<GameState>('start');
    const [mathType, setMathType] = useState<MathType | null>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [health, setHealth] = useState(100);
    const [asteroids, setAsteroids] = useState<AsteroidType[]>([]);
    const [userInput, setUserInput] = useState('');
    const [lasers, setLasers] = useState<LaserEffect[]>([]);
    const [isShaking, setIsShaking] = useState(false);
    const [isHit, setIsHit] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrongAnswerSoundRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
      setHighScore(getHighScoreFromStorage());
    }, []);

    const startGame = useCallback((type: MathType) => {
        setMathType(type);
        setScore(0);
        setHealth(100);
        setAsteroids([]);
        setUserInput('');
        setGameState('playing');
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const goToStart = useCallback(() => {
        setGameState('start');
        setMathType(null);
    }, []);

    const handleGameOver = useCallback(() => {
      setGameState('gameOver');
      const newHighScore = Math.max(score, highScore);
      if (newHighScore > highScore) {
        setHighScore(newHighScore);
        setHighScoreInStorage(newHighScore);
      }
    }, [score, highScore]);

    useEffect(() => {
        if (gameState !== 'playing' || !mathType) return;

        const spawnAsteroid = () => {
          setAsteroids(prev => {
            if (prev.length >= MAX_ASTEROIDS) return prev;
            const newAsteroid: AsteroidType = {
              id: Date.now(),
              problem: generateProblem(mathType),
              position: {
                top: -10,
                left: Math.random() * 80 + 10,
              },
              size: Math.random() * 4 + 8, // size in vw
              rotation: Math.random() * 360,
            };
            return [...prev, newAsteroid];
          });
        };

        const spawnInterval = setInterval(spawnAsteroid, ASTEROID_SPAWN_INTERVAL);

        const gameLoop = setInterval(() => {
            let healthLost = 0;
            setAsteroids(prevAsteroids => {
                const updated = prevAsteroids.map(a => ({
                    ...a,
                    position: { ...a.position, top: a.position.top + ASTEROID_SPEED },
                }));

                const hitAsteroids = updated.filter(a => a.position.top > 90);
                if (hitAsteroids.length > 0) {
                    healthLost = hitAsteroids.length * PLANET_DAMAGE;
                    setIsHit(true);
                    setTimeout(() => setIsHit(false), 500);
                }

                return updated.filter(a => a.position.top <= 90);
            });
            
            if (healthLost > 0) {
                setHealth(h => Math.max(0, h - healthLost));
            }
        }, GAME_LOOP_INTERVAL);
        
        return () => {
            clearInterval(spawnInterval);
            clearInterval(gameLoop);
        };
    }, [gameState, mathType]);

    useEffect(() => {
        if (health <= 0 && gameState === 'playing') {
            handleGameOver();
        }
    }, [health, gameState, handleGameOver]);

    const shootLaser = (asteroid: AsteroidType) => {
        const newLaser: LaserEffect = {
            id: Date.now(),
            x: asteroid.position.left + (asteroid.size / 2),
            y: 100 - asteroid.position.top
        };
        setLasers(prev => [...prev, newLaser]);
        setTimeout(() => {
            setLasers(prev => prev.filter(l => l.id !== newLaser.id));
        }, 200);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userInput) return;
        
        const answer = parseInt(userInput, 10);
        if (isNaN(answer)) {
            setUserInput('');
            return;
        }

        const targetAsteroid = asteroids.find(a => a.problem.answer === answer);

        if (targetAsteroid) {
            setScore(s => s + 10);
            shootLaser(targetAsteroid);
            setAsteroids(prev => prev.filter(a => a.id !== targetAsteroid.id));
            setUserInput('');
        } else {
            setIsShaking(true);
            setShowWrongFeedback(true);
            if (wrongAnswerSoundRef.current) {
                wrongAnswerSoundRef.current.currentTime = 0;
                wrongAnswerSoundRef.current.play();
            }
            setUserInput('');
            setTimeout(() => {
                setIsShaking(false);
                setShowWrongFeedback(false);
            }, 600);
        }
    };
    
    return (
        <main className={`relative w-screen h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-indigo-900 to-blue-900 transition-all duration-500 ${isHit ? 'flash-anim' : ''}`}>
             <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%228%22%20height=%228%22%20viewBox=%220%200%208%208%22%3E%3Cpath%20d=%22M0%200L4%204L0%208Z%22%20fill=%22%23ffffff10%22/%3E%3C/svg%3E')]"></div>
             
             {/* Audio elements */}
             <audio ref={wrongAnswerSoundRef} preload="auto">
                <source src="data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAiBUAAIgVAAABAAgAZGF0YcQAAAAAAMD/gP6A/YD8APuA/AD8gP2A/oD/gMCAwIDBAIGAwgDDgMKAw4DDAK+ApwCiAKoAqgCoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACo-love" type="audio/wav" />
             </audio>
             
            {showWrongFeedback && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <span className="text-8xl font-bold text-red-500 feedback-anim">
                        FEL!
                    </span>
                </div>
            )}

            {gameState === 'start' && <StartScreen onStartGame={startGame} highScore={highScore} />}
            {gameState === 'gameOver' && <GameOverScreen onGoToStart={goToStart} score={score} highScore={highScore} />}

            {gameState === 'playing' && (
                <>
                    {/* Game UI */}
                    <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center gap-4 bg-black bg-opacity-20 backdrop-blur-sm">
                        <p className="text-white text-2xl font-bold w-48">Poäng: {score}</p>
                        <div className="flex-grow">
                            <HealthBar health={health} />
                        </div>
                    </div>
                    
                    {/* Asteroids */}
                    {asteroids.map(asteroid => (
                        <div
                            key={asteroid.id}
                            className="absolute bg-yellow-900 border-2 border-yellow-900/50 flex items-center justify-center text-white font-bold text-xl md:text-2xl rounded-2xl p-2 transition-all duration-100 ease-linear shadow-lg"
                            style={{
                                top: `${asteroid.position.top}%`,
                                left: `${asteroid.position.left}%`,
                                width: `${asteroid.size}vw`,
                                height: `${asteroid.size * 0.8}vw`,
                                transform: `translateX(-50%) rotate(${asteroid.rotation}deg)`,
                                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                                minWidth: '80px',
                                minHeight: '64px',
                            }}
                        >
                            <span style={{ transform: `rotate(-${asteroid.rotation}deg)` }}>
                                {asteroid.problem.question}
                            </span>
                        </div>
                    ))}
                    
                     {/* Lasers */}
                    {lasers.map(laser => (
                         <div key={laser.id} className="laser" style={{ left: `calc(${laser.x}vw - 2px)`, bottom: '15vh' }}></div>
                    ))}

                    {/* Planet */}
                    <div className="absolute bottom-[-20vh] left-1/2 -translate-x-1/2 w-[50vh] h-[50vh] bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 rounded-full shadow-[0_0_80px_rgba(70,180,255,0.5)]">
                        <div className="absolute inset-0 rounded-full opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.4%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                    </div>
                    
                    {/* Spaceship and Input */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 flex flex-col items-center">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 mb-[-10px]">
                            <path d="M50 10 L70 50 L60 50 L60 80 L40 80 L40 50 L30 50 Z" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="3"/>
                            <path d="M50 20 L55 45 L45 45 Z" fill="#00ffff"/>
                            <path d="M35 80 L20 95 L25 80 Z" fill="orange" />
                            <path d="M65 80 L80 95 L75 80 Z" fill="orange" />
                        </svg>
                        <form onSubmit={handleSubmit}>
                            <input
                                ref={inputRef}
                                type="number"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className={`bg-gray-800 text-white text-3xl font-bold text-center w-48 p-3 rounded-lg border-4 border-cyan-500 focus:outline-none focus:ring-4 ring-cyan-300 transition-all ${isShaking ? 'shake-anim border-red-500' : ''}`}
                                placeholder="Svar"
                                autoFocus
                            />
                        </form>
                    </div>
                </>
            )}
        </main>
    );
}