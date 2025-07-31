const WebEnvironment = {
  name: "web",
  lang: "pt-BR",

  execute(command, ...args) {
    const commandHandlers = {
      get_routines: () => {
        const storedRoutines = localStorage.getItem("routines");
        return storedRoutines ? JSON.parse(storedRoutines) : routineData;
      },

      load_language: async lang => {
        const response = await fetch(`/js/languages/${lang}.json`);
        return await response.json();
      },

      save_routines: data => {
        localStorage.setItem("routines", data);
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
