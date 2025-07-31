const RoutineUtils = (() => {
  function updateUI() {
    Render.updateAll();
  }

  function executeAction(action, routineId, handlers = {}) {
    const actionHandlers = {
      toggle: handlers.handleToggleActive,
      edit: Modal.openEditModal,
      delete: Modal.openDeleteModal
    };

    const handler = actionHandlers[action];

    if (handler) {
      handler(routineId);
    }
  }

  function getRoutineIdFromElement(element) {
    const routineCard = element.closest(".routine-card");
    const id = routineCard.getAttribute("data-id");
    return Number(id);
  }

  return {
    updateUI,
    executeAction,
    getRoutineIdFromElement
  };
})();

const RoutineActions = (() => {
  function handleToggleActive(id) {
    const routine = Data.getRoutineById(id);
    const newActiveStatus = !routine.active;
    Data.updateRoutine(id, { active: newActiveStatus });

    RoutineUtils.updateUI();
    const messageKey = newActiveStatus
      ? "toast_routine_activated"
      : "toast_routine_deactivated";
    Toast.showToast("success", messageKey);
  }

  function confirmDeleteRoutine() {
    const routineToDelete = State.getState("routineToDelete");

    Data.deleteRoutine(routineToDelete);

    RoutineUtils.updateUI();
    Modal.closeDeleteModal();
    Toast.showToast("success", "toast_routine_deleted");
  }

  function handleCardClick(event) {
    const target = event.target;
    const action = target.getAttribute("data-action");

    if (!action) return;

    const routineId = RoutineUtils.getRoutineIdFromElement(target);
    RoutineUtils.executeAction(action, routineId, { handleToggleActive });
  }

  return {
    handleToggleActive,
    confirmDeleteRoutine,
    handleCardClick
  };
})();
