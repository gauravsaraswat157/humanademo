import { BaseLayout } from "vlocity_ins/baseLayout";
import { LightningElement, api } from "lwc";
import template from "./cardCanvasLayout.html";
import ndsTemplate from "./cardCanvasLayout_nds.html";
import { debounce } from "vlocity_ins/utility";

export default class CardCanvas extends BaseLayout(LightningElement) {
  @api theme;

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return template;
  }

  searchCard = debounce(target => {
    const searchKey = target.value;
    this.setSearchParam(searchKey);
  }, 500);

  //cardSearch
  setSearchParam(search) {
    this.allRecords = this.allRecords ? this.allRecords : this.records;
    if (this.allRecords) {
      if (search) {
        let data = [...this.allRecords];
        let filteredRecords = [];
        data.forEach(element => {
          for (let key in element) {
            if (element.hasOwnProperty(key)) {
              let val = element[key];
              if (typeof val == "string" && val.indexOf(search) !== -1) {
                filteredRecords.push(element);
              }
            }
          }
        });
        this.records = filteredRecords;
      } else {
        this.records = [...this.allRecords];
      }
      this.setCardsRecords();
    }
  }
}