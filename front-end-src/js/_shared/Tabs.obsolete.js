/* globals assert */

export default class Tabs {
  constructor(labels, content) {
    assert(labels && labels.length, 'Invalid labels array provided.');
    assert(content && content.length, 'Invalid content array provided.');
    assert(labels.length === content.length,
      'Labels and content array are of different lengths');

    this.tabs = this.buildTabsArray(labels, content);

    // Hide all content elements
    this.hideAllContent();

    // Show first content element
    this.showContent(this.tabs[0].content, true);

    // Add event listeners to labels
    for (const tab of this.tabs) {
      tab.label.addEventListener('click', () => {
        this.hideAllContent();
        this.showContent(tab.content, true);
      });
    }
  }

  buildTabsArray(labels, content) {
    const tabs = [];

    [].forEach.call(labels, (label, index) => {
      tabs.push({
        content: content[index],
        label,
      });
    });
    return tabs;
  }

  showContent(content, show) {
    if (show) {
      content.style.position = 'relative';
      content.style.right = '0';
    } else {
      content.style.position = 'absolute';
      content.style.right = '-1000%';
    }
  }

  hideAllContent(tabs = this.tabs) {
    for (const tab of tabs) {
      this.showContent(tab.content, false);
    }
  }
}
