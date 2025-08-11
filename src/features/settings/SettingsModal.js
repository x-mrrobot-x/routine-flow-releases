const SettingsModal = (() => {
  const elements = {
    btn: DOM.$("#settings-btn"),
    modal: DOM.$("#settings-modal"),
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

  function handleChange() {
    const settings = getCurrent();
    SettingsService.save(settings);
  }

  function open() {
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  const handlers = {
    open: open,
    close: close,
    change: handleChange
  };

  function bindEvents() {
    const events = [
      [elements.btn, "click", handlers.open],
      [elements.overlay, "click", handlers.close],
      [elements.modal, "change", handlers.change]
    ];

    events.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function applyToDOM(settings) {
    elements.voiceToggle.checked = settings.voice;
    elements.toastToggle.checked = settings.toast;
    elements.vibrateToggle.checked = settings.vibrate;
  }

  function init() {
    const settings = SettingsService.load();
    applyToDOM(settings);
    bindEvents();
  }

  return { init };
})();
