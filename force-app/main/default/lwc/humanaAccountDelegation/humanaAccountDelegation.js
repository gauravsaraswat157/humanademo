import { LightningElement, track } from 'lwc';
import humanaIcon from '@salesforce/resourceUrl/HumanaIcons';
import getIPData from '@salesforce/apex/InvokeIPController.getIPData';

export default class HumanaAccountDelegation extends LightningElement {

    @track error;
    @track Accounts = [];
    @track TeamAccess = {};
    @track bShowModal = true;
    @track accountValue = 'Read';
    @track contactValue = 'Read';
    @track opportunityValue = 'Read';
    @track caseValue = 'Read';
    @track _selected = [];
    @track showBrokerModal = false;
    @track requestInProgress = false;
    @track selectedAccountId;

    deleteIcon = humanaIcon + '/delete.png';
    editIcon = humanaIcon + '/edit.png';

    connectedCallback() {
        this.requestInProgress = true;
        let input = { 'ContextId': '' };
        let config = {};
        getIPData({ procedureName: 'Broker_Delegation', input: input, options: config })
            .then(result => {
                const parsedResult = JSON.parse(result);
                parsedResult.Account.forEach(function (acc) {
                    if (typeof acc.Team != 'undefined') {
                        acc.Team.forEach(function (con) {
                            con.uniqueId = acc.Id + '_' + con.Id
                        });
                    }
                });
                let temp = [];
                this.requestInProgress = false;
                parsedResult.Account.map(acc => {
                    if (acc.Team) {
                        let team = acc.Team;
                        let valid = false;
                        team.map(t => {
                            if (valid === false && t.User == '0052E00000Ieu6fQAB') {
                                valid = true;
                            }
                        });
                        if (valid) {
                            temp.push(acc);
                        }
                    }
                });
                console.log('temp', JSON.stringify(temp));
                this.Accounts = temp;
                //this.Accounts = parsedResult.Account;
            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
                this.requestInProgress = false;
            });
    }

    @track openmodel = false;

    openmodal(event) {
        this.openmodel = true;
        let uniqueId = (event.target.value);

    }
    closeModal() {
        this.openmodel = false
    }
    saveMethod() {
        this.closeModal();
    }

    //For Edit Modal
    get accessOptions() {
        return [
            { label: 'Read', value: 'Read' },
            { label: 'Edit', value: 'Edit' },
            { label: 'None', value: 'None' },
        ];
    }

    handleAccountChange(event) {
        this.accountValue = event.detail.value;
    }
    handleContactChange(event) {
        this.contactValue = event.detail.value;
    }
    handleOpportunityChange(event) {
        this.opportunityValue = event.detail.value;
    }
    handleCaseChange(event) {
        this.caseValue = event.detail.value;
    }

    get linkOptions() {
        return [
            { label: 'Billing', value: 'en' },
            { label: 'Contracts', value: 'de' },
            { label: 'Employees', value: 'es' },
            { label: 'Quotes', value: 'fr' },
            { label: 'Plans', value: 'it' },
            { label: 'Documents', value: 'ja' },
        ];
    }

    get selected() {
        return this._selected.length ? this._selected : 'none';
    }

    handleMultiChange(e) {
        this._selected = e.detail.value;
    }

    toggleBrokerModal(e) {
        this.selectedAccountId = e.target.name;
        this.showBrokerModal = !this.showBrokerModal;
    }
}