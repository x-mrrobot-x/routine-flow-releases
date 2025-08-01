const App = (() => {
  async function init() {
    Icons.init();
    await I18n.init();
    Data.init();
    Render.init();
    Event.init();
    Settings.init();
  }

  return {
    init
  };
})();

App.init();
