const App = (() => {
  async function init() {
    Icons.init();
    await I18n.init();
    RoutineService.init();
    CategoryService.init();
    CategoryRenderer.init();
    RoutineRenderer.init();
    TimeService.init();
    RoutineFilter.init();
    RoutineActions.init();

    SettingsModal.init();
    CategoryModal.init();
    RoutineModal.init();
    DeleteRoutineModal.init();
    AppPickerModal.init();
  }

  return { init };
})();

App.init();
