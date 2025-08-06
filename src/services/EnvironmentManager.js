const EnvironmentManager = (() => {
  const WebEnvironment = {
    name: "web",
    langCode: "pt-BR",
    workDir: ".",

    async loadLanguageData(langCode) {
      const response = await fetch(
        `${this.workDir}/src/lang/${langCode}.json`
      );
      return await response.json();
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

  const detectEnvironment = () => {
    const isWebEnvironment = typeof tk === "undefined";
    return isWebEnvironment ? WebEnvironment : TaskerEnvironment;
  };

  return {
    detectEnvironment
  };
})();

const currentEnvironment = EnvironmentManager.detectEnvironment();
