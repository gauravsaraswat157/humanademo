import { track, LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import temp from "./humanaBenefitManager.html";

export default class HumanaBenefitManager extends BaseState(LightningElement) {
  @track data = { columns: "" };

  connectedCallback() {}

  get columns() {
    return this.getFieldByKey("cols");
  }

  getFieldByKey(key) {
    if (this.state && this.state.fields) {
      for (let i = 0; i < this.state.fields.length; i++) {
        let field = this.state.fields[i];
        if (field.name === key) {
          return field.label;
        }
      }
    }
    return "";
  }

  get isDataAvailable() {
    if (this.state && this.state.fields) {
      return true;
    }
    return false;
  }

  render() {
    return temp;
  }

  get customActions() {
    if (this.actions && this.actions.length > 0) {
      let actions = [...this.actions];
      return actions;
    }
    return [];
  }

  get searchPlaceholder() {
    return this.getFieldByKey("searchPlaceholder");
  }
}