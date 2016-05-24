/* eslint-env browser */
import assert from '../_shared/assert';

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
    // Take care of bug in chrome that shows wrong info for option selection
    if (e.target.nodeName === 'SELECT') { return; }
    const contentRect = this.modalContent.getBoundingClientRect();

    const insideVertically = contentRect.top < e.clientY && e.clientY < contentRect.bottom;
    const insideHorizontally = contentRect.left < e.clientX && e.clientX < contentRect.right;

    return !(insideVertically && insideHorizontally);
  }
}
