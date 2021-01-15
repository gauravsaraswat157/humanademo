import { LightningElement, api, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import temp from "./cardState3x.html";

export default class CardState3x extends BaseState(LightningElement) {
  @track data = {};
  connectedCallback() {}

  get options() {
    let options = [];
    if (this.state && this.state.fields) {
      this.state.fields.forEach(field => {
        if (field.name.startsWith("option:")) {
          options.push({
            label: field.name.replace("option:", ""),
            value: field.label
          });
        }
      });
    }
    return options;
  }

  get pageURL() {
    return this.getProperty("PageURL");
  }

  get pageLabel() {
    return this.getProperty("PageLabel");
  }

  get buttonLabel() {
    return this.getProperty("ButtonLabel");
  }

  get footerLabel() {
    return this.getProperty("FooterLabel");
  }

  get footerURL() {
    return this.getProperty("FooterURL");
  }

  handleGo() {
    console.log("Go clicked");
  }

  getProperty(attr) {
    if (this.state && this.state.fields) {
      for (let i = 0; i < this.state.fields.length; i++) {
        if (this.state.fields[i].name === attr) {
          return this.state.fields[i].label;
        }
      }
    }
    return "";
  }

  render() {
    return temp;
  }
}