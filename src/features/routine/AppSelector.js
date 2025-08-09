const AppSelector = (env => {
  const toggleModal = show => {
    DOM.appModal.classList.toggle("show", show);
  };

  const show = () => toggleModal(true);
  const hide = () => toggleModal(false);

  const handleAppSelector = event => {
    const appItem = event.target.closest(".app-card");
    if (!appItem) return;

    const appName = appItem.dataset.app;
    DOM.commandInput.value = `/open ${appName}`;
    DOM.commandInput.focus();

    hide();
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

  const renderApps = appsData => {
    const apps = appsData ? appsData : env.loadAppsData();
    DOM.appsGrid.innerHTML = apps.map(createAppCard).join("");
  };

  const bindEvents = () => {
    const events = [
      [DOM.cancelAppSelector, "click", hide],
      [DOM.appsModalOverlay, "click", hide],
      [DOM.appsGrid, "click", handleAppSelector]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  };

  const init = () => {
    renderApps();
    bindEvents();
  };

  return {
    init,
    show,
    hide,
    renderApps
  };
})(currentEnvironment);
