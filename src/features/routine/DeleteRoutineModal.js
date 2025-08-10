const DeleteRoutineModal = (() => {
  let routineToDelete = null;

  const elements = {
    modal: DOM.$("#delete-routine-modal"),
    overlay: DOM.$("#delete-routine-modal .modal-overlay"),
    confirmButton: DOM.$("#confirm-delete"),
    cancelButton: DOM.$("#cancel-delete")
  };

  function open(routineId) {
    Modal.show(elements.modal);
    routineToDelete = routineId;
  }

  function close() {
    Modal.hide(elements.modal);
    routineToDelete = null;
  }

  function handleDeleteRoutine() {
    RoutineService.deleteRoutine(routineToDelete);
    RoutineRenderer.updateAll();
    close();
    Toast.showToast("success", "toast_routine_deleted");
  }

  function bindEvents() {
    const events = [
      [elements.cancelButton, "click", close],
      [elements.overlay, "click", close],
      [elements.confirmButton, "click", handleDeleteRoutine]
    ];

    events.forEach(([element, event, handler]) => {
      element.addEventListener(event, handler);
    });
  }

  function init() {
    bindEvents();
  }

  return {
    init,
    open
  };
})();
