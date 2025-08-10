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

  const getFieldValue = el => el.value.trim();

  const getFormData = ({
    titleInput,
    descriptionInput,
    prioritySelect,
    timeInput,
    commandInput
  }) => ({
    title: getFieldValue(titleInput),
    description: getFieldValue(descriptionInput),
    priority: getFieldValue(prioritySelect),
    time: Utils.timeToSeconds(getFieldValue(timeInput)),
    selectedDays: RoutineModal.getState("selectedDays"),
    command: getFieldValue(commandInput)
  });

  const validateField = (field, value, errors, showErrorFn) => {
    if (!value) {
      showErrorFn(`${field}-error`, I18n.get(REQUIRED_FIELDS[field]));
      errors.push(field);
    }
  };

  const validateCommandField = (command, errors, showErrorFn) => {
    if (command) {
      const validCommands = CommandUtils.getCommands();

      const startsWithValidCommand = validCommands.some(validCmd =>
        command.startsWith(validCmd)
      );

      if (!startsWithValidCommand) {
        showErrorFn("command-error", I18n.get("form_error_command_invalid"));
        errors.push("command");
      }
    }
  };

  const validateDaysField = (selectedDays, errors, showErrorFn) => {
    if (selectedDays.length === 0) {
      showErrorFn("days-error", I18n.get("form_error_days_required"));
      errors.push("days");
    }
  };

  const validateForm = (formData, showErrorFn) => {
    const errors = [];

    validateField("title", formData.title, errors, showErrorFn);
    validateField("description", formData.description, errors, showErrorFn);
    validateCommandField(formData.command, errors, showErrorFn);
    validateField("time", formData.time, errors, showErrorFn);
    validateDaysField(formData.selectedDays, errors, showErrorFn);

    return errors.length === 0;
  };

  const createRoutineData = formData => {
    const sortedFrequency = formData.selectedDays.sort();

    return {
      title: formData.title,
      description: formData.description,
      command: formData.command,
      priority: formData.priority,
      time: formData.time,
      frequency: [...sortedFrequency]
    };
  };

  function populateFormFields(routine, elements) {
    elements.titleInput.value = routine.title;
    elements.descriptionInput.value = routine.description;
    elements.commandInput.value = routine.command;
    elements.prioritySelect.value = routine.priority;
    elements.timeInput.value = Utils.secondsToTime(routine.time);
  }

  const updateDayButtonSelection = (button, frequency) => {
    const dayNumber = parseInt(button.dataset.day);
    const isSelected = frequency.includes(dayNumber);
    button.classList.toggle("selected", isSelected);
  };

  const updateDaySelection = (frequency, dayButtons) => {
    dayButtons.forEach(button => {
      updateDayButtonSelection(button, frequency);
    });
  };

  const clearErrors = () => {
    ERROR_ELEMENTS.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = "";
    });
  };

  function resetDaySelection(dayButtons) {
    dayButtons.forEach(button => {
      button.classList.remove("selected");
    });
  }

  function focusTitle(titleInput) {
    requestAnimationFrame(() => titleInput.focus());
  }

  return {
    getFormData,
    validateForm,
    createRoutineData,
    populateFormFields,
    updateDaySelection,
    clearErrors,
    resetDaySelection,
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
    dayButtons: DOM.$$(".day-button")
  };

  function setCommandInput(command) {
    elements.commandInput.value = command;
    elements.commandInput.focus();
  }

  const handleEditMode = routineData => {
    const routineToEdit = RoutineModal.getState("routineToEdit");
    RoutineService.updateRoutine(routineToEdit, routineData);
    Toast.showToast("success", "toast_routine_updated");
  };

  const handleCreateMode = routineData => {
    const newRoutine = {
      id: Date.now().toString(),
      ...routineData,
      active: true
    };

    RoutineService.addRoutine(newRoutine);
    Toast.showToast("success", "toast_routine_created");
  };

  const finalizeSave = () => {
    RoutineRenderer.updateAll();
    RoutineModal.close();
    RoutineService.saveRoutines();
  };

  const updateSelectedDays = (dayNumber, isSelected) => {
    let selectedDays = RoutineModal.getState("selectedDays");

    selectedDays = isSelected
      ? [...selectedDays, dayNumber]
      : selectedDays.filter(day => day !== dayNumber);

    RoutineModal.setState("selectedDays", selectedDays);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    RoutineFormUtils.clearErrors();

    const formData = RoutineFormUtils.getFormData(elements);

    if (!RoutineFormUtils.validateForm(formData, showError)) return;

    const routineData = RoutineFormUtils.createRoutineData(formData);

    if (RoutineModal.getState("isEditMode")) {
      handleEditMode(routineData);
    } else {
      handleCreateMode(routineData);
    }

    finalizeSave();
  };

  function setupEditForm(routine) {
    RoutineFormUtils.populateFormFields(routine, elements);
    RoutineFormUtils.updateDaySelection(routine.frequency, elements.dayButtons);
    RoutineFormUtils.clearErrors();
    RoutineFormUtils.focusTitle(elements.titleInput);
  }

  const toggleDaySelection = e => {
    const dayNumber = parseInt(e.target.dataset.day);
    e.target.classList.toggle("selected");

    const isSelected = e.target.classList.contains("selected");
    updateSelectedDays(dayNumber, isSelected);
  };

  function resetForm() {
    elements.form.reset();
    RoutineFormUtils.clearErrors();
    RoutineFormUtils.resetDaySelection(elements.dayButtons);
    RoutineFormUtils.focusTitle(elements.titleInput);
  }

  const showError = (elementId, message) => {
    const element = document.getElementById(elementId);
    if (element) element.textContent = message;
  };

  function bindEvents() {
    const events = [
      [elements.form, "submit", handleFormSubmit],
      [elements.commandInput, "input", CommandDropdown.handleCommandInput],
      [elements.daysContainer, "click", toggleDaySelection]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  }

  const init = () => {
    bindEvents();
  };

  return {
    init,
    handleFormSubmit,
    toggleDaySelection,
    setupEditForm,
    showError,
    resetForm,
    setCommandInput
  };
})();
