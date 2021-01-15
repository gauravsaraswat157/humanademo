import { LightningElement, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import temp from "./humanaWalletAndRewards.html";

export default class HumanaWalletAndRewards extends BaseState(LightningElement) {
    @track data = {};

  connectedCallback() {}

  /**
   * Prepares data object from card configuration. It allows to access data on key-value basis.
   */
  formatDataFromConfiguration() {
    if (this.state && this.state.fields) {
      this.state.fields.forEach(field => {
        if (!field.name.startsWith("link:")) {
          this.data[field.name] = field.label;
        }
      });
      this.data.title = this.state.name ? this.state.name : "";
    }
  }

  render() {
    return temp;
  }

  renderedCallback() {
    this.formatDataFromConfiguration();
  }

  /**
   * Extract links from configuration.
   */
  get links() {
    let links = [];
    if (this.state && this.state.fields) {
      this.state.fields.forEach((field, index) => {
        if (field.name.startsWith("link:")) {
          links.push({
            id: index,
            label: field.name.replace("link:", ""),
            value: field.label
          });
        }
      });
    }
    return links;
  }
}