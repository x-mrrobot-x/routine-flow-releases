const AppSelectorModal = (env => {
  const elements = {
    modal: DOM.$("#app-selector-modal"),
    overlay: DOM.$("#app-selector-modal .modal-overlay"),
    cancelBtn: DOM.$("#cancel-app-selector"),
    grid: DOM.$("#apps-grid")
  };

  function createCard({ name, pkg }) {
    const iconPath =
      env.name === "web"
        ? `${env.iconPath}${pkg}.png`
        : `${env.iconPath}${pkg}`;

    return `
    <div class="app-card" data-app="${name}">
      <img src="${iconPath}" class="app-icon" loading="lazy" />
      <p class="app-name">${name}</p>
    </div>`;
  }

  function createItems(apps) {
    return apps.map(createCard).join("");
  }

  function handleAppSelect(e) {
    const card = e.target.closest(".app-card");
    if (!card) return;

    const appName = card.dataset.app;
    RoutineForm.setCommandInput(`/open ${appName}`);
    close();
  }

  function open() {
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  const handlers = {
    cancel: close,
    overlay: close,
    appSelect: handleAppSelect
  };

  function bindEvents() {
    const events = [
      [elements.cancelBtn, "click", handlers.cancel],
      [elements.overlay, "click", handlers.overlay],
      [elements.grid, "click", handlers.appSelect]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function appendApps(apps) {
    const html = createItems(apps);
    elements.grid.insertAdjacentHTML("beforeend", html);
  }

  function render(data) {
    const apps = data || env.loadApps();
    elements.grid.innerHTML = "";

    const appsPager = PaginationManager.create({
      scrollElement: elements.grid,
      pageSize: 10,
      thresholdPx: 200,
      renderAppend: appendApps
    });

    appsPager.init(apps);
  }

  function init() {
    render();
    bindEvents();
  }

  return {
    init,
    open,
    render
  };
})(currentEnvironment);
