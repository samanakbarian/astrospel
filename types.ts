
export type GameState = 'start' | 'playing' | 'gameOver';

export interface AsteroidType {
  id: number;
  problem: {
    question: string;
    answer: number;
  };
  position: {
    top: number; // percentage
    left: number; // percentage
  };
  size: number; // vw
  rotation: number; // degrees
}

export interface LaserEffect {
    id: number;
    x: number;
    y: number;
}
