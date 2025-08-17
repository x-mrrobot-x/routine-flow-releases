const AppPickerModal = (() => {
  const PAGE_SIZE = 15;
  const THRESHOLD_PX = 200;

  const elements = {
    modal: DOM.$("#app-picker-modal"),
    overlay: DOM.$("#app-picker-modal .modal-overlay"),
    btn: DOM.$("#cancel-app-picker"),
    grid: DOM.$("#apps-grid")
  };

  function createCard({ name, pkg }) {
    const iconSrc =
      ENV.name === "web"
        ? `${ENV.iconPath}${pkg}.png`
        : `${ENV.iconPath}${pkg}`;

    return `<div class="app-card" data-app="${name}">
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

  function close() {
    Modal.hide(elements.modal);
  }

  function handleAppSelect(e) {
    const card = e.target.closest(".app-card");
    if (!card) return;

    RoutineForm.setCommandInput(`/open ${card.dataset.app}`);
    close();
  }

  const handlers = {
    appSelect: handleAppSelect,
    cancel: close,
    overlay: close
  };

  function bindEvents() {
    const bindings = [
      [elements.btn, "click", handlers.cancel],
      [elements.overlay, "click", handlers.overlay],
      [elements.grid, "click", handlers.appSelect]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function appendApps(apps) {
    elements.grid.insertAdjacentHTML("beforeend", createItems(apps));
  }

  function render(data) {
    const apps = data || ENV.loadApps();
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
})();
