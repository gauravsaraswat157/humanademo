import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import sldsTemplate from "./testState.html";

export default class TestState extends BaseState(LightningElement) {
  render() {
    return sldsTemplate;
  }
}