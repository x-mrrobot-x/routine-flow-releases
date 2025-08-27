const SettingsModal = (() => {
  const elements = {
    btn: DOM.$("#settings-btn"),
    modal: DOM.$("#settings-modal"),
    closeBtn: DOM.$("#settings-modal-close"),
    overlay: DOM.$("#settings-modal .modal-overlay"),
    voiceToggle: DOM.$("#voice-toggle"),
    toastToggle: DOM.$("#toast-toggle"),
    vibrateToggle: DOM.$("#vibrate-toggle")
  };

  function getCurrent() {
    return {
      voice: elements.voiceToggle.checked,
      toast: elements.toastToggle.checked,
      vibrate: elements.vibrateToggle.checked
    };
  }

  function open() {
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  function handleChange() {
    const settings = getCurrent();
    SettingsService.save(settings);
  }

  const handlers = {
    change: handleChange,
    close: close,
    button: open,
    overlay: close
  };

  function bindEvents() {
    const bindings = [
      [elements.btn, "click", handlers.button],
      [elements.closeBtn, "click", handlers.close],
      [elements.modal, "change", handlers.change],
      [elements.overlay, "click", handlers.overlay]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function render() {
    const settings = SettingsService.load();
    elements.voiceToggle.checked = settings.voice;
    elements.toastToggle.checked = settings.toast;
    elements.vibrateToggle.checked = settings.vibrate;
  }

  function init() {
    render();
    bindEvents();
  }

  return {
    init,
    open,
    close
  };
})();
