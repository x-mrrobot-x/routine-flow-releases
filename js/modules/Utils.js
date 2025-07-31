const Utils = (() => {
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_MINUTE = 60;
  const DAY_KEYS = [
    "day_sun",
    "day_mon",
    "day_tue",
    "day_wed",
    "day_thu",
    "day_fri",
    "day_sat"
  ];

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
    const dayKey = DAY_KEYS[dayNumber];
    return I18n.get(dayKey) || "";
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
