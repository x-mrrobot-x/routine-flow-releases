const RoutineActions = (() => {
  const elements = {
    routinesGrid: DOM.$("#routines-grid"),
    addRoutineButton: DOM.$("#add-routine-button")
  };

  function handleToggleActive(routineId) {
    const routine = RoutineService.getRoutineById(routineId);
    const newActiveStatus = !routine.active;
    RoutineService.updateRoutine(routineId, { active: newActiveStatus });

    RoutineRenderer.updateAll();

    const messageKey = newActiveStatus
      ? "toast_routine_activated"
      : "toast_routine_deactivated";
    Toast.showToast("success", messageKey);
  }

  function executeAction(action, routineId) {
    const actionHandlers = {
      toggle: handleToggleActive,
      edit: RoutineModal.openEditModal,
      delete: DeleteRoutineModal.open
    };

    const handler = actionHandlers[action];

    if (handler) {
      handler(routineId);
    }
  }

  function getRoutineIdFromElement(element) {
    const routineCard = element.closest(".routine-card");
    const routineId = routineCard.dataset.id;
    return routineId ? Number(routineId) : null;
  }

  function handleCardClick(event) {
    const target = event.target;
    const action = target.getAttribute("data-action");
    if (!action) return;

    const routineId = getRoutineIdFromElement(target);
    executeAction(action, routineId);
  }

  function bindEvents() {
    const events = [
      [elements.routinesGrid, "click", handleCardClick],
      [elements.addRoutineButton, "click", RoutineModal.openCreateModal]
    ];

    events.forEach(([element, event, handler]) => {
      element.addEventListener(event, handler);
    });
  }

  function init() {
    bindEvents();
  }

  return {
    init
  };
})();
