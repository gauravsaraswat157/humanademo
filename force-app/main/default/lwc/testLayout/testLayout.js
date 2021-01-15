import { LightningElement } from "lwc";
import { BaseLayout } from "vlocity_ins/baseLayout";
import sldsTemplate from "./testLayout.html";

export default class TestLayout extends BaseLayout(LightningElement) {
  render() {
    return sldsTemplate;
  }
}