const ModalUtils = (() => {
  function resetState() {
    AppState.setState({
      isEditMode: false,
      routineToEdit: null
    });
  }

  function setCreateModeState() {
    resetState();
    AppState.setState("selectedDays", []);
  }

  function setEditModeState(id) {
    AppState.setState({
      isEditMode: true,
      routineToEdit: id
    });
  }

  function updateModalTexts(title, description, buttonContent) {
    DOM.modalTitle.textContent = title;
    DOM.modalDescription.textContent = description;
    DOM.submitButtonText.innerHTML = buttonContent;
  }

  function resetForm() {
    DOM.routineForm.reset();
    Form.clearFormErrors();
  }

  function resetDaySelection() {
    DOM.dayButtons.forEach(button => {
      button.classList.remove("selected");
    });
  }

  function populateFormFields(routine) {
    DOM.titleInput.value = routine.title;
    DOM.descriptionInput.value = routine.description;
    DOM.commandInput.value = routine.command;
    DOM.prioritySelect.value = routine.priority;
    DOM.timeInput.value = Utils.secondsToTime(routine.time);
  }

  const updateDayButtonSelection = (button, frequency) => {
    const dayNumber = parseInt(button.dataset.day);
    const isSelected = frequency.includes(dayNumber);
    button.classList.toggle("selected", isSelected);
  };

  const updateDaySelection = frequency => {
    AppState.setState("selectedDays", [...frequency]);
    DOM.dayButtons.forEach(button => {
      updateDayButtonSelection(button, frequency);
    });
  };

  function showModal(modalElement) {
    modalElement.classList.add("show");
  }

  function hideModal(modalElement) {
    modalElement.classList.remove("show");
  }

  return {
    resetState,
    setCreateModeState,
    setEditModeState,
    updateModalTexts,
    resetForm,
    resetDaySelection,
    populateFormFields,
    updateDaySelection,
    showModal,
    hideModal
  };
})();

const Modal = (() => {
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

  const getRoutineModalContent = isEditMode => {
    const mode = isEditMode ? "edit" : "create";
    const config = MODAL_CONTENT_KEYS[mode];

    return {
      title: I18n.get(config.title),
      subtitle: I18n.get(config.subtitle),
      submitButton: `${Icons.getIcon(config.icon)} ${I18n.get(config.button)}`
    };
  };

  function setupCreateModal() {
    ModalUtils.setCreateModeState();
    const { title, subtitle, submitButton } = getRoutineModalContent(false);
    ModalUtils.updateModalTexts(title, subtitle, submitButton);
    ModalUtils.resetForm();
    ModalUtils.resetDaySelection();
  }

  function setupEditModal(routine, id) {
    ModalUtils.setEditModeState(id);
    const { title, subtitle, submitButton } = getRoutineModalContent(true);
    ModalUtils.updateModalTexts(title, subtitle, submitButton);
    ModalUtils.populateFormFields(routine);
    ModalUtils.updateDaySelection(routine.frequency);
    Form.clearFormErrors();
  }

  function openCreateModal() {
    setupCreateModal();
    ModalUtils.showModal(DOM.routineModal);
  }

  function openEditModal(id) {
    const routine = RoutineService.getRoutineById(id);
    setupEditModal(routine, id);
    ModalUtils.showModal(DOM.routineModal);
  }

  function closeModal() {
    ModalUtils.hideModal(DOM.routineModal);
    ModalUtils.resetState();
  }

  function openDeleteModal(id) {
    ModalUtils.showModal(DOM.deleteRoutineModal);
    AppState.setState("routineToDelete", id);
  }

  function closeDeleteModal() {
    ModalUtils.hideModal(DOM.deleteRoutineModal);
    AppState.setState("routineToDelete", null);
  }

  return {
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal
  };
})();
