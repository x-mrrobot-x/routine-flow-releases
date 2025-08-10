const App = (() => {
  async function init() {
    Icons.init();
    await I18n.init();
    RoutineService.init();
    RoutineRenderer.init();
    TimeService.init();
    RoutineFilter.init();
    SettingsModal.init();
    RoutineActions.init();
    RoutineModal.init();
    DeleteRoutineModal.init();
    CommandDropdown.init();
    AppSelectorModal.init();
  }

  return {
    init
  };
})();

App.init();
