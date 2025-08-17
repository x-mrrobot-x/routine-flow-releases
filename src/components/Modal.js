const Modal = (() => {
  const modalStack = [];

  function toggleModal(modalElement, show) {
    modalElement.classList.toggle("show", show);
  }

  function show(modalElement) {
    if (!modalStack.includes(modalElement)) {
      modalStack.push(modalElement);
    }
    toggleModal(modalElement, true);
  }

  function hide(modalElement) {
    toggleModal(modalElement, false);

    const index = modalStack.indexOf(modalElement);
    if (index > -1) {
      modalStack.splice(index, 1);
    }
  }

  function goBack() {
    if (modalStack.length > 0) {
      const currentModal = modalStack.pop();
      toggleModal(currentModal, false);
      return true;
    }
    return false;
  }

  return {
    show,
    hide,
    goBack
  };
})();
