import { LightningElement } from "lwc";
import { BaseLayout } from "vlocity_ins/baseLayout";
import sldsTemplate from "./testCard.html";

export default class TestCard extends BaseLayout(LightningElement) {
  render() {
    return sldsTemplate;
  }
}