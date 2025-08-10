const RoutineFilterUtils = (() => {
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
    RoutineRenderer.renderRoutines();
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

  const toggleAdvancedFilters = filtersBar => {
    const showAdvancedFilters = !AppState.getState("showAdvancedFilters");
    AppState.setState("showAdvancedFilters", showAdvancedFilters);
    filtersBar.classList.toggle("extended", showAdvancedFilters);
  };

  const isClickOutsideFilters = (target, filtersBar) =>
    !filtersBar.contains(target);

  const resetDOMFilters = elements => {
    Object.entries(DEFAULT_FILTER_VALUES).forEach(([key, value]) => {
      elements[key].value = value;
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

const RoutineFilter = (() => {
  const elements = {
    filtersBar: DOM.$("#filters-bar"),
    toggleFiltersButton: DOM.$("#toggle-filters-btn"),
    searchFilter: DOM.$("#search-filter"),
    statusFilter: DOM.$("#status-filter"),
    priorityFilter: DOM.$("#priority-filter"),
    dayFilter: DOM.$("#day-filter"),
    emptyStateButton: DOM.$("#empty-state button")
  };

  const handleSearchFilterChange =
    RoutineFilterUtils.createFilterHandler("search");

  const handleStatusFilterChange =
    RoutineFilterUtils.createFilterHandler("status");

  const handlePriorityFilterChange =
    RoutineFilterUtils.createFilterHandler("priority");

  const handleDayFilterChange = RoutineFilterUtils.createFilterHandler("day");

  const handleToggleFilter = () => {
    RoutineFilterUtils.toggleAdvancedFilters(elements.filtersBar);
  };

  const handleClickOutsideFilters = e => {
    const isAdvancedFiltersOpen = AppState.getState("showAdvancedFilters");

    if (
      RoutineFilterUtils.isClickOutsideFilters(e.target, elements.filtersBar) &&
      isAdvancedFiltersOpen
    ) {
      handleToggleFilter();
    }
  };

  const resetFilters = () => {
    RoutineFilterUtils.resetDOMFilters(elements);
    RoutineFilterUtils.resetFilterStates();
    RoutineRenderer.renderRoutines();
  };

  const filterRoutines = routines => {
    const state = AppState.getState();
    const filterValues = RoutineFilterUtils.getFilterValues(state);
    const filteredRoutines = RoutineFilterUtils.applyFilters(
      routines,
      filterValues
    );

    return RoutineFilterUtils.sortRoutinesByTime(filteredRoutines);
  };

  const isAnyFilterActive = () => {
    const state = AppState.getState();
    const filterValues = RoutineFilterUtils.getFilterValues(state);

    return (
      filterValues.status !== "all" ||
      filterValues.priority !== "all" ||
      filterValues.day !== "all" ||
      filterValues.search !== ""
    );
  };

  const bindEvents = () => {
    const events = [
      [elements.toggleFiltersButton, "click", handleToggleFilter],
      [elements.statusFilter, "change", handleStatusFilterChange],
      [elements.priorityFilter, "change", handlePriorityFilterChange],
      [elements.dayFilter, "change", handleDayFilterChange],
      [elements.searchFilter, "input", handleSearchFilterChange],
      [elements.emptyStateButton, "click", resetFilters],
      [document, "click", handleClickOutsideFilters]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  };

  const init = () => {
    bindEvents();
  };

  return {
    init,
    handleToggleFilter,
    handleSearchFilterChange,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleDayFilterChange,
    handleClickOutsideFilters,
    resetFilters,
    filterRoutines,
    isAnyFilterActive
  };
})();
