const RoutineFormUtils = (() => {
  const ERROR_ELEMENTS = [
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

  function getFormData({
    titleInput,
    descriptionInput,
    prioritySelect,
    timeInput,
    commandInput
  }) {
    return {
      title: getValue(titleInput),
      description: getValue(descriptionInput),
      priority: getValue(prioritySelect),
      time: Utils.timeToSeconds(getValue(timeInput)),
      selectedDays: RoutineModal.getState("selectedDays"),
      command: getValue(commandInput)
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

    const validCommands = CommandUtils.getCommands();
    const isValid = validCommands.some(cmd => command.startsWith(cmd));

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
    const frequency = data.selectedDays.sort();
    return {
      title: data.title,
      description: data.description,
      command: data.command,
      priority: data.priority,
      time: data.time,
      frequency: [...frequency]
    };
  }

  function populateFields(routine, elements) {
    elements.titleInput.value = routine.title;
    elements.descriptionInput.value = routine.description;
    elements.commandInput.value = routine.command;
    elements.prioritySelect.value = routine.priority;
    elements.timeInput.value = Utils.secondsToTime(routine.time);
  }

  function updateBtn(btn, frequency) {
    const day = parseInt(btn.dataset.day);
    btn.classList.toggle("selected", frequency.includes(day));
  }

  function updateDays(frequency, btns) {
    btns.forEach(btn => updateBtn(btn, frequency));
  }

  function clearErrors() {
    ERROR_ELEMENTS.forEach(id => {
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
    dayBtns: DOM.$$(".day-button")
  };

  function handleEdit(data) {
    const id = RoutineModal.getState("routineToEdit");

    RoutineService.update(id, data);
    RoutineRenderer.update(id);
    RoutineRenderer.updateNext();
    Toast.show("success", "toast_routine_updated");
  }

  function handleCreate(data) {
    const routine = {
      id: Date.now().toString(),
      ...data,
      active: true
    };

    RoutineService.add(routine);
    RoutineRenderer.updateAll();
    Toast.show("success", "toast_routine_created");
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

  function reset() {
    elements.form.reset();
    RoutineFormUtils.clearErrors();
    RoutineFormUtils.resetDays(elements.dayBtns);
    RoutineFormUtils.focusTitle(elements.titleInput);
  }

  function setCommandInput(command) {
    elements.commandInput.value = command;
    elements.commandInput.focus();
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

  function handleCommandInput(event) {
    const { value } = event.target;
    const visibleDropdown = CommandDropdown.getVisibleDropdown();

    if (value === "/") {
      CommandDropdown.open();
      return;
    }

    if (visibleDropdown) CommandDropdown.close();
  }

  function toggleDay(e) {
    const day = parseInt(e.target.dataset.day);
    if (isNaN(day)) return;

    e.target.classList.toggle("selected");
    const selected = e.target.classList.contains("selected");
    updateDays(day, selected);
  }

  const handlers = {
    submit: handleSubmit,
    commandInput: handleCommandInput,
    dayToggle: toggleDay
  };

  function bindEvents() {
    const bindings = [
      [elements.form, "submit", handlers.submit],
      [elements.commandInput, "input", handlers.commandInput],
      [elements.daysContainer, "click", handlers.dayToggle]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function init() {
    CommandDropdown.init();
    bindEvents();
  }

  return { init, setupEdit, reset, setCommandInput };
})();
