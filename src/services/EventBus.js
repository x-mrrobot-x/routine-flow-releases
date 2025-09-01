const EventBus = (() => {
  const events = {};

  function on(event, listener) {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(listener);
  }

  function emit(event, ...args) {
    if (!events[event]) {
      return;
    }
    events[event].forEach(listener => listener(...args));
  }

  return {
    on,
    emit
  };
})();
