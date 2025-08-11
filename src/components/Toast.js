const Toast = (() => {
  const elements = {
    container: DOM.$("#toast-container")
  };

  const ICONS = {
    success: "check-circle",
    error: "circle-alert"
  };

  const AUTO_DELAY = 3000;
  const ANIMATION_DELAY = 10;

  function create(type, message) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `${Icons.getIcon(ICONS[type])}<span>${message}</span>`;
    return toast;
  }

  function remove(toast) {
    if (toast.timer) {
      clearTimeout(toast.timer);
      toast.timer = null;
    }
    setTimeout(() => toast.remove(), ANIMATION_DELAY);
  }

  function setup(toast) {
    toast.addEventListener("click", () => remove(toast));
    toast.timer = setTimeout(() => remove(toast), AUTO_DELAY);
    elements.container.appendChild(toast);
  }

  function show(type, messageKey) {
    const message = I18n.get(messageKey);
    const toast = create(type, message);
    setup(toast);
  }

  return { show };
})();
