const Modal = (env => {
  function toggleModal(modalElement, show) {
    modalElement.classList.toggle("show", show);
  }

  function show(modalElement) {
    toggleModal(modalElement, true);
  }

  function hide(modalElement, goBack) {
    toggleModal(modalElement, false);
    goBack && env.navigate(-1);
  }

  return {
    show,
    hide
  };
})(currentEnvironment);
