const Filter = (() => {
  function handleFilterChange(filterType, value) {
    const processedValue =
      filterType === "currentSearchFilter" ? value.toLowerCase().trim() : value;

    State.setState(filterType, processedValue);
    Render.renderRoutines();
  }

  function handleSearchFilterChange(e) {
    handleFilterChange("currentSearchFilter", e.target.value);
  }

  function handleToggleFilter() {
    const showAdvancedFilters = !State.getState("showAdvancedFilters");
    State.setState("showAdvancedFilters", showAdvancedFilters);
    DOM.filtersBar.classList.toggle("extended", showAdvancedFilters);
  }

  function handleStatusFilterChange(e) {
    handleFilterChange("currentFilter", e.target.value);
  }

  function handlePriorityFilterChange(e) {
    handleFilterChange("currentPriorityFilter", e.target.value);
  }

  function handleDayFilterChange(e) {
    handleFilterChange("currentDayFilter", e.target.value);
  }

  function handleClickOutsideFilters(e) {
    const isClickOutside = !DOM.filtersBar.contains(e.target);
    const isAdvancedFiltersOpen = State.getState("showAdvancedFilters");

    if (isClickOutside && isAdvancedFiltersOpen) {
      handleToggleFilter();
    }
  }

  function resetFilters() {
    const defaultValues = {
      statusFilter: "all",
      priorityFilter: "all",
      dayFilter: "all",
      searchFilter: ""
    };

    Object.entries(defaultValues).forEach(
      ([key, value]) => (DOM[key].value = value)
    );

    State.resetFilters();
    Render.renderRoutines();
  }

  function sortRoutinesByTime(routines) {
    return routines.sort((a, b) => a.time - b.time);
  }

  const filterStrategies = {
    status: (routine, filterValue) => {
      if (filterValue === "all") return true;

      const statusMap = {
        active: routine.active,
        inactive: !routine.active,
        pending: routine.status === "pending"
      };

      return statusMap[filterValue] || false;
    },

    priority: (routine, filterValue) => {
      return filterValue === "all" || routine.priority === filterValue;
    },

    day: (routine, filterValue) => {
      return (
        filterValue === "all" ||
        routine.frequency.includes(parseInt(filterValue))
      );
    },

    search: (routine, searchTerm) => {
      if (!searchTerm) return true;

      const searchableText = [
        routine.title.toLowerCase(),
        routine.description.toLowerCase()
      ].join(" ");

      return searchableText.includes(searchTerm);
    }
  };

  function filterRoutines(routines) {
    const state = State.getState();

    const filteredRoutines = routines.filter(routine => {
      return Object.entries(filterStrategies).every(
        ([filterType, strategy]) => {
          const filterMap = {
            status: state.currentFilter,
            priority: state.currentPriorityFilter,
            day: state.currentDayFilter,
            search: state.currentSearchFilter
          };

          return strategy(routine, filterMap[filterType]);
        }
      );
    });

    return sortRoutinesByTime(filteredRoutines);
  }

  return {
    handleToggleFilter,
    handleSearchFilterChange,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleDayFilterChange,
    handleClickOutsideFilters,
    resetFilters,
    filterRoutines
  };
})();
