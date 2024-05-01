import { useEffect, useState } from "react";

export const useTimer = () => {
  const [isCountingTime, setIsCountingTime] = useState(true);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isCountingTime) {
      interval = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    } else {
      clearInterval(interval!);
    }

    return () => {
      clearInterval(interval!);
    };
  }, [isCountingTime]);

  const startTimer = () => {
    setIsCountingTime(true);
  };

  const stopTimer = () => {
    setIsCountingTime(false);
  };

  const resetTimer = () => {
    setElapsedTime(0);
  }

  return { elapsedTime, startTimer, stopTimer, resetTimer };
};
