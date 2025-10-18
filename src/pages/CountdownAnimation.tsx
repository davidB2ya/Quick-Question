import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './CountdownAnimation.css';

const CountdownAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current!);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [onComplete]);

  return (
    <div className="countdown-container">
      <CSSTransition in={count > 0} timeout={300} classNames="fade" unmountOnExit>
        <div className="countdown-number">{count}</div>
      </CSSTransition>
    </div>
  );
};

export default CountdownAnimation;