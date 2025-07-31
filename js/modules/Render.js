const RenderUtils = (() => {
  const PRIORITY_CONFIG = {
    low: {
      label: "Baixa",
      className: "priority-low",
      icon: "💡"
    },
    medium: {
      label: "Média",
      className: "priority-medium",
      icon: "⚡"
    },
    high: {
      label: "Alta",
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

  function createCardHTML(routine) {
    const { label, className, icon } = getPriorityConfig(routine.priority);

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

  return {
    getPriorityConfig,
    createCardHTML,
    createDayTags,
    createActionButton,
    getCardClassName,
    clearContainer
  };
})();

const Render = (() => {
  function createRoutineCard(routine) {
    const card = document.createElement("div");
    card.className = RenderUtils.getCardClassName(routine);
    card.dataset.id = routine.id;
    card.innerHTML = RenderUtils.createCardHTML(routine);
    return card;
  }

  function appendRoutineCards(routines) {
    const routineCards = routines.map(routine => createRoutineCard(routine));
    DOM.routinesGrid.append(...routineCards);
  }

  function renderRoutines() {
    const routines = Data.getRoutines();
    const filteredRoutines = Filter.filterRoutines(routines);

    RenderUtils.clearContainer();

    if (filteredRoutines.length > 0) {
      DOM.emptyState.style.display = "none";
      appendRoutineCards(filteredRoutines);
    } else {
      DOM.emptyState.style.display = "flex";
    }
  }

  function updateRoutinesCount() {
    DOM.routinesCount.textContent = Data.getRoutines().length;
  }

  function updateAll() {
    updateRoutinesCount();
    renderRoutines();
  }

  function init() {
    updateAll();
  }

  return {
    init,
    renderRoutines,
    updateRoutinesCount,
    updateAll
  };
})();
