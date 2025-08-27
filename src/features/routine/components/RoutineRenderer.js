const RoutineRenderUtils = (() => {
  const PRIORITY_CONFIG = {
    low: { className: "priority-low", icon: "💡" },
    medium: { className: "priority-medium", icon: "⚡" },
    high: { className: "priority-high", icon: "🔥" }
  };

  function getPriorityConfig(priority) {
    return PRIORITY_CONFIG[priority];
  }

  function createActionBtn(action, iconName, className) {
    return `<button class="button ${className}" data-action="${action}">
        ${Icons.getIcon(iconName)}
      </button>`;
  }

  function createDayTags(frequency) {
    const tags = frequency.map(
      day => `<span class="day-tag">${Utils.getDayName(day)}</span>`
    );
    return tags.join("");
  }

  function createCommand(command) {
    return command
      ? `<div class="card-command">
        ${Icons.getIcon("terminal")}
        <code>${command}</code>
      </div>`
      : "";
  }

  function createCardHTML(routine) {
    const { className, icon } = getPriorityConfig(routine.priority);
    const label = I18n.get(className.replace("-", "_"));

    return `<header class="card-header">
        <h3 class="card-title">${routine.title}</h3>
        <span class="priority-badge ${className}">${icon} ${label}</span>
      </header>
      
      <div class="card-body">
        <p class="card-description">${routine.description}</p>
        
        <time class="card-time">
          ${Icons.getIcon("clock")}
          <span>${Utils.secondsToTime(routine.time)}</span>
        </time>
        
        ${createCommand(routine.command)}
        
        <div class="card-days">
          ${Icons.getIcon("calendar")}
          ${createDayTags(routine.frequency)}
        </div>
      </div>
      
      <footer class="card-footer">
        <div class="card-actions">
          ${createActionBtn(
            "toggle",
            routine.active ? "power" : "power-off",
            "routine-toggle-btn"
          )}
          ${createActionBtn("edit", "edit", "routine-edit-btn")}
          ${createActionBtn("delete", "trash2", "delete-btn")}
        </div>
      </footer>`;
  }

  function getCardClass(routine) {
    return `routine-card ${!routine.active ? "inactive" : ""}`;
  }

  function clearGrid(elements) {
    elements.grid.innerHTML = "";
  }

  function removeListeners(el) {
    const newEl = el.cloneNode(true);
    el.parentNode.replaceChild(newEl, el);
    return newEl;
  }

  function setupFilterEmpty(elements) {
    elements.emptyText.textContent = I18n.get("empty_state_text");
    elements.emptyBtn.innerHTML = Icons.getIcon("brush-cleaning");
    elements.emptyBtn.innerHTML += I18n.get("clear_filters_button");

    elements.emptyBtn = removeListeners(elements.emptyBtn);
    elements.emptyBtn.addEventListener("click", RoutineFilter.resetFilters);
  }

  function setupRoutinesEmpty(elements) {
    elements.emptyText.textContent = I18n.get("empty_routines_text");
    elements.emptyBtn.innerHTML = Icons.getIcon("calendar-plus");
    elements.emptyBtn.innerHTML += I18n.get("create_routine_button");

    elements.emptyBtn = removeListeners(elements.emptyBtn);
    elements.emptyBtn.addEventListener("click", () => RoutineModal.open());
  }

  function showEmpty(isFilter, elements) {
    if (isFilter) {
      setupFilterEmpty(elements);
    } else {
      setupRoutinesEmpty(elements);
    }
    elements.emptyState.classList.add("show");
  }

  function hideEmpty(elements) {
    elements.emptyState.classList.remove("show");
  }

  function formatDateTime(timestamp) {
    const date = new Date(timestamp * 1000);

    const time = date.toLocaleTimeString(ENV.langCode, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const dateStr = date.toLocaleDateString(ENV.langCode, {
      weekday: "long",
      day: "2-digit",
      month: "2-digit"
    });

    return `${dateStr} - ${time}`;
  }

  function showNext(formatted, elements) {
    elements.nextText.textContent = formatted;
    elements.nextContainer.style.display = "block";
  }

  function hideNext(elements) {
    elements.nextContainer.style.display = "none";
  }

  return {
    createCardHTML,
    createDayTags,
    createActionBtn,
    getCardClass,
    clearGrid,
    showEmpty,
    hideEmpty,
    formatDateTime,
    showNext,
    hideNext
  };
})();

const RoutineRenderer = (() => {
  const PAGE_SIZE = 8;
  const THRESHOLD_PX = 200;

  const elements = {
    grid: DOM.$("#routines-grid"),
    emptyState: DOM.$("#empty-state"),
    emptyText: DOM.$("#empty-state p"),
    emptyBtn: DOM.$("#empty-state button"),
    nextContainer: DOM.$("#next-routine"),
    nextText: DOM.$("#next-routine-text"),
    appContainer: DOM.$("#app-container")
  };

  let paginationManager = null;

  function createCard(routine) {
    const card = document.createElement("article");
    card.className = RoutineRenderUtils.getCardClass(routine);
    card.dataset.id = routine.id;
    card.innerHTML = RoutineRenderUtils.createCardHTML(routine);
    return card;
  }

  function appendCards(routines) {
    const cards = routines.map(createCard);
    elements.grid.append(...cards);
  }

  function renderCards(routines, isFilter) {
    if (routines.length > 0) {
      RoutineRenderUtils.hideEmpty(elements);
      paginationManager.load(routines);
    } else {
      RoutineRenderUtils.showEmpty(isFilter, elements);
    }
  }

  function renderRoutines() {
    const routines = RoutineService.getAll();
    const filtered = RoutineFilter.filterRoutines(routines);
    const isFilter = RoutineFilter.isAnyActive();

    RoutineRenderUtils.clearGrid(elements);
    renderCards(filtered, isFilter);
  }

  function updateNext() {
    const timestamp = RoutineService.findNextTimestamp();

    if (timestamp) {
      const formatted = RoutineRenderUtils.formatDateTime(timestamp);
      RoutineRenderUtils.showNext(formatted, elements);
      TimeService.setNext(timestamp);
    } else {
      RoutineRenderUtils.hideNext(elements);
    }
  }

  function updateAll() {
    updateNext();
    renderRoutines();
  }

  function remove(id) {
    const card = DOM.$(`[data-id="${id}"]`);
    if (card) card.remove();

    if (elements.grid.children.length === 0) {
      const isFilter = RoutineFilter.isAnyActive();
      RoutineRenderUtils.showEmpty(isFilter, elements);
    }
  }

  function update(id) {
    const card = DOM.$(`[data-id="${id}"]`);
    if (!card) return;

    const routine = RoutineService.getById(id);
    card.className = RoutineRenderUtils.getCardClass(routine);
    card.innerHTML = RoutineRenderUtils.createCardHTML(routine);
  }

  function createPagination() {
    paginationManager = PaginationManager.create({
      scrollElement: elements.appContainer,
      pageSize: PAGE_SIZE,
      thresholdPx: THRESHOLD_PX,
      renderAppend: appendCards
    });
  }

  function init() {
    createPagination();
    updateAll();
  }

  return {
    init,
    remove,
    update,
    updateNext,
    renderRoutines,
    updateAll
  };
})();
