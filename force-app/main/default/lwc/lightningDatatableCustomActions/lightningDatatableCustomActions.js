import LightningDatatable from "lightning/datatable";
import temp from "./lightningDatatableCustomActions.html";

export default class LightningDatatableCustomActions extends LightningDatatable {
  static customTypes = {
    customActions: {
      template: temp,
      typeAttributes: ["actions"]
    }
  };
}