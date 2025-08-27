const CategoryService = (() => {
  let categories = [];

  function getById(id) {
    return categories.find(c => c.id === id) || null;
  }

  function getAll() {
    return [...categories];
  }

  function add(category) {
    const newCategory = {
      ...category,
      id: Date.now().toString()
    };
    categories.push(newCategory);
    save();
  }

  function update(id, data) {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return;

    categories[index] = { ...categories[index], ...data };
    save();
  }

  function remove(id) {
    categories = categories.filter(c => c.id !== id);
    save();
  }

  function load() {
    const stored = ENV.getCategories();
    categories = stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    if (!stored) save();
  }

  function save() {
    const data = JSON.stringify(categories, null, 2);
    ENV.saveCategories(data);
  }

  function init() {
    load();
  }

  return {
    init,
    load,
    getAll,
    add,
    update,
    remove,
    save,
    getById
  };
})();
