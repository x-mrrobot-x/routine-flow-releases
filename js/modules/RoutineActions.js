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

  function extractRoutineId(routineCard) {
    const id = routineCard.dataset.id;
    return id ? Number(id) : null;
  }

  function getRoutineIdFromElement(element) {
    const routineCard = element.closest(".routine-card");
    return extractRoutineId(routineCard);
  }

  return {
    updateUI,
    executeAction,
    getRoutineIdFromElement
  };
})();

const RoutineActions = (() => {
  function handleToggleActive(id) {
    const routine = RoutineService.getRoutineById(id);
    const newActiveStatus = !routine.active;
    RoutineService.updateRoutine(id, { active: newActiveStatus });

    RoutineUtils.updateUI();
    const messageKey = newActiveStatus
      ? "toast_routine_activated"
      : "toast_routine_deactivated";
    Toast.showToast("success", messageKey);
  }

  const finalizeDeletion = () => {
    RoutineUtils.updateUI();
    Modal.closeDeleteModal();
    Toast.showToast("success", "toast_routine_deleted");
  };

  const deleteRoutineFromState = () => {
    const routineToDelete = AppState.getState("routineToDelete");
    RoutineService.deleteRoutine(routineToDelete);
  };

  function confirmDeleteRoutine() {
    deleteRoutineFromState();
    finalizeDeletion();
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
