const Utils = (() => {
  const HOUR_SECS = 3600;
  const MINUTE_SECS = 60;
  const DAY_KEYS = [
    "day_sun",
    "day_mon",
    "day_tue",
    "day_wed",
    "day_thu",
    "day_fri",
    "day_sat"
  ];

  function pad(time) {
    return time.toString().padStart(2, "0");
  }

  function secondsToTime(secs) {
    const hours = Math.floor(secs / HOUR_SECS);
    const minutes = Math.floor((secs % HOUR_SECS) / MINUTE_SECS);
    return `${pad(hours)}:${pad(minutes)}`;
  }

  function getDayName(day) {
    const key = DAY_KEYS[day];
    return I18n.get(key) || "";
  }

  function timeToSeconds(time) {
    const parts = time.split(":").map(Number);
    const [hours, minutes] = parts;
    return hours * HOUR_SECS + minutes * MINUTE_SECS;
  }

  return {
    secondsToTime,
    getDayName,
    timeToSeconds
  };
})();
