import { LightningElement } from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import humanaCSS from "@salesforce/resourceUrl/humanaResource";

export default class HumanaCss extends LightningElement {
  connectedCallback() {
    Promise.all([loadStyle(this, humanaCSS)]).then(() => {
      console.log("CSS Loaded");
    });
  }
}