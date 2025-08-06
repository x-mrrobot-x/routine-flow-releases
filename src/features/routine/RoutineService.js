const RoutineService = (env => {
  let routines = [];

  function getRoutineById(id) {
    return routines.find(r => r.id === id) || null;
  }

  function getRoutines() {
    return Array.isArray(routines) ? routines : [];
  }

  function addRoutine(routine) {
    const newRoutine = {
      ...routine,
      id: Date.now()
    };

    routines.push(newRoutine);
    saveRoutines();
  }

  function updateRoutine(id, updatedData) {
    const index = routines.findIndex(r => r.id === id);
    routines[index] = { ...routines[index], ...updatedData };
    saveRoutines();
  }

  function deleteRoutine(id) {
    routines = routines.filter(routine => routine.id !== id);
    saveRoutines();
  }

  function loadRoutines() {
    const storedRoutines = env.getRoutines();
    routines = storedRoutines ? JSON.parse(storedRoutines) : DEFAULT_ROUTINES;
  }

  function saveRoutines() {
    const data = JSON.stringify(routines, null, 2);
    env.saveRoutines(data);
  }

  function findNextRoutine() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTimeInSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDay = (currentDay + dayOffset) % 7;
      const activeRoutines = routines.filter(
        r => r.active && r.frequency.includes(targetDay)
      );

      for (const routine of activeRoutines) {
        const isToday = dayOffset === 0;
        const canRunToday = isToday && routine.time > currentTimeInSeconds;

        if (canRunToday || !isToday) {
          const targetDate = new Date(now.getTime() + dayOffset * 86400000);
          const dayStart = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            targetDate.getDate()
          );
          return dayStart.getTime() / 1000 + routine.time;
        }
      }
    }

    return null;
  }

  function init() {
    loadRoutines();
  }

  return {
    init,
    loadRoutines,
    getRoutines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    saveRoutines,
    getRoutineById,
    findNextRoutine
  };
})(currentEnvironment);
