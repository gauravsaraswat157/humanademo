import { LightningElement, api } from "lwc";

export default class ProductCell extends LightningElement {
  @api value;


  get showDental() {
    let types = this.value.split(";");
    if (Array.isArray(types) && types.indexOf("Dental") !== -1) {
      return true;
    }
    return false;
  }
  get showMedical() {
    let types = this.value.split(";");
    if (Array.isArray(types) && types.indexOf("Medical") !== -1) {
      return true;
    }
    return false;
  }

  get showVision() {
    let types = this.value.split(";");
    if (Array.isArray(types) && types.indexOf("Vision") !== -1) {
      return true;
    }
    return false;
  }
}