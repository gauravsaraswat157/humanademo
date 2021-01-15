import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import temp from "./humanaResources.html";

export default class HumanaResources extends BaseState(LightningElement) {
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

  render() {
    return temp;
  }
}