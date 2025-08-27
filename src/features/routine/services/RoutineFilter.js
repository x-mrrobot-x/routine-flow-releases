const RoutineFilterUtils = (() => {
  const FILTER_CONFIG = {
    search: {
      stateKey: "currentSearchFilter",
      processor: v => v.toLowerCase().trim()
    },
    status: {
      stateKey: "currentFilter",
      processor: v => v
    },
    priority: {
      stateKey: "currentPriorityFilter",
      processor: v => v
    },
    day: {
      stateKey: "currentDayFilter",
      processor: v => v
    },
    command: {
      stateKey: "currentCommandFilter",
      processor: v => v
    }
  };

  const DEFAULT_VALUES = {
    statusFilter: "all",
    priorityFilter: "all",
    dayFilter: "all",
    searchFilter: "",
    commandFilter: "all"
  };

  const STATUS_MAP = {
    active: r => r.active,
    inactive: r => !r.active,
    pending: r => r.status === "pending"
  };

  const FILTER_STRATEGIES = {
    status: (routine, v) => {
      if (v === "all") return true;
      const handler = STATUS_MAP[v];
      return handler ? handler(routine) : false;
    },
    priority: (routine, v) => v === "all" || routine.priority === v,
    day: (routine, v) => v === "all" || routine.frequency.includes(parseInt(v)),
    search: (routine, term) => {
      if (!term) return true;
      const text = `${routine.title.toLowerCase()} ${routine.description.toLowerCase()}`;
      return text.includes(term);
    },
    command: (routine, v) => v === "all" || routine.command.startsWith(v),
    category: (routine, v) => v === "all" || routine.categoryId === v
  };

  function resetStates() {
    RoutineFilter.setState({
      currentFilter: "all",
      currentPriorityFilter: "all",
      currentDayFilter: "all",
      currentSearchFilter: "",
      currentCommandFilter: "all"
    });
  }

  function processValue(type, value) {
    const config = FILTER_CONFIG[type];
    return config ? config.processor(value) : value;
  }

  function updateState(key, value) {
    RoutineFilter.setState(key, value);
    RoutineRenderer.renderRoutines();
  }

  function handleChange(type, value) {
    const config = FILTER_CONFIG[type];
    if (!config) return;

    const processed = processValue(type, value);
    updateState(config.stateKey, processed);
  }

  function createHandler(type) {
    return e => handleChange(type, e.target.value);
  }

  function toggleAdvanced(bar) {
    const show = !RoutineFilter.getState("showAdvancedFilters");
    RoutineFilter.setState("showAdvancedFilters", show);
    bar.classList.toggle("extended", show);
  }

  function isOutside(target, bar) {
    return !bar.contains(target);
  }

  function resetDOM(elements) {
    const entries = Object.entries(DEFAULT_VALUES);
    entries.forEach(([key, value]) => {
      elements[key].value = value;
    });
  }

  function sortByTime(routines) {
    return [...routines].sort((a, b) => a.time - b.time);
  }

  function getValues(state) {
    return {
      status: state.currentFilter,
      priority: state.currentPriorityFilter,
      day: state.currentDayFilter,
      search: state.currentSearchFilter,
      command: state.currentCommandFilter,
      category: state.currentCategoryFilter
    };
  }

  function applyFilters(routines, values) {
    return routines.filter(routine =>
      Object.entries(FILTER_STRATEGIES).every(([type, strategy]) =>
        strategy(routine, values[type])
      )
    );
  }

  function createOption(command) {
    const element = document.createElement("option");
    element.value = command;
    element.textContent = command;
    return element;
  }

  function populateCommandFilter(elements) {
    const commands = CommandDropdown.utils.getCommands();
    commands.forEach(command => {
      const option = createOption(command);
      elements.commandFilter.appendChild(option);
    });
  }

  return {
    resetStates,
    createHandler,
    toggleAdvanced,
    isOutside,
    resetDOM,
    sortByTime,
    getValues,
    applyFilters,
    populateCommandFilter
  };
})();

const RoutineFilter = (() => {
  const elements = {
    filtersBar: DOM.$("#filters-bar"),
    toggleBtn: DOM.$("#toggle-filters-btn"),
    searchFilter: DOM.$("#search-filter"),
    statusFilter: DOM.$("#status-filter"),
    priorityFilter: DOM.$("#priority-filter"),
    dayFilter: DOM.$("#day-filter"),
    commandFilter: DOM.$("#command-filter")
  };

  let state = {
    showAdvancedFilters: false,
    currentFilter: "all",
    currentPriorityFilter: "all",
    currentDayFilter: "all",
    currentSearchFilter: "",
    currentCommandFilter: "all",
    currentCategoryFilter: "all"
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

  function handleToggle() {
    RoutineFilterUtils.toggleAdvanced(elements.filtersBar);
  }

  function handleOutside(e) {
    const open = getState("showAdvancedFilters");
    if (RoutineFilterUtils.isOutside(e.target, elements.filtersBar) && open) {
      handleToggle();
    }
  }

  function resetFilters() {
    RoutineFilterUtils.resetDOM(elements);
    RoutineFilterUtils.resetStates();
    RoutineRenderer.renderRoutines();
  }

  function filterRoutines(routines) {
    const state = getState();
    const values = RoutineFilterUtils.getValues(state);
    const filtered = RoutineFilterUtils.applyFilters(routines, values);
    return RoutineFilterUtils.sortByTime(filtered);
  }

  function isAnyActive() {
    const state = getState();
    const values = RoutineFilterUtils.getValues(state);

    return (
      values.status !== "all" ||
      values.priority !== "all" ||
      values.day !== "all" ||
      values.search !== ""
    );
  }

  const handlers = {
    search: RoutineFilterUtils.createHandler("search"),
    status: RoutineFilterUtils.createHandler("status"),
    priority: RoutineFilterUtils.createHandler("priority"),
    command: RoutineFilterUtils.createHandler("command"),
    day: RoutineFilterUtils.createHandler("day"),
    toggle: handleToggle,
    outside: handleOutside,
    reset: resetFilters
  };

  function bindEvents() {
    const events = [
      [elements.toggleBtn, "click", handlers.toggle],
      [elements.statusFilter, "change", handlers.status],
      [elements.priorityFilter, "change", handlers.priority],
      [elements.dayFilter, "change", handlers.day],
      [elements.searchFilter, "input", handlers.search],
      [elements.commandFilter, "change", handlers.command],
      [document, "click", handlers.outside]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    RoutineFilterUtils.populateCommandFilter(elements);
    bindEvents();
  }

  return {
    init,
    resetFilters,
    filterRoutines,
    isAnyActive,
    getState,
    setState
  };
})();
