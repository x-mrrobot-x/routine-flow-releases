const DeleteRoutineModal = (() => {
  let routineId = null;

  const elements = {
    modal: DOM.$("#delete-routine-modal"),
    overlay: DOM.$("#delete-routine-modal .modal-overlay"),
    confirmBtn: DOM.$("#confirm-delete"),
    cancelBtn: DOM.$("#cancel-delete")
  };

  function handleConfirm() {
    RoutineService.remove(routineId);
    RoutineRenderer.updateAll();
    close();
    Toast.show("success", "toast_routine_deleted");
  }

  function open(id) {
    routineId = id;
    Modal.show(elements.modal);
  }

  function close() {
    routineId = null;
    Modal.hide(elements.modal);
  }

  const handlers = {
    cancel: close,
    overlay: close,
    confirm: handleConfirm
  };

  function bindEvents() {
    const events = [
      [elements.cancelBtn, "click", handlers.cancel],
      [elements.overlay, "click", handlers.overlay],
      [elements.confirmBtn, "click", handlers.confirm]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    bindEvents();
  }

  return { init, open };
})();
