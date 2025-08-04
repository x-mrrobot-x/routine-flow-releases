const EventManager = (() => {
  function setupModalEvents() {
    DOM.addRoutineButton.addEventListener("click", Modal.openCreateModal);
    DOM.cancelRoutineButton.addEventListener("click", Modal.closeModal);
    DOM.cancelDeleteButton.addEventListener("click", Modal.closeDeleteModal);
    DOM.routineModalOverlay.addEventListener("click", Modal.closeModal);
    DOM.deleteModalOverlay.addEventListener("click", Modal.closeDeleteModal);
  }

  function setupFormEvents() {
    DOM.routineForm.addEventListener("submit", Form.handleFormSubmit);

    DOM.dayButtons.forEach(button => {
      button.addEventListener("click", Form.toggleDaySelection);
    });
  }

  function setupFilterEvents() {
    DOM.toggleFiltersButton.addEventListener(
      "click",
      Filter.handleToggleFilter
    );
    DOM.statusFilter.addEventListener(
      "change",
      Filter.handleStatusFilterChange
    );
    DOM.priorityFilter.addEventListener(
      "change",
      Filter.handlePriorityFilterChange
    );
    DOM.dayFilter.addEventListener("change", Filter.handleDayFilterChange);
    DOM.searchFilter.addEventListener("input", Filter.handleSearchFilterChange);
    DOM.resetFiltersButton.addEventListener("click", Filter.resetFilters);
    document.addEventListener("click", Filter.handleClickOutsideFilters);
  }

  function setupRoutineActionEvents() {
    DOM.confirmDeleteButton.addEventListener(
      "click",
      RoutineActions.confirmDeleteRoutine
    );

    DOM.routinesGrid.addEventListener("click", RoutineActions.handleCardClick);
  }

  function setupSettingsEvents() {
    DOM.settingsButton.addEventListener("click", Settings.openSettingsModal);
    DOM.settingsModalOverlay.addEventListener(
      "click",
      Settings.closeSettingsModal
    );
    DOM.settingsModal.addEventListener("change", Settings.handleSettingsChange);
  }

  function init() {
    setupModalEvents();
    setupFormEvents();
    setupFilterEvents();
    setupRoutineActionEvents();
    setupSettingsEvents();
  }

  return {
    init
  };
})();
