export const formatCounterTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
};

const padZero = (number: number): string => {
  return number.toString().padStart(2, "0");
};

export const formatTime = (date: string): string => {
  const formattedDate = new Date(date).toLocaleDateString("de", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return formattedDate;
};
