export const formatTime = function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
};

const padZero = (number: number): string => {
  return number.toString().padStart(2, "0");
}
