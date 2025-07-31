const Toast = (() => {
  function createToastElement(type, message) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = type === "success" ? "check-circle" : "alert-circle";

    toast.innerHTML = `
      ${Icons.getIcon(icon)}
      <span>${message}</span>
    `;

    return toast;
  }

  function removeToast(toast) {
    clearTimeout(toast.autoRemoveTimer);
    setTimeout(() => toast.remove(), 10);
  }

  function attachEventListeners(toast) {
    toast.addEventListener("click", () => {
      removeToast(toast);
    });
  }

  function setupAutoRemoval(toast) {
    const autoRemoveTimer = setTimeout(() => {
      removeToast(toast);
    }, 3000);

    toast.autoRemoveTimer = autoRemoveTimer;
  }

  function addToastToDOM(toast) {
    DOM.toastContainer.appendChild(toast);
  }

  function showToast(type, messageKey) {
    const message = I18n.get(messageKey);
    const toast = createToastElement(type, message);
    attachEventListeners(toast);
    setupAutoRemoval(toast);
    addToastToDOM(toast);
  }

  return {
    showToast
  };
})();
