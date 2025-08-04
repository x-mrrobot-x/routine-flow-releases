const FilterUtils = (() => {
  const FILTER_CONFIG = {
    search: {
      stateKey: "currentSearchFilter",
      processor: value => value.toLowerCase().trim()
    },
    status: {
      stateKey: "currentFilter",
      processor: value => value
    },
    priority: {
      stateKey: "currentPriorityFilter",
      processor: value => value
    },
    day: {
      stateKey: "currentDayFilter",
      processor: value => value
    }
  };

  const DEFAULT_FILTER_VALUES = {
    statusFilter: "all",
    priorityFilter: "all",
    dayFilter: "all",
    searchFilter: ""
  };

  const STATUS_MAP = {
    active: routine => routine.active,
    inactive: routine => !routine.active,
    pending: routine => routine.status === "pending"
  };

  const resetFilterStates = () => {
    AppState.setState({
      currentFilter: "all",
      currentPriorityFilter: "all",
      currentDayFilter: "all",
      currentSearchFilter: ""
    });
  };

  const processFilterValue = (filterType, value) => {
    const config = FILTER_CONFIG[filterType];
    return config ? config.processor(value) : value;
  };

  const updateStateAndRender = (stateKey, value) => {
    AppState.setState(stateKey, value);
    Render.renderRoutines();
  };

  const handleFilterChange = (filterType, value) => {
    const config = FILTER_CONFIG[filterType];
    if (!config) return;

    const processedValue = processFilterValue(filterType, value);
    updateStateAndRender(config.stateKey, processedValue);
  };

  const createFilterHandler = filterType => e => {
    handleFilterChange(filterType, e.target.value);
  };

  const toggleAdvancedFilters = () => {
    const showAdvancedFilters = !AppState.getState("showAdvancedFilters");
    AppState.setState("showAdvancedFilters", showAdvancedFilters);
    DOM.filtersBar.classList.toggle("extended", showAdvancedFilters);
  };

  const isClickOutsideFilters = target => !DOM.filtersBar.contains(target);

  const resetDOMFilters = () => {
    Object.entries(DEFAULT_FILTER_VALUES).forEach(([key, value]) => {
      DOM[key].value = value;
    });
  };

  const sortRoutinesByTime = routines =>
    [...routines].sort((a, b) => a.time - b.time);

  const filterStrategies = {
    status: (routine, filterValue) => {
      if (filterValue === "all") return true;

      const statusHandler = STATUS_MAP[filterValue];
      return statusHandler ? statusHandler(routine) : false;
    },

    priority: (routine, filterValue) =>
      filterValue === "all" || routine.priority === filterValue,

    day: (routine, filterValue) =>
      filterValue === "all" ||
      routine.frequency.includes(parseInt(filterValue)),

    search: (routine, searchTerm) => {
      if (!searchTerm) return true;

      const searchableText = `${routine.title.toLowerCase()} ${routine.description.toLowerCase()}`;
      return searchableText.includes(searchTerm);
    }
  };

  const getFilterValues = state => ({
    status: state.currentFilter,
    priority: state.currentPriorityFilter,
    day: state.currentDayFilter,
    search: state.currentSearchFilter
  });

  const applyFilters = (routines, filterValues) => {
    return routines.filter(routine =>
      Object.entries(filterStrategies).every(([filterType, strategy]) =>
        strategy(routine, filterValues[filterType])
      )
    );
  };

  return {
    resetFilterStates,
    createFilterHandler,
    toggleAdvancedFilters,
    isClickOutsideFilters,
    resetDOMFilters,
    sortRoutinesByTime,
    getFilterValues,
    applyFilters
  };
})();

const Filter = (() => {
  const handleSearchFilterChange = FilterUtils.createFilterHandler("search");

  const handleStatusFilterChange = FilterUtils.createFilterHandler("status");

  const handlePriorityFilterChange =
    FilterUtils.createFilterHandler("priority");

  const handleDayFilterChange = FilterUtils.createFilterHandler("day");

  const handleToggleFilter = () => {
    FilterUtils.toggleAdvancedFilters();
  };

  const handleClickOutsideFilters = e => {
    const isAdvancedFiltersOpen = AppState.getState("showAdvancedFilters");

    if (FilterUtils.isClickOutsideFilters(e.target) && isAdvancedFiltersOpen) {
      handleToggleFilter();
    }
  };

  const resetFilters = () => {
    FilterUtils.resetDOMFilters();
    FilterUtils.resetFilterStates();
    Render.renderRoutines();
  };

  const filterRoutines = routines => {
    const state = AppState.getState();
    const filterValues = FilterUtils.getFilterValues(state);
    const filteredRoutines = FilterUtils.applyFilters(routines, filterValues);

    return FilterUtils.sortRoutinesByTime(filteredRoutines);
  };

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
