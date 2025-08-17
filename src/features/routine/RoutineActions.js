const RoutineActions = (env => {
  const elements = {
    grid: DOM.$("#routines-grid"),
    settingsBtn: DOM.$("#settings-btn"),
    addBtn: DOM.$("#add-routine-btn")
  };

  function toggleRoutine(routineId) {
    const routine = RoutineService.getById(routineId);
    const active = !routine.active;
    const updated = { ...routine, active };

    RoutineService.update(routineId, { active });
    RoutineRenderer.update(routineId, updated);
    RoutineRenderer.updateNext();

    const key = active
      ? "toast_routine_activated"
      : "toast_routine_deactivated";
    Toast.show("success", key);
  }

  function editRoutine(routineId) {
    const routine = RoutineService.getById(routineId);

    env.navigate("/routines/form", {
      actions: [
        {
          module: "RoutineModal",
          method: "openEdit",
          params: [routine]
        }
      ]
    });
  }

  function deleteRoutine(routineId) {
    env.navigate("/routines/delete", {
      actions: [
        {
          module: "DeleteRoutineModal",
          method: "open",
          params: [routineId]
        }
      ]
    });
  }

  function executeAction(action, id) {
    const actionMap = {
      toggle: toggleRoutine,
      edit: editRoutine,
      delete: deleteRoutine
    };

    const handler = actionMap[action];
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

  function handleSettings() {
    env.navigate("/settings", {
      actions: [
        {
          module: "SettingsModal",
          method: "open",
          params: []
        }
      ]
    });
  }

  function handleAdd() {
    env.navigate("/routines/form", {
      actions: [
        {
          module: "RoutineModal",
          method: "openCreate",
          params: []
        }
      ]
    });
  }

  function bindEvents() {
    const eventBindings = [
      [elements.grid, "click", handleCard],
      [elements.settingsBtn, "click", handleSettings],
      [elements.addBtn, "click", handleAdd]
    ];

    eventBindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    bindEvents();
  }

  return { init };
})(currentEnvironment);
