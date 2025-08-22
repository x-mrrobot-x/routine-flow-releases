const RoutineService = (() => {
  let routines = [];

  function getById(id) {
    return routines.find(r => r.id === id) || null;
  }

  function getAll() {
    return Array.isArray(routines) ? routines : [];
  }

  function add(routine) {
    const newRoutine = {
      ...routine,
      id: Date.now()
    };

    routines.push(newRoutine);
    save();
  }

  function update(id, data) {
    const index = routines.findIndex(r => r.id === id);
    routines[index] = { ...routines[index], ...data };
    save();
  }

  function remove(id) {
    routines = routines.filter(r => r.id !== id);
    save();
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

  function findNextTimestamp() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    if (!routines?.length) return null;

    const active = routines.filter(r => r?.active);
    if (!active.length) return null;

    let nextRoutine = null;
    let nextTime = Infinity;

    for (let day = 0; day <= 7; day++) {
      const targetDay = (currentDay + day) % 7;
      const dayRoutines = active
        .filter(r => r.frequency?.includes(targetDay))
        .sort((a, b) => a.time - b.time);

      for (const routine of dayRoutines) {
        if (day === 0 && routine.time <= currentTime) continue;

        const date = new Date(now);
        date.setDate(now.getDate() + day);

        const hours = Math.floor(routine.time / 3600);
        const minutes = Math.floor((routine.time % 3600) / 60);
        const seconds = routine.time % 60;

        date.setHours(hours, minutes, seconds, 0);

        const timestamp = Math.floor(date.getTime() / 1000);

        if (timestamp < nextTime) {
          nextRoutine = routine;
          nextTime = timestamp;
        }
      }

      if (nextRoutine && day === 0) break;
    }

    return nextRoutine ? nextTime : null;
  }

  function init() {
    load();
  }

  return {
    init,
    load,
    getAll,
    add,
    update,
    remove,
    save,
    getById,
    findNextTimestamp
  };
})();
