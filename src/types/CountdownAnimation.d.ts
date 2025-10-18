declare module './CountdownAnimation' {
  import { FC } from 'react';

  interface CountdownAnimationProps {
    onComplete: () => void;
  }

  const CountdownAnimation: FC<CountdownAnimationProps>;
  export default CountdownAnimation;
}