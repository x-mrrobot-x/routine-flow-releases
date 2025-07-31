const DOM = (() => {
  const $ = selector => {
    return document.querySelector(selector);
  };

  const $$ = selector => {
    return document.querySelectorAll(selector);
  };

  const elements = {
    // Filters
    filtersBar: $("#filters-bar"),
    toggleFiltersButton: $("#toggle-filters-btn"),
    searchFilter: $("#search-filter"),
    statusFilter: $("#status-filter"),
    priorityFilter: $("#priority-filter"),
    dayFilter: $("#day-filter"),
    resetFiltersButton: $("#clear-filters"),

    // Routines
    routinesGrid: $("#routines-grid"),
    routinesCount: $("#routines-count"),
    emptyState: $("#empty-state"),

    // Modals
    routineModal: $("#routine-modal"),
    deleteRoutineModal: $("#delete-routine-modal"),
    routineForm: $("#routine-form"),
    modalTitle: $(".modal-title"),
    modalDescription: $(".modal-description"),
    submitButtonText: $('button[type="submit"]'),

    // Form inputs
    titleInput: $("#title"),
    descriptionInput: $("#description"),
    prioritySelect: $("#priority"),
    timeInput: $("#time"),
    dayButtons: $$(".day-button"),

    // Action buttons
    addRoutineButton: $("#add-routine-button"),
    cancelRoutineButton: $("#cancel-routine"),
    confirmDeleteButton: $("#confirm-delete"),
    cancelDeleteButton: $("#cancel-delete"),

    // Toast
    toastContainer: $("#toast-container")
  };

  elements.routineModalOverlay =
    elements.routineModal.querySelector(".modal-overlay");
  elements.deleteModalOverlay =
    elements.deleteRoutineModal.querySelector(".modal-overlay");

  return {
    ...elements
  };
})();
