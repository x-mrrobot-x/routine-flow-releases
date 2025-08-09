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

  const toggle = show => {
    DOM.commandDropdown.classList.toggle("show", show);
    isVisible = show;
  };

  const show = () => toggle(true);
  const hide = () => toggle(false);

  const handleOutsideClick = event => {
    if (!DOM.commandDropdown.contains(event.target) && isVisible) {
      hide();
    }
  };

  const handleSuggestionClick = event => {
    const item = event.target.closest(".suggestion-item");
    if (!item) return;

    const { command } = item.dataset;

    if (command === "/open") {
      hide();
      AppSelector.show();
      return;
    }

    DOM.commandInput.value = command;
    DOM.commandInput.focus();

    hide();
  };

  const handleInput = event => {
    const { value } = event.target;

    if (value === "/") {
      show();
    } else if (isVisible) {
      hide();
    }
  };

  const bindEvents = () => {
    const events = [
      [DOM.commandInput, "input", handleInput],
      [DOM.commandDropdown, "click", handleSuggestionClick],
      [document, "click", handleOutsideClick]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  };

  const renderSuggestions = () => {
    const suggestionItems = CommandUtils.createSuggestionItems();
    DOM.commandDropdown.innerHTML = suggestionItems;
  };

  const init = () => {
    renderSuggestions();
    bindEvents();
  };

  return {
    init,
    show,
    hide
  };
})();
