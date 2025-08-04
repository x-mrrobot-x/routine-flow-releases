const IconUtils = (() => {
  const mergeAttributes = (defaultAttrs, customAttrs = {}) => ({
    ...defaultAttrs,
    ...customAttrs
  });

  const buildAttrString = attrs => {
    return Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
  };

  const copyAttributes = (source, attributes) => {
    const attrs = {};
    attributes.forEach(attr => {
      const value = source.getAttribute(attr);
      if (value) attrs[attr] = value;
    });
    return attrs;
  };

  const buildSvg = (content, attrs = {}) => {
    const attrString = buildAttrString(attrs);
    return `<svg ${attrString}>${content}</svg>`;
  };

  const createElement = htmlString => {
    const temp = document.createElement("div");
    temp.innerHTML = htmlString;
    const el = temp.firstElementChild;
    temp.remove();
    return el;
  };

  const warn = message => console.warn(`[Icons] ${message}`);

  return {
    mergeAttributes,
    copyAttributes,
    buildSvg,
    createElement,
    warn
  };
})();

const Icons = (() => {
  const DEFAULT_ATTRS = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  };

  const ICON_DATA = {
    "calendar-clock":
      '<path d="M16 14v2.2l1.6 1"/><path d="M16 2v4"/><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M3 10h5"/><path d="M8 2v4"/><circle cx="16" cy="16" r="6"/>',
    settings:
      '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
    "settings-2":
      '<path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
    "chevron-down": '<polyline points="6,9 12,15 18,9"/>',
    filter: '<polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    "brush-cleaning":
      '<path d="m16 22-1-4"/><path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1"/><path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z"/><path d="m8 22 1-4"/>',
    clock:
      '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
    calendar:
      '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    terminal:
      '<path d="m7 11 2-2-2-2"/><path d="M11 13h4"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>',
    power:
      '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>',
    "power-off":
      '<path d="M18.36 6.64A9 9 0 0 1 20.77 15"/><path d="M6.16 6.16a9 9 0 0 0-2.07 8.95"/><path d="M12 2v4"/><path d="m2 2 20 20"/>',
    edit: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
    trash2:
      '<polyline points="3,6 5,6 21,6"/><path d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    check: '<polyline points="20,6 9,17 4,12"/>',
    "calendar-plus":
      '<path d="M16 19h6"/><path d="M16 2v4"/><path d="M19 16v6"/><path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"/><path d="M3 10h18"/><path d="M8 2v4"/>',
    "calendar-sync":
      '<path d="M11 10v4h4"/><path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5"/><path d="M16 2v4"/><path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5"/><path d="M21 22v-4h-4"/><path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3"/><path d="M3 10h4"/><path d="M8 2v4"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    "check-circle": '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
    "calendar-x":
      '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="15" y1="14" x2="9" y2="20"/><line x1="9" y1="14" x2="15" y2="20"/>'
  };

  const getIconData = name => {
    const iconContent = ICON_DATA[name];
    if (!iconContent) {
      IconUtils.warn(`Icon "${name}" not found`);
      return null;
    }
    return iconContent;
  };

  const createIcon = (iconName, attrs = {}) => {
    const iconContent = getIconData(iconName);
    if (!iconContent) return null;

    const finalAttrs = IconUtils.mergeAttributes(DEFAULT_ATTRS, attrs);
    return IconUtils.buildSvg(iconContent, finalAttrs);
  };

  const getIcon = (iconName, attrs = {}) => {
    return createIcon(iconName, attrs);
  };

  const replaceElementWithIcon = el => {
    const iconName = el.dataset.icon;
    const attrs = IconUtils.copyAttributes(el, ["id", "class"]);
    const svg = createIcon(iconName, attrs);

    if (svg) {
      const svgElement = IconUtils.createElement(svg);
      el.parentNode.replaceChild(svgElement, el);
    }
  };

  const createIcons = (container = document) => {
    const iconElements = container.querySelectorAll("[data-icon]");
    iconElements.forEach(replaceElementWithIcon);
  };

  const init = () => {
    createIcons();
  };

  return {
    getIcon,
    init
  };
})();
