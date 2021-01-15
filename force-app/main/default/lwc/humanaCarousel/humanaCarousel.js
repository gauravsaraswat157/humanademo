import { LightningElement, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import Username from "@salesforce/schema/User.Name";
import UserId from "@salesforce/user/Id";

export default class HumanaCarousel extends LightningElement {
  @track name;
  @track showHeader = true;
  @wire(getRecord, {
    recordId: UserId,
    fields: [Username]
  })
  wireuser({ error, data }) {
    if (error) {
      console.log("error appeared", JSON.stringify(error));
    } else if (data) {
      this.name = data.fields.Name.value;
    }
  }
  closeHeader() {
    this.showHeader = false;
  }

  get showName() {
    if (this.name) {
      return this.name;
    }
    return "";
  }

  get isNameAvailable() {
    return this.name ? true : false;
  }
}