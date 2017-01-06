import assert from './assert';

function Highlight(el) {
	this.setActive(el);
}

Highlight.prototype.translateX = function (val) {
	assert(typeof val === 'number', 'translateX value is not a number');
	this.bar.style.transform = `translate3d(${val}px, 0, 0)`;
};

Highlight.prototype.setWidth = function (val) {
	assert(typeof val === 'number', 'translateX value is not a number');
	this.bar.style.width = `${val}px`;
};

Highlight.prototype.getBaseXPosition = function () {
	const parentBox = this.parent.getBoundingClientRect();
	return parentBox.left;
};

Highlight.prototype.returnToBasePosition = function () {
	this.translateX(0);
	const parentBox = this.parent.getBoundingClientRect();
	const parentWidth = parentBox.right - parentBox.left;
	this.setWidth(parentWidth);
};

Highlight.prototype.moveToElementPosition = function (el) {
	const basePos = this.getBaseXPosition();
	const elBox = el.getBoundingClientRect();
	const displacement = elBox.left - basePos;
	this.translateX(displacement);
	const elWidth = elBox.right - elBox.left;
	this.setWidth(elWidth);
};

Highlight.prototype.setActive = function (el) {
	if (this.bar) {
		this.bar.remove();
		this.bar = null;
	}

	assert((el && el.nodeName), 'Invalid element passed to setActive');
	this.parent = el;
	this.bar = document.createElement('div');
	this.bar.classList.add('active-highlight');
	this.parent.appendChild(this.bar);
}

function ActiveHighlighter({
	buttons,
	activeIndex = 0,
	highlightOnClick = false,
} = {}) {
	// NOTE: This module assumes that all tabs share a common parent.
	let buttonsArray;
	let tabsParent;

	if (buttons.nodeName) {
		// If tabs is a container, handle all children
		buttonsArray = Array.from(buttons.children);
		tabsParent = buttons;
	} else if (buttons.length) {
		// If tabs is arraylike handle all elements in the array.
		buttonsArray = Array.from(buttons);
		tabsParent = buttonsArray[0].parentElement;
	} else {
		throw new Error('Invalid element send to ActiveHighlighter.');
	}

	const activeHighlight = new Highlight(buttonsArray[activeIndex]);

	// Move highlight back to normal when mouse leaves buttons area
	tabsParent.addEventListener('mouseleave', (e) => {
		const tabsPartentBox = tabsParent.getBoundingClientRect();
		const outsideX = e.pageX > tabsPartentBox.right || e.pageX < tabsPartentBox.left;
		const outsideY = e.pageY > tabsPartentBox.bottom || e.pageY < tabsPartentBox.top;
		const mouseOutOfTabsParent = outsideX || outsideY;
		if (mouseOutOfTabsParent) {
			activeHighlight.returnToBasePosition();
		}
	});

	// Move highlight to the corresponding element on hover.
	for (const item of buttonsArray) {
		item.addEventListener('mouseenter', () => {
			activeHighlight.moveToElementPosition(item);
		});
	}

	// Change main highlighted element on click if appropriate
	if (highlightOnClick) {
		for (const item of buttonsArray) {
			item.addEventListener('click', () => {
				activeHighlight.setActive(item);
			});
		}
	}
}

export default ActiveHighlighter;
