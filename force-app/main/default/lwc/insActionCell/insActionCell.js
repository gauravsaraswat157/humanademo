import { LightningElement, api } from "lwc";

export default class InsActionCell extends LightningElement {
  @api recordId;
  @api actions;

  get processedActions() {
    if (Array.isArray(this.actions)) {
      let actions = [];
      for (let i = 0; i < this.actions.length; i++) {
        let action = JSON.parse(JSON.stringify(this.actions[i]));
        action.url += this.recordId;
        actions.push(action);
      }
      return actions;
    }
    return [];
  }
}