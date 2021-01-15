import { LightningElement, api } from 'lwc';

export default class HumanaAccountDeligationHeader extends LightningElement {
    @api headerText = 'Account Delegation';
    @api pageName = 'Account Delegation';
    @api description = 'Account Delegation';
}