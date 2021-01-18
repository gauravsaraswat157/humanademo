import { LightningElement,api } from 'lwc';

export default class HumanaInternalHomePageHeader extends LightningElement {
    @api headerText = 'Benefits Manager';
    @api pageName = 'Benefits Manager';
    @api description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
    @api buttonProperties;

}