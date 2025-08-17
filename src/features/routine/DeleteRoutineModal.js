const DeleteRoutineModal = (env => {
  let routineId = null;

  const elements = {
    modal: DOM.$("#delete-routine-modal"),
    overlay: DOM.$("#delete-routine-modal .modal-overlay"),
    confirmBtn: DOM.$("#confirm-delete"),
    cancelBtn: DOM.$("#cancel-delete")
  };

  function handleConfirm() {
    env.navigate(-1, {
      actions: [
        { module: "RoutineService", method: "remove", params: [routineId] },
        { module: "RoutineRenderer", method: "remove", params: [routineId] },
        { module: "RoutineRenderer", method: "updateCount", params: [] },
        { module: "RoutineRenderer", method: "updateNext", params: [] },
        {
          module: "Toast",
          method: "show",
          params: ["success", "toast_routine_deleted"]
        }
      ]
    });

    close();
  }

  function handleCancel() {
    close(true);
  }

  function handleOverlay() {
    close(true);
  }

  function open(id) {
    routineId = id;
    Modal.show(elements.modal);
  }

  function close(goBack = false) {
    routineId = null;
    Modal.hide(elements.modal, goBack);
  }

  function bindEvents() {
    const eventBindings = [
      [elements.cancelBtn, "click", handleCancel],
      [elements.overlay, "click", handleOverlay],
      [elements.confirmBtn, "click", handleConfirm]
    ];

    eventBindings.forEach(([el, event, handler]) =>
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
})(currentEnvironment);
