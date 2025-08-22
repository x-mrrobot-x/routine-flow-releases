const PaginationManager = (() => {
  function create(config) {
    const {
      scrollElement,
      renderAppend,
      pageSize = 10,
      thresholdPx = 200
    } = config;

    const state = {
      items: [],
      pageIndex: 0,
      loading: false
    };

    function hasMore() {
      return state.pageIndex * pageSize < state.items.length;
    }

    function getSlice() {
      const start = state.pageIndex * pageSize;
      const end = Math.min(start + pageSize, state.items.length);
      return state.items.slice(start, end);
    }

    function loadNext() {
      if (state.loading || !hasMore()) return;
      state.loading = true;

      const nextItems = getSlice();
      renderAppend(nextItems);
      state.pageIndex += 1;

      state.loading = false;
    }

    function isNearBottom() {
      const pos = scrollElement.scrollTop + scrollElement.clientHeight;
      const max = scrollElement.scrollHeight;
      const distance = max - pos;
      return distance <= thresholdPx;
    }

    function onScroll() {
      if (isNearBottom()) loadNext();
    }

    function attach() {
      scrollElement.addEventListener("scroll", onScroll, { passive: true });
    }

    function fill() {
      let counter = 0;
      while (
        hasMore() &&
        scrollElement.scrollHeight <= scrollElement.clientHeight &&
        counter < 100
      ) {
        loadNext();
        counter += 1;
      }
    }

    function load(newItems) {
      state.items = Array.isArray(newItems) ? newItems : [];
      state.pageIndex = 0;
      loadNext();
      fill();
    }

    attach();

    return {
      load
    };
  }

  return { create };
})();