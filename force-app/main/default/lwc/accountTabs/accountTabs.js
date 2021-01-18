/* eslint-disable no-console */
import { LightningElement, track, wire, api } from "lwc";
import fetchAccountPolicies from "@salesforce/apex/HumanaUtility.fetchAccountPolicies";
import fetchAccountBillings from "@salesforce/apex/HumanaUtility.fetchAccountBillings";
import fetchAccountEmployees from "@salesforce/apex/HumanaUtility.fetchAccountEmployees";
import fetchAccountQuotes from "@salesforce/apex/HumanaUtility.fetchAccountQuotes";
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// import { loadStyle } from 'lightning/platformResourceLoader';
// import humanaCSS from '@salesforce/resourceUrl/humanaResource';

/*
const actions = [
  { label: "Renew", name: "renew" },
  { label: "View Summery of Benifits &Coverage", name: "benifit_coverage" },
  { label: "View Certificate of Coverage", name: "certi_coverage" },
  { label: "View policy", name: "policy" }
];*/

const actions = [
  { displayName: "Renew", url: "#", id: "renew" },
  {
    displayName: "View Summary of Benifits &Coverage",
    url: "#",
    id: "view_summary"
  },
  { displayName: "View Certificate of Coverage", url: "#", id: "certificate" },
  { displayName: "View policy", url: "#", id: "view_policy" }
];

const columns = [
  { label: "Plan name", fieldName: "planName" },
  { label: "Effective date", fieldName: "effectiveDate", type: "date" },
  { label: "Expires on", fieldName: "expiresOn", type: "date" },
  { label: "Coinsurance", fieldName: "coinsurance" },
  { label: "Deductible", fieldName: "deductible" },
  { label: "Out-of-pocket maximum", fieldName: "oopMaximum" },
  {
    type: "customActions",
    label: "Actions",
    typeAttributes: {
      actions: actions
    }
  }
];

/*//rowActions: actions*/
const employeesColumns = [
  { label: "Name", fieldName: "Name" },
  { label: "Phone", fieldName: "Phone", type: "phone" },
  { label: "Email", fieldName: "Email", type: "email" }
];

const quotesColumns = [
  { label: "Name", fieldName: "Name" },
  { label: "Quote Number", fieldName: "QuoteNumber", type: "text" },
  { label: "Status", fieldName: "Status", type: "text" },
  { label: "Total Price", fieldName: "TotalPrice", type: "currency" }
];

const billingColumns = [
  { label: "Billing Number", fieldName: "OrderNumber" },
  { label: "Effective Date", fieldName: "EffectiveDate", type: "date" },
  { label: "Status", fieldName: "Status", type: "text" },
  { label: "Billing Amount", fieldName: "TotalAmount", type: "currency" }
];

export default class AccountTabs extends LightningElement {
  @track data = [];
  @track columns = columns;
  @track employeesColumns = employeesColumns;
  @track quotesColumns = quotesColumns;
  @track billingColumns = billingColumns;
  @track record = {};
  @track draftValues = [];
  @track accountId = "0012w000002uqYLAAY";
  @api recordId;
  @track accountPolicyData;
  @track totalMonthlyPremium = 0;
  @track activeEmployees = 0;
  @track groupStatus = "Active";
  @track accountBillingData;
  @track accountEmployeesData;
  @track accountQuotesData;
  @track isMedicalDataAvailable = false;
  @track isDentalDataAvailable = false;
  @track isaccountBillingDataAvailable = false;
  @track isaccountEmployeesDataAvailable = false;
  @track isaccountQuotesDataAvailable = false;
  @api exposedName;
  @wire(fetchAccountPolicies, { accountId: "$recordId" }) accountPolicies({
    error,
    data
  }) {
    if (data) {
      console.log(JSON.stringify(data));
      this.accountPolicyData = data;
      this.totalMonthlyPremium = parseInt(this.accountPolicyData.monthlyPremiumMedical) + parseInt(this.accountPolicyData.monthlyPremiumDental);
      this.groupStatus = this.accountPolicyData.groupStatus;
      if (this.accountPolicyData.medicalPolicies.length > 0) {
        this.isMedicalDataAvailable = true;
      }
      if (this.accountPolicyData.dentalPolicies.length > 0) {
        this.isDentalDataAvailable = true;
      }
    } else if (error) {
      console.log(JSON.stringify(error));
    }
  }

  @wire(fetchAccountBillings, { accountId: "$recordId" }) accountBilling({
    error,
    data
  }) {
    if (data) {
      console.log(JSON.stringify(data));
      this.accountBillingData = data;
      if (this.accountBillingData.length > 0) {
        this.isaccountBillingDataAvailable = true;
      }
    } else if (error) {
      console.log(JSON.stringify(error));
    }
  }

  @wire(fetchAccountEmployees, { accountId: "$recordId" }) accountEmployees({
    error,
    data
  }) {
    if (data) {
      console.log(JSON.stringify(data));
      this.accountEmployeesData = data;
      if (this.accountEmployeesData.length > 0) {
        this.isaccountEmployeesDataAvailable = true;
        this.activeEmployees = this.accountEmployeesData.length;
      }
    } else if (error) {
      console.log(JSON.stringify(error));
    }
  }

  @wire(fetchAccountQuotes, { accountId: "$recordId" }) accountQuotes({
    error,
    data
  }) {
    if (data) {
      console.log(JSON.stringify(data));
      this.accountQuotesData = data;
      if (this.accountQuotesData.length > 0) {
        this.isaccountQuotesDataAvailable = true;
      }
    } else if (error) {
      console.log(JSON.stringify(error));
    }
  }

  connectedCallback() {
    // Promise.all([
    //   loadStyle(this, humanaCSS)
    // ]).then(() => {
    //     console.log('CSS Loaded');
    // });
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "view_quote":
        this.viewAccount(row.id);
        break;
      case "view_account":
        this.viewQuote(row.accountId);
        break;
      default:
    }
  }

  viewAccount(accountId) {
    console.log(accountId);
  }

  viewQuote(quoteId) {
    console.log(quoteId);
  }

  deleteRow(row) {
    const { id } = row;
    const index = this.findRowIndexById(id);
    if (index !== -1) {
      this.data = this.data.slice(0, index).concat(this.data.slice(index + 1));
    }
  }

  findRowIndexById(id) {
    let ret = -1;
    this.data.some((row, index) => {
      if (row.id === id) {
        ret = index;
        return true;
      }
      return false;
    });
    return ret;
  }

  showRowDetails(row) {
    this.record = row;
  }

  handleSave(event) {
    console.log(event);
    const recordInputs = event.detail.draftValues.slice().map(draft => {
      const fields = Object.assign({}, draft);
      return { fields };
    });
    console.log(recordInputs);
    const promises = recordInputs.map(recordInput => updateRecord(recordInput));
    Promise.all(promises)
      .then(account => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Accounts updated",
            variant: "success"
          })
        );
        // Clear all draft values
        this.draftValues = [];
        console.log(account);
        // Display fresh data in the datatable
        return refreshApex(this.accountPolicies);
      })
      .catch(error => {
        console.log(error);
      });
  }
}