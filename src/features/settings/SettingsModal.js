const SettingsModal = (() => {
  const elements = {
    button: DOM.$("#settings-button"),
    modal: DOM.$("#settings-modal"),
    overlay: DOM.$("#settings-modal .modal-overlay"),
    voiceToggle: DOM.$("#voice-toggle"),
    toastToggle: DOM.$("#toast-toggle"),
    vibrateToggle: DOM.$("#vibrate-toggle")
  };

  const getCurrentSettings = () => ({
    voice: elements.voiceToggle.checked,
    toast: elements.toastToggle.checked,
    vibrate: elements.vibrateToggle.checked
  });

  const handleSettingsChange = () => {
    const settings = getCurrentSettings();
    SettingsService.saveSettings(settings);
  };

  function openModal() {
    Modal.show(elements.modal);
  }

  function closeModal() {
    Modal.hide(elements.modal);
  }

  function bindEvents() {
    const events = [
      [elements.button, "click", openModal],
      [elements.overlay, "click", closeModal],
      [elements.modal, "change", handleSettingsChange]
    ];

    events.forEach(([element, event, handler]) =>
      element.addEventListener(event, handler)
    );
  }

  const applySettingsToDOM = settings => {
    elements.voiceToggle.checked = settings.voice;
    elements.toastToggle.checked = settings.toast;
    elements.vibrateToggle.checked = settings.vibrate;
  };

  function init() {
    const storedSettings = SettingsService.loadSettings();
    applySettingsToDOM(storedSettings);
    bindEvents();
  }

  return {
    init
  };
})();
