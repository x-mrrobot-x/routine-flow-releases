const SettingsService = (env => {
  const DEFAULT_SETTINGS = {
    voice: true,
    toast: true,
    vibrate: false
  };

  const saveSettings = settings => {
    env.saveSettings(JSON.stringify(settings, null, 2));
  };

  const loadSettings = () => {
    const storedSettings = env.getSettings();

    if (!storedSettings) {
      saveSettings(DEFAULT_SETTINGS);
    }

    return storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
  };

  return {
    loadSettings,
    saveSettings
  };
})(currentEnvironment);
