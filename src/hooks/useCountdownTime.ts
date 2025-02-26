import {useEffect, useState} from 'react';

export const useCountDownTime = (initialTime: number) => {
  const [time, setTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        if (time > 0) {
          setTime(time - 1);
        }
      }, 1000);

      if (time === 0) {
        setIsRunning(false);
      }
      return () => {
        clearInterval(timer);
      };
    }
  }, [isRunning, time]);

  const resetCountdown = (): void => {
    setTime(initialTime);
    setIsRunning(true);
  };

  const startCountdown = (): void => {
    setIsRunning(true);
  };

  return {
    time: `${Math.floor(time / 60)
      .toString()
      .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`,
    isRunning,
    resetCountdown,
    startCountdown,
  };
};
