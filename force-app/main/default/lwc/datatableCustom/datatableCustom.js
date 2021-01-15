import LightningDatatable from "lightning/datatable";
import temp from "./datatableCustom.html";

export default class DatatableCustom extends LightningDatatable {
  static customTypes = {
    customActions: {
      template: temp,
      typeAttributes: ["actions"]
    }
  };
}