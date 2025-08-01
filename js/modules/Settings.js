const Settings = (() => {
  const DEFAULT_SETTINGS = {
    voice: true,
    toast: true,
    vibrate: false
  };

  const saveSettings = settings => {
    currentEnvironment.execute(
      "save_settings",
      JSON.stringify(settings, null, 2)
    );
  };

  const getStoredSettings = () => {
    const storedSettings = currentEnvironment.execute("get_settings");
    return storedSettings ? JSON.parse(storedSettings) : null;
  };

  const getCurrentSettings = () => ({
    voice: DOM.voiceToggle.checked,
    toast: DOM.toastToggle.checked,
    vibrate: DOM.vibrateToggle.checked
  });

  const applySettingsToDOM = settings => {
    DOM.voiceToggle.checked = settings.voice;
    DOM.toastToggle.checked = settings.toast;
    DOM.vibrateToggle.checked = settings.vibrate;
  };

  const handleSettingsChange = () => {
    const settings = getCurrentSettings();
    saveSettings(settings);
  };

  const openSettingsModal = () => {
    ModalUtils.showModal(DOM.settingsModal);
  };

  const closeSettingsModal = () => {
    ModalUtils.hideModal(DOM.settingsModal);
  };

  const loadSettings = () => {
    const storedSettings = getStoredSettings() || DEFAULT_SETTINGS;

    if (!getStoredSettings()) {
      saveSettings(storedSettings);
    }

    applySettingsToDOM(storedSettings);
  };

  const init = () => {
    loadSettings();
  };

  return {
    init,
    openSettingsModal,
    closeSettingsModal,
    handleSettingsChange
  };
})();
