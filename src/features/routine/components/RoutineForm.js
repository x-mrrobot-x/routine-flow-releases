const RoutineFormUtils = (() => {
  const ERROR_IDS = [
    "title-error",
    "description-error",
    "priority-error",
    "time-error",
    "days-error",
    "command-error"
  ];

  const REQUIRED_FIELDS = {
    title: "form_error_title_required",
    description: "form_error_description_required",
    time: "form_error_time_required"
  };

  function getValue(el) {
    return el.value.trim();
  }

  function getFormData(elements) {
    return {
      title: getValue(elements.titleInput),
      description: getValue(elements.descriptionInput),
      priority: getValue(elements.prioritySelect),
      time: Utils.timeToSeconds(getValue(elements.timeInput)),
      selectedDays: RoutineModal.getState("selectedDays"),
      command: getValue(elements.commandInput),
      categoryId: getValue(elements.categorySelect)
    };
  }

  function showError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function validateField(field, value, errors) {
    if (!value) {
      showError(`${field}-error`, I18n.get(REQUIRED_FIELDS[field]));
      errors.push(field);
    }
  }

  function validateCommand(command, errors) {
    if (!command) return;

    const commands = CommandUtils.getCommands();
    const isValid = commands.some(cmd => command.startsWith(cmd));

    if (!isValid) {
      showError("command-error", I18n.get("form_error_command_invalid"));
      errors.push("command");
    }
  }

  function validateDays(days, errors) {
    if (days.length === 0) {
      showError("days-error", I18n.get("form_error_days_required"));
      errors.push("days");
    }
  }

  function validateForm(data) {
    const errors = [];

    validateField("title", data.title, errors);
    validateField("description", data.description, errors);
    validateCommand(data.command, errors);
    validateField("time", data.time, errors);
    validateDays(data.selectedDays, errors);

    return errors.length === 0;
  }

  function createData(data) {
    const frequency = [...data.selectedDays.sort()];
    return {
      title: data.title,
      description: data.description,
      command: data.command,
      priority: data.priority,
      time: data.time,
      frequency,
      categoryId: data.categoryId
    };
  }

  function populateFields(routine, elements) {
    elements.titleInput.value = routine.title;
    elements.descriptionInput.value = routine.description;
    elements.commandInput.value = routine.command;
    elements.categorySelect.value = routine.categoryId;
    elements.prioritySelect.value = routine.priority;
    elements.timeInput.value = Utils.secondsToTime(routine.time);
  }

  function updateDays(frequency, btns) {
    btns.forEach(btn => {
      const day = parseInt(btn.dataset.day);
      btn.classList.toggle("selected", frequency.includes(day));
    });
  }

  function clearErrors() {
    ERROR_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  }

  function resetDays(btns) {
    btns.forEach(btn => btn.classList.remove("selected"));
  }

  function focusTitle(input) {
    requestAnimationFrame(() => input.focus());
  }

  return {
    getFormData,
    validateForm,
    createData,
    populateFields,
    updateDays,
    clearErrors,
    resetDays,
    focusTitle
  };
})();

const RoutineForm = (() => {
  const elements = {
    form: DOM.$("#routine-form"),
    titleInput: DOM.$("#title"),
    descriptionInput: DOM.$("#description"),
    commandInput: DOM.$("#command"),
    prioritySelect: DOM.$("#priority"),
    timeInput: DOM.$("#time"),
    daysContainer: DOM.$("#days-container"),
    dayBtns: DOM.$$(".day-button"),
    categorySelect: DOM.$("#category-select")
  };

  function handleEdit(data) {
    const id = RoutineModal.getState("routineToEdit");
    const original = RoutineService.getById(id);
    const oldCategoryId = original.categoryId;
    const newCategoryId = data.categoryId;

    RoutineService.update(id, data);
    RoutineRenderer.update(id);
    RoutineRenderer.updateNext();
    CategoryRenderer.render();

    const currentFilter = RoutineFilter.getState("currentCategoryFilter");
    if (
      currentFilter !== "all" &&
      (currentFilter === oldCategoryId || currentFilter === newCategoryId)
    ) {
      RoutineRenderer.renderRoutines();
    }

    Toast.show("success", "toast_routine_updated");
  }

  function handleCreate(data) {
    const routine = { id: Date.now().toString(), ...data, active: true };
    RoutineService.add(routine);
    RoutineRenderer.updateAll();
    CategoryRenderer.render();
    Toast.show("success", "toast_routine_created");
  }

  function handleCommandInput(event) {
    const { value } = event.target;
    const visible = CommandDropdown.getVisibleDropdown();

    if (value.startsWith("/")) {
      const suggestions = CommandUtils.filterSuggestions(value);
      suggestions.length > 0
        ? CommandDropdown.open(suggestions)
        : CommandDropdown.close();
      return;
    }

    if (visible) CommandDropdown.close();
  }

  function setupEdit(routine) {
    RoutineFormUtils.populateFields(routine, elements);
    RoutineFormUtils.updateDays(routine.frequency, elements.dayBtns);
    RoutineFormUtils.clearErrors();
    RoutineFormUtils.focusTitle(elements.titleInput);
  }

  function updateDays(day, selected) {
    const days = RoutineModal.getState("selectedDays");
    const newDays = selected ? [...days, day] : days.filter(d => d !== day);
    RoutineModal.setState("selectedDays", newDays);
  }

  function setupCreate() {
    elements.form.reset();
    RoutineFormUtils.clearErrors();
    RoutineFormUtils.resetDays(elements.dayBtns);

    const selected = RoutineFilter.getState("currentCategoryFilter");
    if (selected !== "all") {
      elements.categorySelect.value = selected;
    }

    RoutineFormUtils.focusTitle(elements.titleInput);
  }

  function handleSubmit(e) {
    e.preventDefault();
    RoutineFormUtils.clearErrors();

    const formData = RoutineFormUtils.getFormData(elements);
    if (!RoutineFormUtils.validateForm(formData)) return;

    const data = RoutineFormUtils.createData(formData);
    if (RoutineModal.getState("isEditMode")) {
      handleEdit(data);
    } else {
      handleCreate(data);
    }
    RoutineModal.close();
  }

  function setCommandInput(command) {
    elements.commandInput.value = command;
    elements.commandInput.focus();
  }

  function toggleDay(e) {
    const day = parseInt(e.target.dataset.day);
    if (isNaN(day)) return;

    e.target.classList.toggle("selected");
    updateDays(day, e.target.classList.contains("selected"));
  }

  function populateCategorySelect() {
    const categories = CategoryService.getAll();
    elements.categorySelect.innerHTML = "";

    categories.forEach(category => {
      if (category.isVirtual) return;

      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = I18n.get(category.name);
      elements.categorySelect.appendChild(option);
    });
  }

  const handlers = {
    submit: handleSubmit,
    input: handleCommandInput,
    toggle: toggleDay
  };

  function bindEvents() {
    const bindings = [
      [elements.form, "submit", handlers.submit],
      [elements.commandInput, "input", handlers.input],
      [elements.daysContainer, "click", handlers.toggle]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    CommandDropdown.init();
    populateCategorySelect();
    bindEvents();
  }

  return {
    init,
    setupEdit,
    setupCreate,
    setCommandInput,
    populateCategorySelect
  };
})();
