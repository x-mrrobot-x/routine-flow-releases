const AppSelectorModal = (env => {
  const elements = {
    modal: DOM.$("#app-selector-modal"),
    overlay: DOM.$("#app-selector-modal .modal-overlay"),
    cancelButton: DOM.$("#cancel-app-selector"),
    grid: DOM.$("#apps-grid")
  };

  const createAppCard = ({ name, pkg }) => {
    const iconPath =
      env.name === "web"
        ? `${env.iconPath}${pkg}.png`
        : `${env.iconPath}${pkg}`;

    return `
    <div class="app-card" data-app="${name}">
      <img src="${iconPath}" class="app-icon" />
      <p class="app-name">${name}</p>
    </div>
  `;
  };

  function open() {
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  const handleAppSelector = event => {
    const appItem = event.target.closest(".app-card");
    if (!appItem) return;

    const appName = appItem.dataset.app;
    RoutineForm.setCommandInput(`/open ${appName}`);
    close();
  };

  const bindEvents = () => {
    const events = [
      [elements.cancelButton, "click", close],
      [elements.overlay, "click", close],
      [elements.grid, "click", handleAppSelector]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  };

  const renderApps = appsData => {
    const apps = appsData ? appsData : env.loadAppsData();
    elements.grid.innerHTML = apps.map(createAppCard).join("");
  };

  const init = () => {
    renderApps();
    bindEvents();
  };

  return {
    init,
    open,
    renderApps
  };
})(currentEnvironment);
