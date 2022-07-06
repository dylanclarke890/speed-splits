export function formatTime(time, format) {
  switch (format) {
    case "hour":
      return calculateTime(time, 60000, 0);
    case "min":
      return calculateTime(time, 60000, 60);
    case "sec":
      return calculateTime(time, 1000, 60);
    case "ms":
      return calculateTime(time, 10, 100);
    default:
      return "";
  }
}

function calculateTime(time, divisor, mod) {
  const divideResult = time / divisor;
  const result = Math.floor(mod > 0 ? divideResult % mod : divideResult);
  return ("0" + result).slice(-2);
}
