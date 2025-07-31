const Utils = (() => {
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_MINUTE = 60;
  const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  function secondsToTime(seconds) {
    const hours = Math.floor(seconds / SECONDS_PER_HOUR);
    const minutes = Math.floor(
      (seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE
    );

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  function getDayName(dayNumber) {
    return DAY_NAMES[dayNumber] || "";
  }

  function timeToSeconds(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE;
  }

  return {
    secondsToTime,
    getDayName,
    timeToSeconds
  };
})();
