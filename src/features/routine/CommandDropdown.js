const CommandUtils = (() => {
  const SUGGESTIONS = [
    {
      command: "/open",
      description: "Abrir um aplicativo quando a rotina for acionada",
      icon: "settings"
    },
    {
      command: "/kill",
      description: "Encerrar um aplicativo quando a rotina for acionada",
      icon: "circle-stop"
    },
    {
      command: "/execute",
      description: "Executar um comando personalizado",
      icon: "terminal"
    },
    {
      command: "/timer",
      description: "Iniciar um temporizador específico",
      icon: "clock"
    }
  ];

  const getCommands = () => SUGGESTIONS.map(s => s.command);

  const createSuggestionCard = ({ command, description, icon }) => {
    return `
      <div class="suggestion-item" data-command="${command}">
        ${Icons.getIcon(icon)}
        <div class="suggestion-content">
          <div class="suggestion-command">${command}</div>
          <div class="suggestion-description">${description}</div>
        </div>
      </div>`;
  };

  const createSuggestionItems = () => {
    return SUGGESTIONS.map(createSuggestionCard).join("");
  };

  return {
    getCommands,
    createSuggestionItems
  };
})();

const CommandDropdown = (() => {
  let isVisible = false;

  const elements = {
    dropdown: DOM.$("#command-dropdown")
  };

  function open() {
    isVisible = true;
    Modal.show(elements.dropdown);
  }

  function close() {
    isVisible = false;
    Modal.hide(elements.dropdown);
  }

  const handleCommandInput = event => {
    const { value } = event.target;

    if (value === "/") {
      open();
    } else if (isVisible) {
      close();
    }
  };

  const handleOutsideClick = event => {
    if (!elements.dropdown.contains(event.target) && isVisible) {
      close();
    }
  };

  const handleSuggestionClick = event => {
    const item = event.target.closest(".suggestion-item");
    if (!item) return;

    const { command } = item.dataset;

    if (command === "/open") {
      close();
      AppSelectorModal.open();
      return;
    }

    RoutineForm.setCommandInput(command);

    close();
  };

  const bindEvents = () => {
    const events = [
      [elements.dropdown, "click", handleSuggestionClick],
      [document, "click", handleOutsideClick]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  };

  const renderSuggestions = () => {
    const suggestionItems = CommandUtils.createSuggestionItems();
    elements.dropdown.innerHTML = suggestionItems;
  };

  const init = () => {
    renderSuggestions();
    bindEvents();
  };

  return {
    init,
    handleCommandInput
  };
})();
