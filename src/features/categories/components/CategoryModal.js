const CategoryModalUtils = (() => {
  function updateCount(elements) {
    elements.count.textContent = CategoryService.getAll().length;
  }

  function createCategoryItem(category) {
    const item = document.createElement("div");
    item.className = "category-item";
    item.dataset.id = category.id;
    item.innerHTML = `
      <div class="category-info">
        <div class="category-color" style="background-color: ${
          category.color
        }"></div>
        <span class="category-name">${I18n.get(category.name)}</span>
      </div>
      <div class="category-actions">
        <button class="button routine-edit-btn" data-action="edit">
          ${Icons.getIcon("edit")}
        </button>
        <button class="button delete-btn" data-action="delete">
          ${Icons.getIcon("trash2")}
        </button>
      </div>
    `;

    return item;
  }

  function confirmDelete(categoryName) {
    const confirmMsg = I18n.get("category_confirm_delete").replace(
      "{categoryName}",
      I18n.get(categoryName)
    );
    return confirm(confirmMsg);
  }

  function deleteCategory(id) {
    CategoryService.remove(id);
    RoutineService.removeByCategory(id);

    const currentCategoryFilter = RoutineFilter.getState(
      "currentCategoryFilter"
    );
    if (currentCategoryFilter === id) {
      RoutineFilter.setState("currentCategoryFilter", "all");
      CategoryRenderer.updateActive("all");
    }

    Toast.show("success", I18n.get("category_deleted"));
  }

  return {
    updateCount,
    createCategoryItem,
    confirmDelete,
    deleteCategory
  };
})();

const CategoryModal = (() => {
  const DEFAULT_CATEGORY_ID = "general";

  const elements = {
    modal: DOM.$("#category-modal"),
    count: DOM.$("#categories-count"),
    grid: DOM.$("#categories-grid"),
    closeBtn: DOM.$("#categories-modal-close"),
    overlay: DOM.$("#category-modal .modal-overlay")
  };

  function open() {
    CategoryForm.setupCreate();
    Modal.show(elements.modal);
  }

  function close() {
    Modal.hide(elements.modal);
  }

  function handleEdit(id) {
    const category = CategoryService.getById(id);
    if (category) CategoryForm.setupEdit(category);
  }

  function handleDelete(id) {
    if (id === DEFAULT_CATEGORY_ID) {
      Toast.show("error", I18n.get("category_cannot_delete_default"));
      return;
    }

    const category = CategoryService.getById(id);
    if (!CategoryModalUtils.confirmDelete(category.name)) return;

    CategoryModalUtils.deleteCategory(id);
  }

  function handleGridClick(e) {
    const action = e.target.dataset.action;
    if (!action) return;

    const item = e.target.closest(".category-item");
    const id = item?.dataset.id;
    if (!id) return;

    if (action === "edit") {
      handleEdit(id);
    } else {
      handleDelete(id);
    }
  }

  function render() {
    const categories = CategoryService.getAll();
    elements.grid.innerHTML = "";

    const categoryItems = categories.map(CategoryModalUtils.createCategoryItem);
    elements.grid.append(...categoryItems);
  }

  function updateAll() {
    render();
    CategoryModalUtils.updateCount(elements);
  }

  const handlers = {
    close: close,
    overlay: close,
    grid: handleGridClick
  };

  function bindEvents() {
    const bindings = [
      [elements.closeBtn, "click", handlers.close],
      [elements.overlay, "click", handlers.overlay],
      [elements.grid, "click", handlers.grid]
    ];

    bindings.forEach(([el, event, handler]) =>
      el.addEventListener(event, handler)
    );

    EventBus.on("data:category:changed", updateAll);
  }

  function init() {
    CategoryForm.init();
    updateAll();
    bindEvents();
  }

  return {
    init,
    open,
    close
  };
})();
