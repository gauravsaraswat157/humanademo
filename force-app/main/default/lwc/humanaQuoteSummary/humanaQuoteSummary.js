import { LightningElement, track } from "lwc";
import util from "vlocity_ins/utility";

export default class HumanaQuoteSummary extends LightningElement {
  @track quotes = {};
  allQuotesLink = "";
  request = {
    type: "apexremote",
    value: {
      className: "HumanaUtility",
      methodName: "fetchQuotesSummary",
      inputMap: "{}",
      optionsMap: "{}"
    }
  };

  connectedCallback() {
    console.log("State not working");
    util
      .getDataHandler(JSON.stringify(this.request))
      .then(result => {
        result = JSON.parse(result);
        if (result.error && result.error === "OK") {
          this.quotes = result.counts;
        }
      })
      .catch(error => {
        console.log(
          "error while fetching quote summary",
          JSON.stringify(error)
        );
      });
  }
}