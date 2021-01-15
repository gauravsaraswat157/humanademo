/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import fetchAllAccounts from '@salesforce/apex/HumanaUtility.fetchAccounts';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle } from 'lightning/platformResourceLoader';
import humanaCSS from '@salesforce/resourceUrl/humanaResource';

const columns = [
    { label: 'Group name', type: 'button', typeAttributes:{ label: { fieldName: 'groupName' }, name: 'view_account', class: 'btn_acct'}},
    { label: 'Quote no.', fieldName: 'quoteNumber' },
    { label: 'Effective date', fieldName: 'effectiveDate', type: 'date' },
    { label: 'Group size', fieldName: 'caseSize' },
    { label: 'Type', fieldName: 'type' },
    { label: 'Lines', fieldName: 'lines' },
    { label: 'Status', fieldName: 'status' },
    {label: '', type: 'button', initialWidth: 200, typeAttributes:
        { label: { fieldName: 'actionLabel' }, title: 'View Quote', name: 'view_quote',  iconName: 'utility:forward', iconPosition: 'right', class: 'btn_next'}},
];

export default class HumanaQuoteTabs extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track record = {};
    @track draftValues = [];
    @api exposedName;
    @wire(fetchAllAccounts) accounts;
    
    async renderedCallback(){
        console.log(this.accounts.data);
    }

    connectedCallback() {
        Promise.all([
          loadStyle(this, humanaCSS)
        ]).then(() => {
            console.log('CSS Loaded');
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'view_quote':
                this.viewAccount(row.id);
                break;
            case 'view_account':
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
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
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
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        console.log(recordInputs);
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(account => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Accounts updated',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];
            console.log(account);
            // Display fresh data in the datatable
            return refreshApex(this.accounts);
        }).catch(error => {
            console.log(error);
        });
    }

}