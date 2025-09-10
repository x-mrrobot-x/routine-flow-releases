const EnvironmentManager = (() => {
  const WebEnvironment = (() => {
    const NAME = "web";
    const WORK_DIR = ".";
    const LANG_CODE = "pt-BR";
    const ICON_PATH = "/src/assets/icons/";

    const STORAGE_KEYS = {
      routines: "@routine-flow:routines",
      settings: "@routine-flow:settings",
      categories: "@routine-flow:categories"
    };

    async function loadLang(code) {
      const response = await fetch(`${WORK_DIR}/src/locales/${code}.json`);
      return await response.json();
    }

    function loadApps() {
      return DEFAULT_APPS;
    }

    function loadTasks() {
      return DEFAULT_TASKS;
    }

    function getCategories() {
      return localStorage.getItem(STORAGE_KEYS.categories);
    }

    function saveCategories(data) {
      localStorage.setItem(STORAGE_KEYS.categories, data);
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
      loadTasks,
      getCategories,
      saveCategories,
      getRoutines,
      saveRoutines,
      getSettings,
      saveSettings,
      exit
    };
  })();

  const TaskerEnvironment = (() => {
    const NAME = "tasker";
    const LANG_CODE = tk.local("sys_lang_code") || "en";
    const WORK_DIR = "%project_path";
    const PRIORITY = 100;
    const ICON_PATH =
      "content://net.dinglisch.android.taskerm.iconprovider//app/";

    function loadLang(code) {
      const storedLanguage = tk.shell(
        `cat "${WORK_DIR}/src/locales/${code}.json" 2>/dev/null`, false, 2000
      );
      if (!storedLanguage) throw new Error("");
      return JSON.parse(storedLanguage);
    }

    function loadApps() {
      tk.performTask(
        "RF 06 - ACTIONS HANDLER",
        PRIORITY,
        "load_apps",
        "",
        "",
        true,
        true,
        "",
        true
      );
      return [];
    }

    function loadTasks() {
      tk.performTask(
        "RF 06 - ACTIONS HANDLER",
        PRIORITY,
        "load_tasks",
        "",
        "",
        true,
        true,
        "",
        true
      );
      return [];
    }

    function getCategories() {
      const data = tk.local("category_data");
      const isValid = !data.match(/^.[a-z_]+/);
      return isValid ? data : null;
    }

    function saveCategories(data) {
      tk.performTask(
        "RF 06 - ACTIONS HANDLER",
        PRIORITY,
        "update_categories",
        data,
        "",
        true,
        true,
        "",
        true
      );
    }

    function getRoutines() {
      const data = tk.local("routine_data");
      const isValid = !data.match(/^.[a-z_]+/);
      return isValid ? data : null;
    }

    function saveRoutines(data) {
      tk.performTask(
        "RF 06 - ACTIONS HANDLER",
        PRIORITY,
        "update_routines",
        data,
        "",
        true,
        true,
        "",
        true
      );
    }

    function getSettings() {
      return tk.global("RF_SETTINGS");
    }

    function saveSettings(settings) {
      tk.setGlobal("RF_SETTINGS", settings);
    }

    return {
      name: NAME,
      langCode: LANG_CODE,
      workDir: WORK_DIR,
      iconPath: ICON_PATH,
      loadLang,
      loadApps,
      loadTasks,
      getCategories,
      saveCategories,
      getRoutines,
      saveRoutines,
      getSettings,
      saveSettings
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
