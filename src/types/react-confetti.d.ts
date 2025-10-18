declare module 'react-confetti' {
  import { FC } from 'react';

  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    gravity?: number;
    wind?: number;
    colors?: string[];
    initialVelocityX?: number;
    initialVelocityY?: number;
    confettiSource?: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    drawShape?: (context: CanvasRenderingContext2D) => void;
    onConfettiComplete?: (confetti: any) => void;
    run?: boolean;
  }

  const Confetti: FC<ConfettiProps>;
  export default Confetti;
}