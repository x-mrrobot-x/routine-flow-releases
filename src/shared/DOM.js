const DOM = (() => {
  function $(selector, el = document) {
    return el.querySelector(selector);
  }

  function $$(selector, el = document) {
    return el.querySelectorAll(selector);
  }

  return { $, $$ };
})();
