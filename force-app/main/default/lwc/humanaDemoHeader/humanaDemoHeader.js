import { LightningElement,api,track } from 'lwc';

export default class HumanaDemoHeader extends LightningElement {
    @api menuItems;
    @track toggleArrow = true;
    showSubmenu(event){
            /*let lastNode = event.target.parentElement.lastChild;
            lastNode.setAttribute('class','displayBlock slds-dropdown slds-dropdown_right');
            console.log(event.target.parentElement.nextSibling);
            // event.target.parentElement.parentElement.nextSiblingthis.style.display = "block";//('title', this.myTitle);
            */
    }
}