const TimeService = (() => {
  let intervalId = null;
  let nextTimestamp = Infinity;

  function setNext(timestamp) {
    nextTimestamp = timestamp;
  }

  function checkTime() {
    const now = Math.floor(Date.now() / 1000);
    if (now >= nextTimestamp) {
      RoutineRenderer.updateNext();
    }
  }

  function start() {
    intervalId = setInterval(checkTime, 1000);
  }

  function init() {
    start();
  }

  return {
    init,
    setNext
  };
})();
