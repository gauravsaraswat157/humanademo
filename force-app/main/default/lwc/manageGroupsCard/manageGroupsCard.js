import { LightningElement, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import temp from "./manageGroupsCard.html";

export default class ManageGroupsCard extends BaseState(LightningElement) {
  @track data = {};
  searchKey = "";
  connectedCallback() {}

  /**
   * Prepares data object from card configuration. It allows to access data on key-value basis.
   */
  formatDataFromConfiguration() {
    if (this.state && this.state.fields) {
      this.state.fields.forEach(field => {
        if (!field.name.startsWith("option:")) {
          this.data[field.name] = field.label;
        }
      });
      this.data.title = this.state.name ? this.state.name : "";
    }
  }

  renderedCallback() {
    this.formatDataFromConfiguration();
  }

  /**
   * Extract radio group options from configuration.
   */
  // get options() {
  //   let options = [];
  //   if (this.state && this.state.fields) {
  //     this.state.fields.forEach(field => {
  //       if (field.name.startsWith("option:")) {
  //         options.push({
  //           label: field.name.replace("option:", ""),
  //           value: field.label
  //         });
  //       }
  //     });
  //   }
  //   return options;
  // }

  handleGo() {
    // console.log("Go clicked");
  }

  handleOptionChange(event) {
    this.selectedOption = event.target.value;
  }

  handleKeyChange(event) {
    this.searchKey = event.target.value;
  }
  /**
  *** Extract links from configuration.
  **/
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