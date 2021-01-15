import { LightningElement, track, api } from "lwc";
import util from "vlocity_ins/utility";
import { NavigationMixin } from "lightning/navigation";

export default class LookupContainer extends NavigationMixin(LightningElement) {
  // Use alerts instead of toast to notify user
  @api notifyViaAlerts = false;

  @track isMultiEntry = false;
  @track initialSelection = [];
  @track errors = [];
  request = {
    type: "apexremote",
    value: {
      className: "LookupController",
      methodName: "search",
      inputMap: "{}",
      optionsMap: "{}"
    }
  };

  handleLookupTypeChange(event) {
    this.initialSelection = [];
    this.errors = [];
    this.isMultiEntry = event.target.checked;
  }

  handleSearch(event) {
    this.request.value.inputMap = JSON.stringify({
      search: event.detail
    });

    util
      .getDataHandler(JSON.stringify(this.request))
      .then(response => {
        response = JSON.parse(response);
        this.template
          .querySelector("c-lookup")
          .setSearchResults(response.results);
      })
      .catch(error => {
        console.log(
          "error while fetching quote summary",
          JSON.stringify(error)
        );
      });
  }

  handleSelectionChange(e) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: e.detail.id,
        objectApiName: "Account",
        actionName: "view"
      }
    });
  }
}