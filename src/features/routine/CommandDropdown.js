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

  function getCommands() {
    return SUGGESTIONS.map(s => s.command);
  }

  function createCard({ command, description, icon }) {
    return `
      <div class="suggestion-item" data-command="${command}">
        ${Icons.getIcon(icon)}
        <div class="suggestion-content">
          <div class="suggestion-command">${command}</div>
          <div class="suggestion-description">${description}</div>
        </div>
      </div>`;
  }

  function createItems() {
    return SUGGESTIONS.map(createCard).join("");
  }

  return { getCommands, createItems };
})();

const CommandDropdown = (() => {
  let visible = false;

  const elements = {
    dropdown: DOM.$("#command-dropdown")
  };

  function handleSuggestion(e) {
    const item = e.target.closest(".suggestion-item");
    if (!item) return;

    const { command } = item.dataset;

    if (command === "/open") {
      close();
      AppSelectorModal.open();
      return;
    }

    RoutineForm.setCommandInput(command);
    close();
  }

  function handleOutside(e) {
    if (!elements.dropdown.contains(e.target) && visible) {
      close();
    }
  }

  function handleCommandInput(e) {
    const { value } = e.target;
    value === "/" ? open() : visible && close();
  }

  function open() {
    visible = true;
    Modal.show(elements.dropdown);
  }

  function close() {
    visible = false;
    Modal.hide(elements.dropdown);
  }

  const handlers = {
    suggestion: handleSuggestion,
    outside: handleOutside
  };

  function bindEvents() {
    const events = [
      [elements.dropdown, "click", handlers.suggestion],
      [document, "click", handlers.outside]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function render() {
    elements.dropdown.innerHTML = CommandUtils.createItems();
  }

  function init() {
    render();
    bindEvents();
  }

  return {
    init,
    handleCommandInput
  };
})();
