const Toast = (() => {
  const TOAST_ICON_CONFIG = {
    success: "check-circle",
    error: "alert-circle",
    warning: "alert-triangle",
    info: "info"
  };

  const AUTO_REMOVE_DELAY = 3000;
  const REMOVE_ANIMATION_DELAY = 10;

  const createToastHTML = (type, message) => `
    ${Icons.getIcon(TOAST_ICON_CONFIG[type])}
    <span>${message}</span>
  `;

  const createToastElement = (type, message) => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = createToastHTML(type, message);
    return toast;
  };

  const clearToastTimer = toast => {
    if (toast.autoRemoveTimer) {
      clearTimeout(toast.autoRemoveTimer);
      toast.autoRemoveTimer = null;
    }
  };

  const removeToastWithAnimation = toast => {
    setTimeout(() => toast.remove(), REMOVE_ANIMATION_DELAY);
  };

  const removeToast = toast => {
    clearToastTimer(toast);
    removeToastWithAnimation(toast);
  };

  const attachClickHandler = toast => {
    toast.addEventListener("click", () => removeToast(toast));
  };

  const setupAutoRemoval = toast => {
    const autoRemoveTimer = setTimeout(() => {
      removeToast(toast);
    }, AUTO_REMOVE_DELAY);

    toast.autoRemoveTimer = autoRemoveTimer;
  };

  const addToastToDOM = toast => {
    DOM.toastContainer.appendChild(toast);
  };

  const initializeToast = toast => {
    attachClickHandler(toast);
    setupAutoRemoval(toast);
    addToastToDOM(toast);
  };

  const showToast = (type, messageKey) => {
    const message = I18n.get(messageKey);
    const toast = createToastElement(type, message);
    initializeToast(toast);
  };

  return {
    showToast
  };
})();
