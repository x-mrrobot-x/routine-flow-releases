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
    getRoutineById
  };
})(currentEnvironment);
