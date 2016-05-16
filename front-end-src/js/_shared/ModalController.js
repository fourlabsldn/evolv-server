/* eslint-env browser */
import assert from './assert';

const modalHiddenClass = 'modal--hidden';
const modalContentSelector = '.js-modal-content';
const closeBtnSelector = '.js-modal-closeBtn';

export default class ModalController {
  constructor(modalEl, toggleButton) {
    assert(modalEl, 'No modal element provided');
    this.modalEl = modalEl;

    this.modalContent = modalEl.querySelector(modalContentSelector);
    assert(this.modalContent, 'No modal content element found.');

    this.closeBtn = modalEl.querySelector(closeBtnSelector);
    assert(this.modalContent, 'No close button found for modal.');
    this.closeBtn.addEventListener('click', () => this.close());

    if (toggleButton) {
      this.toggleButton = toggleButton;
      this.toggleButton.addEventListener('click', () => {
        return this.isOpen() ? this.close() : this.open();
      });
    }

    this.controllerClickListener = this.closeController.bind(this);

    // Set listeners for current state
    if (this.isOpen()) {
      this.open();
    } else {
      this.close();
    }
  }

  isOpen() {
    return !this.modalEl.classList.contains(modalHiddenClass);
  }

  open() {
    this.modalEl.classList.remove(modalHiddenClass);
    // Click has to be in the capturing phase, otherwise the bubbling click from
    // the toggle button will immediately close the modal.
    document.body.addEventListener('click', this.controllerClickListener, true);
  }

  close() {
    this.modalEl.classList.add(modalHiddenClass);
    document.body.removeEventListener('click', this.controllerClickListener, true);
  }

  closeController(e) {
    const modalOpen = this.isOpen();
    if (this.clickIsOutsideContent(e) && modalOpen) {
      this.close();
    } else if (!modalOpen) {
      assert(false, 'Problem in openCloseController. Triggered with modal closed.');
    }
  }

  clickIsOutsideContent(e) {
    const contentRect = this.modalContent.getBoundingClientRect();

    const insideVertically = contentRect.top < e.pageY && e.pageY < contentRect.bottom;
    const insideHorizontally = contentRect.left < e.pageX && e.pageX < contentRect.right;

    return !(insideVertically && insideHorizontally);
  }
}
