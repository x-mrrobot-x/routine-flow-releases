const RoutineRenderUtils = (env => {
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

  const getPriorityConfig = priority => PRIORITY_CONFIG[priority];

  const createActionButton = (action, iconName, className) => {
    return `
      <button class="button ${className}" data-action="${action}">
        ${Icons.getIcon(iconName)}
      </button>
    `;
  };

  const createDayTags = frequency => {
    return frequency
      .map(
        dayNumber =>
          `<span class="day-tag">${Utils.getDayName(dayNumber)}</span>`
      )
      .join("");
  };

  const createCommandHTML = command => {
    return command
      ? `
      <div class="card-command">
        ${Icons.getIcon("terminal")}
        <span>${command}</span>
      </div>
    `
      : "";
  };

  const createRoutineCardHTML = routine => {
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
  };

  const getCardClassName = routine => {
    return `routine-card ${!routine.active ? "inactive" : ""}`;
  };

  const clearContainer = elements => {
    elements.routinesGrid.innerHTML = "";
  };

  const removeAllEventListeners = element => {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  };

  const setupFilterEmptyState = (elements) => {
    elements.emptyStateText.textContent = I18n.get("empty_state_text");
    elements.emptyStateButton.innerHTML = Icons.getIcon("brush-cleaning");
    elements.emptyStateButton.innerHTML += I18n.get("clear_filters_button");

    elements.emptyStateButton = removeAllEventListeners(
      elements.emptyStateButton
    );
    elements.emptyStateButton.addEventListener(
      "click",
      RoutineFilter.resetFilters
    );
  };

  const setupRoutinesEmptyState = elements => {
    elements.emptyStateText.textContent = I18n.get("empty_routines_text");
    elements.emptyStateButton.innerHTML = Icons.getIcon("calendar-plus");
    elements.emptyStateButton.innerHTML += I18n.get("create_routine_button");

    elements.emptyStateButton = removeAllEventListeners(
      elements.emptyStateButton
    );
    elements.emptyStateButton.addEventListener(
      "click",
      RoutineModal.openCreateModal
    );
  };

  const showEmptyState = (isFilter, elements) => {
    if (isFilter) {
      setupFilterEmptyState(elements);
    } else {
      setupRoutinesEmptyState(elements);
    }
    elements.emptyState.style.display = "flex";
  };

  const hideEmptyState = elements => {
    elements.emptyState.style.display = "none";
  };

  const formatRoutineDateTime = timestamp => {
    const date = new Date(timestamp * 1000);

    const formattedTime = date.toLocaleTimeString(env.langCode, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const formattedDate = date.toLocaleDateString(env.langCode, {
      weekday: "long",
      day: "2-digit",
      month: "2-digit"
    });

    return `${formattedDate} - ${formattedTime}`;
  };

  const showNextRoutine = (formattedDateTime, elements) => {
    elements.nextRoutineText.textContent = formattedDateTime;
    elements.nextRoutineContainer.style.display = "block";
  };

  const hideNextRoutine = elements => {
    elements.nextRoutineContainer.style.display = "none";
  };

  return {
    createRoutineCardHTML,
    createDayTags,
    createActionButton,
    getCardClassName,
    clearContainer,
    showEmptyState,
    hideEmptyState,
    formatRoutineDateTime,
    showNextRoutine,
    hideNextRoutine
  };
})(currentEnvironment);

const RoutineRenderer = (() => {
  const elements = {
    routinesGrid: DOM.$("#routines-grid"),
    routinesCount: DOM.$("#routines-count"),
    emptyState: DOM.$("#empty-state"),
    emptyStateText: DOM.$("#empty-state p"),
    emptyStateButton: DOM.$("#empty-state button"),
    nextRoutineContainer: DOM.$("#next-routine"),
    nextRoutineText: DOM.$("#next-routine-text")
  };

  const createRoutineCard = routine => {
    const card = document.createElement("div");
    card.className = RoutineRenderUtils.getCardClassName(routine);
    card.dataset.id = routine.id;
    card.innerHTML = RoutineRenderUtils.createRoutineCardHTML(routine);
    return card;
  };

  const appendRoutineCards = routines => {
    const routineCards = routines.map(createRoutineCard);
    elements.routinesGrid.append(...routineCards);
  };

  const renderRoutineCards = (routines, isFilter) => {
    if (routines.length > 0) {
      RoutineRenderUtils.hideEmptyState(elements);
      appendRoutineCards(routines);
    } else {
      RoutineRenderUtils.showEmptyState(isFilter, elements);
    }
  };

  const renderRoutines = () => {
    const routines = RoutineService.getRoutines();
    const filteredRoutines = RoutineFilter.filterRoutines(routines);
    const isFilter = RoutineFilter.isAnyFilterActive();

    RoutineRenderUtils.clearContainer(elements);
    renderRoutineCards(filteredRoutines, isFilter);
  };

  const updateNextRoutine = () => {
    const nextRoutineTimestamp = RoutineService.findNextActivationTimestamp();

    if (nextRoutineTimestamp) {
      const formattedDateTime =
        RoutineRenderUtils.formatRoutineDateTime(nextRoutineTimestamp);
      RoutineRenderUtils.showNextRoutine(formattedDateTime, elements);
      AppState.setState("nextRoutineTimestamp", nextRoutineTimestamp);
    } else {
      RoutineRenderUtils.hideNextRoutine(elements);
    }
  };

  const updateRoutinesCount = () => {
    const count = RoutineService.getRoutines().length;
    elements.routinesCount.textContent = count;
  };

  const updateAll = () => {
    updateRoutinesCount();
    updateNextRoutine();
    renderRoutines();
  };

  const init = () => {
    updateAll();
  };

  return {
    init,
    updateNextRoutine,
    updateRoutinesCount,
    renderRoutines,
    updateAll
  };
})();
