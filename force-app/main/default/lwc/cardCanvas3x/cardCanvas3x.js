import { LightningElement } from "lwc";
import { BaseLayout } from "vlocity_ins/baseLayout";
import temp from "./cardCanvas3x.html";

export default class CardCanvas3x extends BaseLayout(LightningElement) {
  render() {
    return temp;
  }
}