import LightningDatatable from "lightning/datatable";
import temp from "./datatableCustomActions.html";
import product from "./datatableProductCell.html";

export default class DatatableCustomActions extends LightningDatatable {
  static customTypes = {
    customActions: {
      template: temp,
      typeAttributes: ["actions", "stateObj", "contextId", "sObjectType"]
    },
    product: {
      template: product
    }
  };
}