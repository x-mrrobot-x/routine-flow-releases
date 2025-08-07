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

  function findNextActivationTimestamp() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    if (!routines?.length) return null;

    const activeRoutines = routines.filter(r => r?.active);
    if (!activeRoutines.length) return null;

    let nextActivation = null;
    let nextActivationTime = Infinity;

    for (let day = 0; day < 7; day++) {
      const targetDay = (currentDay + day) % 7;
      const dayRoutines = activeRoutines
        .filter(r => r.frequency?.includes(targetDay))
        .sort((a, b) => a.time - b.time);

      for (const routine of dayRoutines) {
        if (day === 0 && routine.time <= currentTime) continue;

        const activationDate = new Date(now);
        activationDate.setDate(now.getDate() + day);

        const hours = Math.floor(routine.time / 3600);
        const minutes = Math.floor((routine.time % 3600) / 60);
        const seconds = routine.time % 60;

        activationDate.setHours(hours, minutes, seconds, 0);

        const timestamp = Math.floor(activationDate.getTime() / 1000);

        if (timestamp < nextActivationTime) {
          nextActivation = routine;
          nextActivationTime = timestamp;
        }
      }

      if (nextActivation && day === 0) break;
    }

    if (nextActivation) {
      return nextActivationTime;
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
    findNextActivationTimestamp
  };
})(currentEnvironment);
