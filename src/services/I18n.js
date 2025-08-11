const I18n = (function (env) {
  const DEFAULT_LANG = "en";
  const APP_LANG = "pt";
  let data = {};

  function get(key) {
    return data[key] || key;
  }

  function isInput(el) {
    return el.tagName === "INPUT" || el.tagName === "TEXTAREA";
  }

  function translateEl(el) {
    const key = el.getAttribute("data-i18n");
    const text = get(key);

    if (isInput(el)) {
      el.placeholder = text;
    } else {
      el.textContent = text;
    }
  }

  function translateUI() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(translateEl);
  }

  function extractBase(lang) {
    return lang.split("-")[0];
  }

  async function loadData(lang) {
    try {
      data = await env.loadLang(extractBase(lang));
    } catch (error) {
      console.error("Error loading language data:", error);
      data = await env.loadLang(DEFAULT_LANG);
    }
  }

  function shouldTranslate() {
    return !env.langCode.includes(APP_LANG);
  }

  async function init() {
    await loadData(env.langCode);

    if (shouldTranslate()) {
      translateUI();
    }

    document.body.classList.remove("loading");
  }

  return { init, get };
})(currentEnvironment);
