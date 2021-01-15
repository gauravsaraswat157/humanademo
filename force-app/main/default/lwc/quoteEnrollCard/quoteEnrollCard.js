import { LightningElement, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import temp from "./quoteEnrollCard.html";

export default class QuoteEnrollCard extends BaseState(LightningElement) {
  @track data = {};
  @track openmodel = false;
  @track openExisting = false;
  @track selectedValue = '';
  @track isButtonDisabled = true;
  
  openmodal() {
    this.openmodel = true;
  }
  closeModal() {
    this.openmodel = false;
    this.openExisting = false;
  }
  showGroups(){
    this.openExisting = true;
  }
  openPrevious(){
    this.openExisting = false;
    this.isButtonDisabled = true;
  }
  connectedCallback() {}

  /**
   * Prepares data object from card configuration. It allows to access data on key-value basis.
   */
  formatDataFromConfiguration() {
    if (this.state && this.state.fields) {
      this.state.fields.forEach(field => {
        if (!field.name.startsWith("link:")) {
          this.data[field.name] = field.label;
        }
      });
      this.data.title = this.state.name ? this.state.name : "";
    }
  }

  render() {
    return temp;
  }

  handleClick(e){
    if(e.target.getAttribute('data-handler') === 'openmodal' ){
      this.openmodal();
      e.preventDefault();
    }
  }

  handleSelected(event) {
    this.selectedValue = event.target.value;
    if(this.selectedValue === "existing_group"){
      this.isButtonDisabled = false; 
    }else{
      this.isButtonDisabled = true;
      // if clicked on new group, redirection to page code goes here
    }
  }

  renderedCallback() {
    this.formatDataFromConfiguration();
  }

  /**
   * Extract links from configuration.
   */
  get links() {
    let links = [];
    if (this.state && this.state.fields) {      
      this.state.fields.forEach((field, index) => {
        
        if (field.name.startsWith("link:")) {
          if(field.hasOwnProperty('data')){
            links.push({
              id: index,
              label: field.name.replace("link:", ""),
              value: field.label,
              data: field.data
            });
          } else {
            links.push({
              id: index,
              label: field.name.replace("link:", ""),
              value: field.label,
              data:  {function: ""}
            });
          }
          //console.log(JSON.stringify(field));
          
        }

      });
    }
    //console.log(JSON.stringify(links));
    return links;
  }
}