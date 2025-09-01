const RoutineActions = (() => {
  const elements = {
    grid: DOM.$("#routines-grid"),
    addBtn: DOM.$("#add-routine-btn")
  };

  const ACTION_MAP = {
    toggle: toggleRoutine,
    edit: editRoutine,
    delete: deleteRoutine
  };

  function toggleRoutine(routineId) {
    const routine = RoutineService.getById(routineId);
    const active = !routine.active;

    RoutineService.update(routineId, { active });

    const key = active
      ? "toast_routine_activated"
      : "toast_routine_deactivated";
    Toast.show("success", key);
  }

  function editRoutine(routineId) {
    const routine = RoutineService.getById(routineId);
    RoutineModal.open(routine);
  }

  function deleteRoutine(routineId) {
    DeleteRoutineModal.open(routineId);
  }

  function executeAction(action, id) {
    const handler = ACTION_MAP[action];
    if (handler) handler(id);
  }

  function getIdFromEl(el) {
    const card = el.closest(".routine-card");
    const id = card?.dataset.id;
    return id ? Number(id) : null;
  }

  function handleCard(e) {
    const action = e.target.getAttribute("data-action");
    if (!action) return;

    const id = getIdFromEl(e.target);
    executeAction(action, id);
  }

  function handleAdd() {
    RoutineModal.open();
  }

  const handlers = {
    card: handleCard,
    add: handleAdd
  };

  function bindEvents() {
    const bindings = [
      [elements.grid, "click", handlers.card],
      [elements.addBtn, "click", handlers.add]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    bindEvents();
  }

  return {
    init
  };
})();
