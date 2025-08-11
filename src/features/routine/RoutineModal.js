const RoutineModalUtils = (() => {
  function setCreateState() {
    RoutineModal.setState({
      selectedDays: [],
      isEditMode: false,
      routineToEdit: null
    });
  }

  function setEditState(id, routine) {
    RoutineModal.setState({
      selectedDays: [...routine.frequency],
      isEditMode: true,
      routineToEdit: id
    });
  }

  function updateTexts(title, desc, btnContent, elements) {
    elements.title.textContent = title;
    elements.description.textContent = desc;
    elements.submitBtn.innerHTML = btnContent;
  }

  return {
    setCreateState,
    setEditState,
    updateTexts
  };
})();

const RoutineModal = (() => {
  const elements = {
    modal: DOM.$("#routine-modal"),
    overlay: DOM.$("#routine-modal .modal-overlay"),
    title: DOM.$("#routine-modal .modal-title"),
    description: DOM.$("#routine-modal .modal-description"),
    cancelBtn: DOM.$("#cancel-routine"),
    submitBtn: DOM.$('button[type="submit"]')
  };

  const CONTENT_KEYS = {
    create: {
      title: "create_routine_title",
      subtitle: "create_routine_subtitle",
      button: "create_button",
      icon: "calendar-plus"
    },
    edit: {
      title: "edit_routine_title",
      subtitle: "edit_routine_subtitle",
      button: "update_button",
      icon: "calendar-sync"
    }
  };

  let state = {
    selectedDays: [],
    isEditMode: false,
    routineToEdit: null
  };

  function getState(key) {
    return state[key];
  }

  function setState(key, value) {
    if (typeof key === "object") {
      state = { ...state, ...key };
      return;
    }
    state[key] = value;
  }

  function getContent(isEdit) {
    const mode = isEdit ? "edit" : "create";
    const config = CONTENT_KEYS[mode];

    return {
      title: I18n.get(config.title),
      subtitle: I18n.get(config.subtitle),
      submitButton: `${Icons.getIcon(config.icon)} ${I18n.get(config.button)}`
    };
  }

  function setupEdit(routine, id) {
    RoutineModalUtils.setEditState(id, routine);
    const { title, subtitle, submitButton } = getContent(true);
    RoutineModalUtils.updateTexts(title, subtitle, submitButton, elements);
    RoutineForm.setupEdit(routine);
  }

  function openEdit(id) {
    const routine = RoutineService.getById(id);
    setupEdit(routine, id);
    Modal.show(elements.modal);
  }

  function setupCreate() {
    RoutineModalUtils.setCreateState();
    const { title, subtitle, submitButton } = getContent(false);
    RoutineModalUtils.updateTexts(title, subtitle, submitButton, elements);
    RoutineForm.reset();
  }

  function openCreate() {
    setupCreate();
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  const handlers = {
    overlay: close,
    cancel: close
  };

  function bindEvents() {
    const events = [
      [elements.overlay, "click", handlers.overlay],
      [elements.cancelBtn, "click", handlers.cancel]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    RoutineForm.init();
    bindEvents();
  }

  return {
    init,
    openCreate,
    openEdit,
    close,
    getState,
    setState
  };
})();
