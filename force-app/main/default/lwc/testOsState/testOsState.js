import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import templ from "./testOsState.html";

export default class TestOsState extends BaseState(LightningElement) {
  render() {
    return templ;
  }
  toggleFlyoutCustom() {
    this.toggleFlyout();
    let modal = this.template.querySelector("c-modal");
    if (modal && !this.hideFlyout) {
      modal.openModal();
    } else if (modal) {
      modal.closeModal();
    }
  }
}