const App = (() => {
  async function init() {
    Icons.init();
    await I18n.init();
    RoutineService.init();
    Render.init();
    EventManager.init();
    TimeService.init();
    Settings.init();
    AppSelector.init();
    CommandDropdown.init();
  }

  return {
    init
  };
})();

App.init();
