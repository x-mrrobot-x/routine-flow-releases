const ModalUtils = (() => {
  function resetState() {
    State.setState({
      isEditMode: false,
      routineToEdit: null
    });
  }

  function setCreateModeState() {
    resetState();
    State.setState("selectedDays", []);
  }

  function setEditModeState(id) {
    State.setState({
      isEditMode: true,
      routineToEdit: id
    });
  }

  function updateModalTexts(title, description, buttonText) {
    DOM.modalTitle.textContent = title;
    DOM.modalDescription.textContent = description;
    DOM.submitButtonText.innerHTML = buttonText;
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
    const fields = {
      title: document.getElementById("title"),
      description: document.getElementById("description"),
      priority: document.getElementById("priority"),
      time: document.getElementById("time")
    };

    fields.title.value = routine.title;
    fields.description.value = routine.description;
    fields.priority.value = routine.priority;
    fields.time.value = Utils.secondsToTime(routine.time);
  }

  function updateDaySelection(frequency) {
    State.setState("selectedDays", [...frequency]);

    DOM.dayButtons.forEach(button => {
      const dayNumber = parseInt(button.dataset.day);
      const isSelected = frequency.includes(dayNumber);
      button.classList.toggle("selected", isSelected);
    });
  }

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
  function setupCreateModal() {
    ModalUtils.setCreateModeState();
    ModalUtils.updateModalTexts(
      "Nova Rotina",
      "Crie uma nova rotina para seu dia a dia.",
      `${Icons.getIcon("check")} Salvar`
    );
    ModalUtils.resetForm();
    ModalUtils.resetDaySelection();
  }

  function setupEditModal(routine, id) {
    ModalUtils.setEditModeState(id);
    ModalUtils.updateModalTexts(
      "Editar Rotina",
      "Altere os dados da sua rotina.",
      `${Icons.getIcon("check")} Atualizar`
    );
    ModalUtils.populateFormFields(routine);
    ModalUtils.updateDaySelection(routine.frequency);
    Form.clearFormErrors();
  }

  function openCreateModal() {
    setupCreateModal();
    ModalUtils.showModal(DOM.routineModal);
  }

  function openEditModal(id) {
    const routine = Data.getRoutineById(id);
    setupEditModal(routine, id);
    ModalUtils.showModal(DOM.routineModal);
  }

  function closeModal() {
    ModalUtils.hideModal(DOM.routineModal);
    ModalUtils.resetState();
  }

  function openDeleteModal(id) {
    ModalUtils.showModal(DOM.deleteRoutineModal);
    State.setState("routineToDelete", id);
  }

  function closeDeleteModal() {
    ModalUtils.hideModal(DOM.deleteRoutineModal);
    State.setState("routineToDelete", null);
  }

  return {
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal
  };
})();
