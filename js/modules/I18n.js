const I18n = (function (env) {
  const DEFAULT_LANGUAGE = "en";
  const APP_LANGUAGE = "pt";
  let data = {};

  function get(key) {
    return data[key] || key;
  }

  function translateUI() {
    const textElements = document.querySelectorAll("[data-i18n]");

    textElements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      const text = get(key);

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = text;
        return;
      }
      el.textContent = text;
    });
  }

  async function loadLanguage(lang) {
    try {
      const [baseLang] = lang.split("-");

      data = await env.execute("load_language", baseLang);
    } catch (error) {
      data = await env.execute("load_language", DEFAULT_LANGUAGE);
      console.error("Error: ", error);
    }
  }

  async function init() {
    await loadLanguage(env.lang);

    if (!env.lang.includes(APP_LANGUAGE)) {
      translateUI();
    }
    document.body.classList.remove("loading");
  }

  return {
    init,
    get
  };
})(currentEnvironment);
