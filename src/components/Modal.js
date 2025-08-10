const Modal = (() => {
  function toggleModal(modalElement, show) {
    modalElement.classList.toggle("show", show);
  }

  function show(modalElement) {
    toggleModal(modalElement, true);
  }

  function hide(modalElement) {
    toggleModal(modalElement, false);
  }

  return {
    show,
    hide
  };
})();
