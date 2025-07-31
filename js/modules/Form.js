const FormUtils = (() => {
  const ERROR_ELEMENTS = [
    "title-error",
    "description-error",
    "priority-error",
    "time-error",
    "days-error"
  ];

  const REQUIRED_FIELDS = {
    title: "form_error_title_required",
    description: "form_error_description_required",
    time: "form_error_time_required"
  };

  const getFormData = () => ({
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    priority: document.getElementById("priority").value,
    timeString: document.getElementById("time").value,
    timeInSeconds: Utils.timeToSeconds(document.getElementById("time").value),
    selectedDays: State.getState("selectedDays")
  });

  const validateField = (field, value, errors, showErrorFn) => {
    if (!value) {
      showErrorFn(`${field}-error`, I18n.get(REQUIRED_FIELDS[field]));
      errors.push(field);
    }
  };

  const validateForm = (formData, showErrorFn) => {
    const errors = [];

    validateField("title", formData.title, errors, showErrorFn);
    validateField("description", formData.description, errors, showErrorFn);
    validateField("time", formData.timeString, errors, showErrorFn);

    if (formData.selectedDays.length === 0) {
      showErrorFn("days-error", I18n.get("form_error_days_required"));
      errors.push("days");
    }

    return errors.length === 0;
  };

  const createRoutineData = formData => ({
    title: formData.title,
    description: formData.description,
    priority: formData.priority,
    time: formData.timeInSeconds,
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
    const routineToEdit = State.getState("routineToEdit");
    Data.updateRoutine(routineToEdit, routineData);
    Toast.showToast("success", "toast_routine_updated");
  };

  const handleCreateMode = routineData => {
    const newRoutine = {
      id: Date.now().toString(),
      ...routineData,
      active: true
    };

    Data.addRoutine(newRoutine);
    Render.updateRoutinesCount();
    Toast.showToast("success", "toast_routine_created");
  };

  const finalizeSave = () => {
    Render.renderRoutines();
    Modal.closeModal();
    Data.saveRoutines();
  };

  function handleFormSubmit(e) {
    e.preventDefault();
    FormUtils.clearErrors();

    const formData = FormUtils.getFormData();

    if (!FormUtils.validateForm(formData, showError)) return;

    const routineData = FormUtils.createRoutineData(formData);

    if (State.getState("isEditMode")) {
      handleEditMode(routineData);
    } else {
      handleCreateMode(routineData);
    }

    finalizeSave();
  }

  function toggleDaySelection(e) {
    const dayNumber = parseInt(e.target.dataset.day);
    e.target.classList.toggle("selected");

    let selectedDays = State.getState("selectedDays");

    if (e.target.classList.contains("selected")) {
      selectedDays.push(dayNumber);
    } else {
      selectedDays = selectedDays.filter(day => day !== dayNumber);
    }

    State.setState("selectedDays", selectedDays);
  }

  function clearFormErrors() {
    FormUtils.clearErrors();
  }

  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = message;
  }

  return {
    handleFormSubmit,
    toggleDaySelection,
    clearFormErrors,
    showError
  };
})();
