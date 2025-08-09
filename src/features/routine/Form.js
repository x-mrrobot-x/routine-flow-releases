const FormUtils = (() => {
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

  const getFormData = () => ({
    title: getFieldValue(DOM.titleInput),
    description: getFieldValue(DOM.descriptionInput),
    priority: getFieldValue(DOM.prioritySelect),
    time: Utils.timeToSeconds(getFieldValue(DOM.timeInput)),
    selectedDays: AppState.getState("selectedDays"),
    command: getFieldValue(DOM.commandInput)
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

  const createRoutineData = formData => ({
    title: formData.title,
    description: formData.description,
    command: formData.command,
    priority: formData.priority,
    time: formData.time,
    frequency: [...formData.selectedDays]
  });

  const clearErrors = () => {
    ERROR_ELEMENTS.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = "";
    });
  };

  return {
    getFormData,
    validateForm,
    createRoutineData,
    clearErrors
  };
})();

const Form = (() => {
  const handleEditMode = routineData => {
    const routineToEdit = AppState.getState("routineToEdit");
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
    Render.updateAll();
    Modal.closeModal();
    RoutineService.saveRoutines();
  };

  const updateSelectedDays = (dayNumber, isSelected) => {
    let selectedDays = AppState.getState("selectedDays");

    selectedDays = isSelected
      ? [...selectedDays, dayNumber]
      : selectedDays.filter(day => day !== dayNumber);

    AppState.setState("selectedDays", selectedDays);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    FormUtils.clearErrors();

    const formData = FormUtils.getFormData();

    if (!FormUtils.validateForm(formData, showError)) return;

    const routineData = FormUtils.createRoutineData(formData);

    if (AppState.getState("isEditMode")) {
      handleEditMode(routineData);
    } else {
      handleCreateMode(routineData);
    }

    finalizeSave();
  };

  const toggleDaySelection = e => {
    const dayNumber = parseInt(e.target.dataset.day);
    e.target.classList.toggle("selected");

    const isSelected = e.target.classList.contains("selected");
    updateSelectedDays(dayNumber, isSelected);
  };

  const clearFormErrors = () => {
    FormUtils.clearErrors();
  };

  const showError = (elementId, message) => {
    const element = document.getElementById(elementId);
    if (element) element.textContent = message;
  };

  return {
    handleFormSubmit,
    toggleDaySelection,
    clearFormErrors,
    showError
  };
})();
