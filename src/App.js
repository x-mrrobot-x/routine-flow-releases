const App = (() => {
  async function init() {
    Icons.init();
    await I18n.init();
    RoutineService.init();
    Render.init();
    EventManager.init();
    Settings.init();
    TimeService.init();
  }

  return {
    init
  };
})();

App.init();
