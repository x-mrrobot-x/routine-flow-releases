Object.assign(window, {
  RoutineRenderer,
  RoutineService,
  RoutineForm,
  RoutineModal,
  DeleteRoutineModal,
  CommandDropdown,
  AppPickerModal,
  SettingsModal,
  Toast
});

const App = (() => {
  async function init() {
    Icons.init();
    await I18n.init();
    RoutineService.init();
    RoutineRenderer.init();
    TimeService.init();
    RoutineFilter.init();
    RoutineActions.init();

    SettingsModal.init();
    RoutineModal.init();
    DeleteRoutineModal.init();
    AppPickerModal.init();
  }

  return { init };
})();

App.init();
