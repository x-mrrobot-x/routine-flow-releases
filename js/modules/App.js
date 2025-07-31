const App = (() => {
  function init() {
    Data.init();
    Render.init();
    Event.init();
  }

  return {
    init
  };
})();

App.init();
