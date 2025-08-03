const DOM = (() => {
  const $ = (selector, element = document) => {
    return element.querySelector(selector);
  };

  const $$ = (selector, element = document) => {
    return element.querySelectorAll(selector);
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

    // Settings
    settingsButton: $("#settings-button"),
    settingsModal: $("#settings-modal"),
    voiceToggle: $("#voice-toggle"),
    toastToggle: $("#toast-toggle"),
    vibrateToggle: $("#vibrate-toggle"),

    // Form inputs
    titleInput: $("#title"),
    descriptionInput: $("#description"),
    commandInput: $("#command"),
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

  elements.routineModalOverlay = $(".modal-overlay", elements.routineModal);
  elements.deleteModalOverlay = $(
    ".modal-overlay",
    elements.deleteRoutineModal
  );
  elements.settingsModalOverlay = $(".modal-overlay", elements.settingsModal);

  return {
    ...elements
  };
})();
