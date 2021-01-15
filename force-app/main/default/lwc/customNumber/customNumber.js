import OmniscriptAtomicElement from "vlocity_ins/omniscriptAtomicElement";
import { track, api } from "lwc";
import tmpl from "./customNumber.html";

export default class CustomNumber extends OmniscriptAtomicElement {
  @api jsonData;
  _commitOnChange;

  initCompVariables() {
    super.initCompVariables();
    this._commitOnChange =
      this.scriptHeaderDef.propSetMap.commitOnChange === true;
  }

  changeHandler(event) {
    console.log("jsonData", this.jsonData, JSON.stringify(this.jsonData));
    this.applyCallResp(event.target.value);
  }

  render() {
    return tmpl;
  }
}