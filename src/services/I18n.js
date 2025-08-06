const I18n = (function (env) {
  const DEFAULT_LANGUAGE = "en";
  const APP_LANGUAGE = "pt";
  let languageData = {};

  const get = key => languageData[key] || key;

  const isInputElement = element =>
    element.tagName === "INPUT" || element.tagName === "TEXTAREA";

  const translateElement = element => {
    const key = element.getAttribute("data-i18n");
    const text = get(key);

    if (isInputElement(element)) {
      element.placeholder = text;
    } else {
      element.textContent = text;
    }
  };

  const translateUI = () => {
    const textElements = document.querySelectorAll("[data-i18n]");
    textElements.forEach(translateElement);
  };

  const extractBaseLang = lang => lang.split("-")[0];

  const loadLanguageData = async lang => {
    try {
      return await env.loadLanguageData(extractBaseLang(lang));
    } catch (error) {
      console.error("Error loading language data:", error);
      return await env.loadLanguageData(DEFAULT_LANGUAGE);
    }
  };

  const shouldTranslateUI = () => !env.langCode.includes(APP_LANGUAGE);

  const init = async () => {
    languageData = await loadLanguageData(env.langCode);

    if (shouldTranslateUI()) {
      translateUI();
    }

    document.body.classList.remove("loading");
  };

  return {
    init,
    get
  };
})(currentEnvironment);
