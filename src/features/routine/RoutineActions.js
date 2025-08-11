const RoutineActions = (() => {
  const elements = {
    grid: DOM.$("#routines-grid"),
    addBtn: DOM.$("#add-routine-btn")
  };

  const ACTION_HANDLERS = {
    toggle: handleToggle,
    edit: RoutineModal.openEdit,
    delete: DeleteRoutineModal.open
  };

  function handleToggle(id) {
    const routine = RoutineService.getById(id);
    const active = !routine.active;
    const updatedRoutine = { ...routine, active };

    RoutineService.update(id, { active });
    RoutineRenderer.update(id, updatedRoutine);
    RoutineRenderer.updateNext();
    
    const key = active
      ? "toast_routine_activated"
      : "toast_routine_deactivated";
    Toast.show("success", key);
  }

  function executeAction(action, id) {
    const handler = ACTION_HANDLERS[action];
    if (handler) handler(id);
  }

  function getIdFromEl(el) {
    const card = el.closest(".routine-card");
    const id = card.dataset.id;
    return id ? Number(id) : null;
  }

  function handleCard(e) {
    const { target } = e;
    const action = target.getAttribute("data-action");
    if (!action) return;

    const id = getIdFromEl(target);
    executeAction(action, id);
  }

  const handlers = {
    card: handleCard,
    add: RoutineModal.openCreate
  };

  function bindEvents() {
    const events = [
      [elements.grid, "click", handlers.card],
      [elements.addBtn, "click", handlers.add]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    bindEvents();
  }

  return { init };
})();
