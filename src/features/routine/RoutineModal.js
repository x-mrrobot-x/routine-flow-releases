const RoutineModalUtils = (() => {
  const setCreateModeState = () => {
    RoutineModal.setState({
      selectedDays: [],
      isEditMode: false,
      routineToEdit: null
    });
  };

  function setEditModeState(id, routine) {
    RoutineModal.setState({
      selectedDays: [...routine.frequency],
      isEditMode: true,
      routineToEdit: id
    });
  }

  function updateModalTexts(title, description, buttonContent, elements) {
    elements.title.textContent = title;
    elements.description.textContent = description;
    elements.submitButton.innerHTML = buttonContent;
  }

  return {
    setCreateModeState,
    setEditModeState,
    updateModalTexts
  };
})();

const RoutineModal = (() => {
  const elements = {
    modal: DOM.$("#routine-modal"),
    overlay: DOM.$("#routine-modal .modal-overlay"),
    title: DOM.$("#routine-modal .modal-title"),
    description: DOM.$("#routine-modal .modal-description"),
    cancelButton: DOM.$("#cancel-routine"),
    submitButton: DOM.$('button[type="submit"]')
  };

  const MODAL_CONTENT_KEYS = {
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

  const getState = key => state[key];

  const setState = (key, value) => {
    if (typeof key === "object") {
      state = { ...state, ...key };
      return;
    }
    state[key] = value;
  };

  const getRoutineModalContent = isEditMode => {
    const mode = isEditMode ? "edit" : "create";
    const config = MODAL_CONTENT_KEYS[mode];

    return {
      title: I18n.get(config.title),
      subtitle: I18n.get(config.subtitle),
      submitButton: `${Icons.getIcon(config.icon)} ${I18n.get(config.button)}`
    };
  };

  function setupEditModal(routine, id) {
    RoutineModalUtils.setEditModeState(id, routine);
    const { title, subtitle, submitButton } = getRoutineModalContent(true);
    RoutineModalUtils.updateModalTexts(title, subtitle, submitButton, elements);
    RoutineForm.setupEditForm(routine);
  }

  function openEditModal(id) {
    const routine = RoutineService.getRoutineById(id);
    setupEditModal(routine, id);
    Modal.show(elements.modal);
  }

  function setupCreateModal() {
    RoutineModalUtils.setCreateModeState();

    const { title, subtitle, submitButton } = getRoutineModalContent(false);
    RoutineModalUtils.updateModalTexts(title, subtitle, submitButton, elements);
    RoutineForm.resetForm();
  }

  function openCreateModal() {
    setupCreateModal();
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  function bindEvents() {
    const events = [
      [elements.overlay, "click", close],
      [elements.cancelButton, "click", close]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  }

  function init() {
    bindEvents();
    RoutineForm.init();
  }

  return {
    init,
    openCreateModal,
    openEditModal,
    close,
    getState,
    setState
  };
})();
