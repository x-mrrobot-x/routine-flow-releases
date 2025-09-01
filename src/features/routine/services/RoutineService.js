const RoutineService = (() => {
  const HOURS_IN_SECONDS = 3600;
  const MINUTES_IN_SECONDS = 60;
  const DAYS_IN_WEEK = 7;
  const MS_TO_SECONDS = 1000;

  let routines = [];

  function init() {
    load();
  }

  function getById(id) {
    return routines.find(r => r.id === id) || null;
  }

  function getAll() {
    return Array.isArray(routines) ? routines : [];
  }

  function add(routine) {
    const newRoutine = { ...routine, id: Date.now() };
    routines.push(newRoutine);
    save();
    EventBus.emit("routine:added", newRoutine);
  }

  function update(id, data) {
    const index = routines.findIndex(r => r.id === id);
    routines[index] = { ...routines[index], ...data };
    save();
    EventBus.emit("routine:updated", id, routines[index]);
  }

  function removeById(id) {
    routines = routines.filter(r => r.id !== id);
    save();
    EventBus.emit("routine:deleted", [id]);
  }

  function removeByCategory(id) {
    const deletedIds = [];
    routines = routines.filter(r => {
      if (r.categoryId === id) {
        deletedIds.push(r.id);
        return false;
      }
      return true;
    });
    save();
    EventBus.emit("routine:deleted", deletedIds);
  }

  function load() {
    const stored = ENV.getRoutines();
    if (!stored) {
      routines = DEFAULT_ROUTINES;
      save();
      return;
    }
    routines = JSON.parse(stored);
  }

  function save() {
    const data = JSON.stringify(routines, null, 2);
    ENV.saveRoutines(data);
  }

  function calculateTimestamp(now, dayOffset, routineTime) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);

    const hours = Math.floor(routineTime / HOURS_IN_SECONDS);
    const minutes = Math.floor(
      (routineTime % HOURS_IN_SECONDS) / MINUTES_IN_SECONDS
    );
    const seconds = routineTime % MINUTES_IN_SECONDS;

    date.setHours(hours, minutes, seconds, 0);
    return Math.floor(date.getTime() / MS_TO_SECONDS);
  }

  function findNextTimestamp() {
    if (!routines?.length) return null;

    const activeRoutines = routines.filter(r => r?.active);
    if (!activeRoutines.length) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime =
      now.getHours() * HOURS_IN_SECONDS +
      now.getMinutes() * MINUTES_IN_SECONDS +
      now.getSeconds();

    let nextTime = Infinity;
    let nextRoutine = null;

    for (let day = 0; day <= DAYS_IN_WEEK; day++) {
      const targetDay = (currentDay + day) % DAYS_IN_WEEK;
      const dayRoutines = activeRoutines
        .filter(r => r.frequency?.includes(targetDay))
        .sort((a, b) => a.time - b.time);

      for (const routine of dayRoutines) {
        if (day === 0 && routine.time <= currentTime) continue;

        const timestamp = calculateTimestamp(now, day, routine.time);
        if (timestamp < nextTime) {
          nextRoutine = routine;
          nextTime = timestamp;
        }
      }

      if (nextRoutine && day === 0) break;
    }

    return nextRoutine ? nextTime : null;
  }

  return {
    init,
    load,
    save,
    getAll,
    getById,
    add,
    update,
    removeById,
    removeByCategory,
    findNextTimestamp
  };
})();
