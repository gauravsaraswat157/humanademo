import { LightningElement, api, wire, track } from "lwc";
import getAccountDetails from "@salesforce/apex/HumanaUtility.getAccountDetails";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle } from 'lightning/platformResourceLoader';
import humanaCSS from '@salesforce/resourceUrl/humanaResource';

export default class humanaGroupInstallHeader extends LightningElement {
  @api recordId;
  @track account;
  @track contacts;
  @track openContact;
  @track editGroup = false;
  @track selectedContact;
  @track currentContact;
  wiredActivities;

  connectedCallback() {
    Promise.all([
      loadStyle(this, humanaCSS)
    ]).then(() => {
        console.log('CSS Loaded');
    });
}

  @wire(getAccountDetails, { accountId: "0012E00001tjmWVQAY" }) getAccount(value) {
    this.wiredActivities = value; // track the provisioned value
    const { data, error } = value;
    if (data) {
      this.account = data.account;
      this.contacts = data.contacts;
      //console.log('this.account', JSON.stringify(this.account));
      if (Array.isArray(this.contacts) && this.contacts.length > 0) {
        this.currentContact = this.contacts[0];
        this.selectedContact = this.contacts[0].Id;
      }
    } else if (error) {
      console.log("error appeared", JSON.stringify(error));
    }
  }

  get isDataAvailable() {
    if (this.account) {
      return true;
    }
    return false;
  }

  openContactModal() {
    this.openContact = true;
  }
  closeContactModal() {
    this.openContact = false;
  }

  openAccountEdit() {
    this.editGroup = true;
  }

  closeAccountEdit() {
    this.editGroup = false;
  }

  handleSuccess(event) {
    refreshApex(this.wiredActivities);
    this.editGroup = false;
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message: "Accounts updated",
        variant: "success"
      })
    );
  }

  contactSelected(e) {
    this.contacts.map(contact => {
      if (contact.Id === e.detail.value) {
        this.currentContact = contact;
      }
    });
    console.log("this.currentContact", JSON.stringify(this.currentContact));
  }

  get contactOptions() {
    let options = [];
    this.contacts.map(contact => {
      let option = {
        label: contact.Name,
        value: contact.Id
      };
      if (contact.Title) {
        option.label += " - " + contact.Title;
      }
      options.push(option);
    });
    return options;
  }

  get isContactSelected() {
    return this.currentContact ? true : false;
  }

  get billingAvailable() {
    return this.account.BillingAddress ? true : false;
  }

  get contactPhoneAvailable() {
    return this.currentContact.Phone ? true : false;
  }

  get contactRoleAvailable() {
    return this.currentContact.Title ? true : false;
  }
}