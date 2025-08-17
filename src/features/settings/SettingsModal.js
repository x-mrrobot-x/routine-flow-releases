const SettingsModal = (() => {
  const elements = {
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

  function open() {
    Modal.show(elements.modal);
  }

  function close(goBack = false) {
    Modal.hide(elements.modal, goBack);
  }

  function handleChange() {
    const settings = getCurrent();
    SettingsService.save(settings);
  }

  function handleOverlay() {
    close(true);
  }

  function bindEvents() {
    const eventBindings = [
      [elements.modal, "change", handleChange],
      [elements.overlay, "click", handleOverlay]
    ];

    eventBindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );
  }

  function applyToDOM(settings) {
    elements.voiceToggle.checked = settings.voice;
    elements.toastToggle.checked = settings.toast;
    elements.vibrateToggle.checked = settings.vibrate;
    
  }

  function render() {
    const settings = SettingsService.load();
    applyToDOM(settings);
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
