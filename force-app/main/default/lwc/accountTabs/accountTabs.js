/* eslint-disable no-console */
import { LightningElement, track, wire, api } from "lwc";
import fetchAccountPolicies from "@salesforce/apex/HumanaUtility.fetchAccountPolicies";
import fetchAccountBillings from "@salesforce/apex/HumanaUtility.fetchAccountBillings";
import fetchAccountEmployees from "@salesforce/apex/HumanaUtility.fetchAccountEmployees";
import fetchStatusCategories from "@salesforce/apex/HumanaUtility.fetchStatusCategories";
import fetchAccountQuotes from "@salesforce/apex/HumanaUtility.fetchAccountQuotes";
import getAgreementId from "@salesforce/apex/SendAgreement.getAgreementId";
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

const statusCategoryList = [
  {class : "completed", name: "Product selected"},
  {class : "skipped", name: "Affordability review"},
  {class : "completed document dotted", name: "KFI generated"},
  {class : "current hide", name: "Product recommended"},
  {class : "hide", name: "Suitability generated"},
  {class : "", name: "Product chosen"},
  {class : "", name: "Application Sent"},
  
]

/*//rowActions: actions*/
const employeesColumns = [
  { label: "Name", fieldName: "Name" },
  { label: "Date of Birth", fieldName: "Birthdate", type: "birthdate" },
  { label: "Gender", fieldName: "vlocity_ins__Gender__c", type: "gender" },
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
  @track statusCategoryList = statusCategoryList;
  @track record = {};
  @track draftValues = [];
  @track accountId = "0012w000002uqYLAAY";
  // @api recordId='0012E00001tjmWVQAY';
  @api recordId='0012E00001tjmWVQAY';
  @track templateId='a6i2E000000wqqcQAA';
  @track masterId='0012E00001oz23OQAQ';
  @track accountPolicyData;
  @track totalMonthlyPremium = 0;
  @track activeEmployees = 0;
  @track groupStatus = "Active";
  @track accountBillingData;
  @track accountEmployeesData;
  @track accountQuotesData;
  @track agreementId;
  @track isMedicalDataAvailable = false;
  @track isDentalDataAvailable = false;
  @track isSendDocument = false;
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

  @wire(fetchStatusCategories, { accountId: "$recordId" }) categoriesData({
    error,
    data
  }) {
    if (data) {
      this.statusCategoryList = [];
      data.forEach(status => {
        this.statusCategoryList.push({'name':status});
      });
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

   //@wire(load, { masterId: "$recordId", templateId: "$templateId" }) accountSendDocument({
    //error,
   // data
  //}) {
   // if (data) {
   //   console.log(JSON.stringify(data));
   //   this.agreementId = data;
   //   if (this.agreementId.length > 0) {
   //     this.isSendDocument = true;
   //   }
  //  } else if (error) {
  //    console.log(JSON.stringify(error));
  //  }
 // }

  connectedCallback() {
    // Promise.all([
    //   loadStyle(this, humanaCSS)
    // ]).then(() => {
    //     console.log('CSS Loaded');
    // });
  }

  @track
  adobePdfList=[{
    name:"Group Maintence Request",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Agent Overview/Plan Overview Document Template",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Employer Election form(EEF) for all Spending acounts",
    actionurl:"",
    date: "05-12-2020",
    status:"Pending Signature",
    resend : true

  },{
    name:"Employer HSA Contribution check and list form",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Employer Overview/Plan Overview Document Temlate",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"FSA and FSA with a PCA PMA - Humana COBRA Language",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"FSA and FSA with a PCA PMA - Outsourced COBRA Language",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Multilocation Form",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"PCA PMA - Humana COBRA Language",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"PCA PMA - Outsourced COBRA Language",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Premimum Only Plan Application",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Humana ELigibility Certification Form",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Humana Risk Assesssment Form (Groups 50+ only)",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Self Administration Agreement",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"Full-Time Employeement Questionaries",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  },{
    name:"HumanaLife Employer Acknowlwdgement",
    actionurl:"",
    date: "05-12-2020",
    status:"Complete"
  }];

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
  //@wire(getAgreementId)
  //test;
  handleClick(event) {
      const con=confirm("Are you sure?");
      if(con){
        const index=event.target.dataset.id;
        this.adobePdfList[index].resend=true;
        this.adobePdfList[index].status="Pending Signature";
        console.log("Inside handleclick");
        getAgreementId({ accountId: '0012E00001tjmWVQAY' }).then(result=>{
          console.log(result);
          //isSendDocument = true;
        }).catch(error =>{
          console.log(error);
        });
      }
    }

    get handleAgreementStatus() {
      console.log("Status of the doc ",this);
      return 1 === 'Completed';
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