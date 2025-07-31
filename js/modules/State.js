const State = (() => {
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
    currentTab: "home"
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

  function resetFilters() {
    const filterUpdates = {
      currentFilter: "all",
      currentPriorityFilter: "all",
      currentDayFilter: "all",
      currentSearchFilter: ""
    };
    setState(filterUpdates);
  }

  return {
    getState,
    setState,
    resetFilters
  };
})();
