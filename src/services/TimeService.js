const TimeService = (() => {
  let intervalId = null;

  function checkTime() {
    const nextTimestamp = AppState.getState("nextRoutineTimestamp");

    const now = Math.floor(Date.now() / 1000);
    if (now >= nextTimestamp) {
      Render.updateNextRoutine();
    }
  }

  function start() {
    intervalId = setInterval(checkTime, 1000);
  }

  function init() {
    start();
  }

  return {
    init
  };
})();
