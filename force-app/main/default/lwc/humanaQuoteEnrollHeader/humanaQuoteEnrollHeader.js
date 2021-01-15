import { LightningElement,api } from 'lwc';

export default class HumanaQuoteEnrollHeader extends LightningElement {
    @api headerText = 'Quote & Enroll';
    @api pageName = 'Quote & Enroll';
    @api description = 'Start and manage quotes, and enroll groups';
    @api buttonProperties;

}