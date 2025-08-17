const AppPickerModal = (env => {
  const PAGE_SIZE = 20;
  const THRESHOLD_PX = 200;

  const elements = {
    modal: DOM.$("#app-picker-modal"),
    overlay: DOM.$("#app-picker-modal .modal-overlay"),
    cancelBtn: DOM.$("#cancel-app-picker"),
    grid: DOM.$("#apps-grid")
  };

  function createCard({ name, pkg }) {
    const iconSrc =
      env.name === "web"
        ? `${env.iconPath}${pkg}.png`
        : `${env.iconPath}${pkg}`;

    return `
    <div class="app-card" data-app="${name}">
      <img src="${iconSrc}" class="app-icon" />
      <p class="app-name">${name}</p>
    </div>`;
  }

  function createItems(apps) {
    return apps.map(createCard).join("");
  }

  function open() {
    Modal.show(elements.modal);
  }

  function close(goBack = false) {
    Modal.hide(elements.modal, goBack);
  }

  function handleAppSelect(e) {
    const card = e.target.closest(".app-card");
    if (!card) return;

    env.navigate(-1, {
      actions: [
        {
          module: "RoutineForm",
          method: "setCommandInput",
          params: [`/open ${card.dataset.app}`]
        }
      ]
    });

    close();
  }

  function handleCancel() {
    close(true);
  }

  function handleOverlay() {
    close(true);
  }

  function bindEvents() {
    const eventBindings = [
      [elements.cancelBtn, "click", handleCancel],
      [elements.overlay, "click", handleOverlay],
      [elements.grid, "click", handleAppSelect]
    ];

    eventBindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function appendApps(apps) {
    elements.grid.insertAdjacentHTML("beforeend", createItems(apps));
  }

  function render(data) {
    const apps = data || env.loadApps();
    elements.grid.innerHTML = "";

    const pager = PaginationManager.create({
      scrollElement: elements.grid,
      pageSize: PAGE_SIZE,
      thresholdPx: THRESHOLD_PX,
      renderAppend: appendApps
    });

    pager.init(apps);
  }

  function init() {
    render();
    bindEvents();
  }

  return {
    init,
    open,
    close,
    render
  };
})(currentEnvironment);
