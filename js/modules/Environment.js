const WebEnvironment = {
  name: "web",
  lang: "pt-BR",

  execute(command, ...args) {
    const commandHandlers = {
      load_language: async lang => {
        const response = await fetch(`/js/languages/${lang}.json`);
        return await response.json();
      },

      get_routines: () => {
        return localStorage.getItem("@routine-flow:routines");
      },
      save_routines: data => {
        localStorage.setItem("@routine-flow:routines", data);
      },

      get_settings: () => {
        return localStorage.getItem("@routine-flow:settings");
      },
      save_settings: settings => {
        localStorage.setItem("@routine-flow:settings", settings);
      }
    };

    const handler = commandHandlers[command];
    if (handler) {
      return handler(...args);
    }
  },

  terminate() {
    alert("Fechando aplicação...");
  }
};

const EnvironmentManager = (() => {
  const detectEnvironment = () => {
    return typeof tk === "undefined" ? WebEnvironment : taskerEnvironment;
  };

  return {
    detectEnvironment
  };
})();

const currentEnvironment = EnvironmentManager.detectEnvironment();
