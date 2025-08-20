const DeleteRoutineModal = (() => {
  let routineId = null;

  const elements = {
    modal: DOM.$("#delete-routine-modal"),
    overlay: DOM.$("#delete-routine-modal .modal-overlay"),
    confirmBtn: DOM.$("#confirm-delete"),
    cancelBtn: DOM.$("#cancel-delete")
  };

  function open(id) {
    routineId = id;
    Modal.show(elements.modal);
  }

  function close() {
    routineId = null;
    Modal.hide(elements.modal);
  }

  function handleConfirm() {
    RoutineService.remove(routineId);
    RoutineRenderer.remove(routineId);
    RoutineRenderer.updateCount();
    RoutineRenderer.updateNext();
    Toast.show("success", "toast_routine_deleted");
    close();
  }

  const handlers = {
    confirm: handleConfirm,
    cancel: close,
    overlay: close
  };

  function bindEvents() {
    const bindings = [
      [elements.cancelBtn, "click", handlers.cancel],
      [elements.confirmBtn, "click", handlers.confirm],
      [elements.overlay, "click", handlers.overlay]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    bindEvents();
  }

  return {
    init,
    open,
    close
  };
})();
