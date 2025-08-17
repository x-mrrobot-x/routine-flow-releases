const EnvironmentManager = (() => {
  const WebEnvironment = (() => {
    const NAME = "web";
    const WORK_DIR = ".";
    const LANG_CODE = "pt-BR";
    const ICON_PATH = "/src/assets/icons/";

    const STORAGE_KEYS = {
      routines: "@routine-flow:routines",
      settings: "@routine-flow:settings"
    };

    async function loadLang(code) {
      const response = await fetch(`${WORK_DIR}/src/lang/${code}.json`);
      return await response.json();
    }

    function loadApps() {
      return DEFAULT_APPS_DATA;
    }

    function getRoutines() {
      return localStorage.getItem(STORAGE_KEYS.routines);
    }

    function saveRoutines(data) {
      localStorage.setItem(STORAGE_KEYS.routines, data);
    }

    function getSettings() {
      return localStorage.getItem(STORAGE_KEYS.settings);
    }

    function saveSettings(settings) {
      localStorage.setItem(STORAGE_KEYS.settings, settings);
    }

    function exit() {
      alert("Fechando aplicação...");
    }

    return {
      name: NAME,
      langCode: LANG_CODE,
      workDir: WORK_DIR,
      iconPath: ICON_PATH,
      loadLang,
      loadApps,
      getRoutines,
      saveRoutines,
      getSettings,
      saveSettings,
      exit
    };
  })();

  function detect() {
    return typeof tk === "undefined" ? WebEnvironment : TaskerEnvironment;
  }

  return {
    detect
  };
})();

const ENV = EnvironmentManager.detect();
