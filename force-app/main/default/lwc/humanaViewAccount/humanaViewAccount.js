import { LightningElement, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getContactList from '@salesforce/apex/HumanaUtility.getContacts';

const accountFields = ['Account.Name','Account.Phone','Account.vlocity_ins__Email__c','Account.BillingStreet','Account.BillingCity','Account.BillingState','Account.BillingPostalCode','Account.BillingCountry'];
const accountId = "0012w000002uqYLAAY";

export default class HumanaViewAccount extends LightningElement {
    @track contacts;
    @track selectedEmail = '';
    @track selectedPhone = '';
    @track value = '';
    @wire(getContactList,{accId:accountId})
    wiredContacts({ error, data }) {
        let contactOptions = [];
        if (data) {
            this.error = undefined;
            for(let key in data){
                if (data.hasOwnProperty(key)) { // Filtering the data in the loop
                    contactOptions.push({Id: key, Name:data[key].Name, Phone:data[key].Phone, Email:data[key].Email, label: data[key].Name, value: data[key].Phone+'__'+data[key].Email});
                }                
            }
            let phoneEmail = contactOptions[0].value.split('__');
            this.selectedEmail = phoneEmail[1];
            this.selectedPhone = phoneEmail[0];
            this.contacts = contactOptions;
            this.value = contactOptions[0].value;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }

    handleChange(event) {
        let phoneEmail = event.detail.value.split('__');
        this.selectedEmail = phoneEmail[1];
        this.selectedPhone = phoneEmail[0];
    }

    @wire(getRecord, { recordId: accountId, fields: accountFields })
    account;

    get name() {
        return this.account.data.fields.Name.value;
    }

    get phone() {
        return this.account.data.fields.Phone.value;
    }

    get email() {
        return this.account.data.fields.vlocity_ins__Email__c.value;
    }

    get address() {
        return this.account.data.fields.BillingStreet.value + '<br>' + this.account.data.fields.BillingCity.value + ', ' + this.account.data.fields.BillingState.value + ' ' + this.account.data.fields.BillingPostalCode.value + '<br>' + this.account.data.fields.BillingCountry.value;
    }
}