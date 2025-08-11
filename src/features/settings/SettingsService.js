const SettingsService = (env => {
  const DEFAULT_SETTINGS = {
    voice: true,
    toast: true,
    vibrate: false
  };

  function save(settings) {
    env.saveSettings(JSON.stringify(settings, null, 2));
  }

  function load() {
    const stored = env.getSettings();

    if (!stored) {
      save(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }

    return JSON.parse(stored);
  }

  return {
    load,
    save
  };
})(currentEnvironment);
