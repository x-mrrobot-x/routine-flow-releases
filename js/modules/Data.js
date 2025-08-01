const Data = (env => {
  let routines = [];

  function loadRoutines() {
    let storedRoutines = env.execute("get_routines");
    if (!storedRoutines) {
      routines = DEFAULT_ROUTINES;
      return;
    }
    routines = JSON.parse(storedRoutines);
  }

  function saveRoutines() {
    const data = JSON.stringify(routines, null, 2);
    env.execute("save_routines", data);
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

  function getRoutineById(id) {
    return routines.find(r => r.id === id) || null;
  }

  function init() {
    loadRoutines();
  }

  return {
    init,
    getRoutines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutineById,
    saveRoutines,
    loadRoutines
  };
})(currentEnvironment);
