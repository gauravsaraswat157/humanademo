import { LightningElement, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import util from "vlocity_ins/utility";

export default class MyContacts extends BaseState(LightningElement) {
  @track contacts = [];
  request = {
    type: "apexremote",
    value: {
      className: "HumanaUtility",
      methodName: "fetchContacts",
      inputMap: "{}",
      optionsMap: "{}"
    }
  };

  init() {
    this.request.value.inputMap = JSON.stringify({
      accountId: "0012w000002uqYLAAY"
    });

    util
      .getDataHandler(JSON.stringify(this.request))
      .then(response => {
        response = JSON.parse(response);
        this.contacts = response.contacts;
      })
      .catch(error => {
        console.log("error while fetching data.", JSON.stringify(error));
      });
  }
  connectedCallback() {
    this.init();
  }
}