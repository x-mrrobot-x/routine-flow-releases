const AppState = (() => {
  let state = {
    showAdvancedFilters: false,
    currentFilter: "all",
    currentPriorityFilter: "all",
    currentDayFilter: "all",
    currentSearchFilter: "",
    isEditMode: false,
    routineToEdit: null,
    routineToDelete: null,
    selectedDays: [],
    currentTab: "home",
    nextRoutineTimestamp: Infinity
  };

  function getState(key) {
    return key ? state[key] : state;
  }

  function setState(key, value) {
    if (typeof key === "object") {
      state = { ...state, ...key };
      return;
    }
    state[key] = value;
  }

  return {
    getState,
    setState
  };
})();
