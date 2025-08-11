const EnvironmentManager = (() => {
  const WEB_ENV = {
    name: "web",
    langCode: "pt-BR",
    workDir: ".",
    iconPath: "/src/assets/icons/",

    async loadLang(code) {
      const response = await fetch(`${this.workDir}/src/lang/${code}.json`);
      return await response.json();
    },

    loadApps() {
      return DEFAULT_APPS_DATA;
    },

    getRoutines() {
      return localStorage.getItem("@routine-flow:routines");
    },

    saveRoutines(data) {
      localStorage.setItem("@routine-flow:routines", data);
    },

    getSettings() {
      return localStorage.getItem("@routine-flow:settings");
    },

    saveSettings(settings) {
      localStorage.setItem("@routine-flow:settings", settings);
    },

    exit() {
      alert("Fechando aplicação...");
    }
  };

  function detect() {
    const isWeb = typeof tk === "undefined";
    return isWeb ? WEB_ENV : TaskerEnvironment;
  }

  return { detect };
})();

const currentEnvironment = EnvironmentManager.detect();
