import { LightningElement,api } from 'lwc';

export default class HumanaInternalHomePageHeader extends LightningElement {
    @api headerText = 'View My Groups';
    @api pageName = 'View My Groups';
    @api description = 'View all your exsting groups at one place.';
    @api buttonProperties;

}