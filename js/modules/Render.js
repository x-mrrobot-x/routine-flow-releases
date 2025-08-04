const RenderUtils = (() => {
  const PRIORITY_CONFIG = {
    low: {
      className: "priority-low",
      icon: "💡"
    },
    medium: {
      className: "priority-medium",
      icon: "⚡"
    },
    high: {
      className: "priority-high",
      icon: "🔥"
    }
  };

  function getPriorityConfig(priority) {
    return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  }

  function createActionButton(action, iconName, className) {
    return `
      <button class="button ${className}" data-action="${action}">
        ${Icons.getIcon(iconName)}
      </button>
    `;
  }

  function createDayTags(frequency) {
    return frequency
      .map(
        dayNumber =>
          `<span class="day-tag">${Utils.getDayName(dayNumber)}</span>`
      )
      .join("");
  }

  const createCommandHTML = command =>
    command
      ? `
      <div class="card-command">
        ${Icons.getIcon("terminal")}
        <span>${command}</span>
      </div>
    `
      : "";

  function createCardHTML(routine) {
    const { className, icon } = getPriorityConfig(routine.priority);
    const label = I18n.get(className.replace("-", "_"));

    return `
      <div class="card-header">
        <h3 class="card-title">${routine.title}</h3>
        <span class="priority-badge ${className}">${icon} ${label}</span>
      </div>
      <div class="card-body">
        <p class="card-description">${routine.description}</p>
        
        <div class="card-time">
          ${Icons.getIcon("clock")}
          <span>${Utils.secondsToTime(routine.time)}</span>
        </div>
        
        ${createCommandHTML(routine.command)}
        
        <div class="card-days">
          ${Icons.getIcon("calendar")}
          ${createDayTags(routine.frequency)}
        </div>
      </div>
      <div class="card-footer">
        <div class="card-actions">
          ${createActionButton(
            "toggle",
            routine.active ? "power" : "power-off",
            "routine-toggle-btn"
          )}
          ${createActionButton("edit", "edit", "routine-edit-btn")}
          ${createActionButton("delete", "trash2", "routine-delete-btn")}
        </div>
      </div>
    `;
  }

  function getCardClassName(routine) {
    return `routine-card ${!routine.active ? "inactive" : ""}`;
  }

  function clearContainer() {
    DOM.routinesGrid.innerHTML = "";
  }

  const showEmptyState = () => {
    DOM.emptyState.style.display = "flex";
  };

  const hideEmptyState = () => {
    DOM.emptyState.style.display = "none";
  };

  return {
    getPriorityConfig,
    createCardHTML,
    createDayTags,
    createActionButton,
    getCardClassName,
    clearContainer,
    showEmptyState,
    hideEmptyState
  };
})();

const Render = (() => {
  const createRoutineCard = routine => {
    const card = document.createElement("div");
    card.className = RenderUtils.getCardClassName(routine);
    card.dataset.id = routine.id;
    card.innerHTML = RenderUtils.createCardHTML(routine);
    return card;
  };

  const appendRoutineCards = routines => {
    const routineCards = routines.map(createRoutineCard);
    DOM.routinesGrid.append(...routineCards);
  };

  const hasRoutines = routines => routines.length > 0;

  const renderRoutineCards = routines => {
    if (hasRoutines(routines)) {
      RenderUtils.hideEmptyState();
      appendRoutineCards(routines);
    } else {
      RenderUtils.showEmptyState();
    }
  };

  const renderRoutines = () => {
    const routines = RoutineService.getRoutines();
    const filteredRoutines = Filter.filterRoutines(routines);

    RenderUtils.clearContainer();
    renderRoutineCards(filteredRoutines);
  };

  const updateRoutinesCount = () => {
    DOM.routinesCount.textContent = RoutineService.getRoutines().length;
  };

  const updateAll = () => {
    updateRoutinesCount();
    renderRoutines();
  };

  const init = () => {
    updateAll();
  };

  return {
    init,
    renderRoutines,
    updateRoutinesCount,
    updateAll
  };
})();
