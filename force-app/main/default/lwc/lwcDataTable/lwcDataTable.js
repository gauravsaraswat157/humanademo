/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { LightningElement, wire, api, track } from "lwc";
//import initRecords from '@salesforce/apex/LWCDataTableController.initRecords';
//import updateRecords from '@salesforce/apex/LWCDataTableController.updateRecords';
import { NavigationMixin } from "lightning/navigation";
//import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import util from "vlocity_ins/utility";

export default class LwcDataTable extends NavigationMixin(LightningElement) {
  @api objectApiName;
  @api fieldNamesStr;
  @api inlineEdit = false;
  @api colAction = false;
  @api searchPlaceholder;
  @api pageSize = 10;
  @track data;
  @track columns;
  @track isDataAvailable = false;
  @track loadMoreStatus;
  @track requestInProgress = false;
  @api totalNumberOfRows;
  @api customActions;
  @api stateObj;
  @api contextId;
  @api sObjectType;
  searchTerm = "";

  currentPage = 1;

  request = {
    type: "apexremote",
    value: {
      className: "LWCDataTableController",
      methodName: "initRecords",
      inputMap: "{}",
      optionsMap: "{}"
    }
  };

  processColumnsBeforeRender(columns) {
    columns.push({
      type: "customActions",
      label: "Actions",
      fieldName: "accountId",
      typeAttributes: {
        actions: this.customActions,
        stateObj: this.stateObj,
        contextId: this.contextId,
        sObjectType: this.sObjectType
      }
    });
    columns.map((column, index) => {
      if (column.fieldName === "Products__c") {
        column.type = "product";
      } else if (column.fieldName === "Name") {
        column.type = "button";
        column.typeAttributes = {
          label: { fieldName: "Name" },
          name: "view_account",
          class: "btn_acct"
        };
      }
    });
    console.log("this.columns", JSON.stringify(columns));
    return columns;
  }

  viewAccount(accountId) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: accountId,
        objectApiName: "Account",
        actionName: "view"
      }
    });
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "view_account":
        this.viewAccount(row.Id);
        break;
      default:
    }
  }

  initRecords() {
    this.request.value.inputMap = JSON.stringify({
      objectName: this.objectApiName,
      fieldNamesStr: this.fieldNamesStr,
      recordId: "",
      orderby: "Id",
      orderDir: "ASC",
      inlineEdit: this.inlineEdit,
      enableColAction: this.colAction,
      searchTerm: this.searchTerm,
      pageSize: this.pageSize,
      currentPage: this.currentPage
    });
    this.requestInProgress = true;
    util
      .getDataHandler(JSON.stringify(this.request))
      .then(response => {
        response = JSON.parse(response);
        this.columns = this.processColumnsBeforeRender(
          response.results.ldwList
        );
        let records = response.results.sobList;
        this.isDataAvailable = records.length > 0 ? true : false;
        records.map((record, index) => {
          record.accountId = record.Id;
        });
        console.log("records", JSON.stringify(records));
        this.data = records;

        this.totalNumberOfRows = response.results.totalCount;
        this.requestInProgress = false;
      })
      .catch(error => {
        console.log("error while fetching data.", JSON.stringify(error));
        this.requestInProgress = false;
      });
  }

  connectedCallback() {
    this.initRecords();
  }

  handleSearch(event) {
    this.searchTerm = event.target.value;
    if (this.searchTerm.length === 0 || this.searchTerm.length > 3) {
      this.currentPage = 1;
      this.initRecords();
      return;
    }
  }

  getSelectedName(event) {
    var selectedRows = event.detail.selectedRows;
    var recordIds = [];
    if (selectedRows.length > 0) {
      for (let i = 0; i < selectedRows.length; i++) {
        recordIds.push(selectedRows[i].Id);
      }

      const selectedEvent = new CustomEvent("selected", {
        detail: { recordIds }
      });
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
    }
  }

  pageClicked(e) {
    this.currentPage = e.detail;
    this.initRecords();
  }

  /*
  wiredsObjectData;
    @wire(initRecords, {
      ObjectName: "$objectApiName",
      fieldNamesStr: "$fieldNamesStr",
      recordId: "",
      Orderby: "Id",
      OrderDir: "ASC",
      inlineEdit: "$inlineEdit",
      enableColAction: "$colAction"
    })
    wiredSobjects(result) {
      this.wiredsObjectData = result;
      if (result.data) {
        this.data = result.data.sobList;
        this.columns = result.data.ldwList;
        this.totalNumberOfRows = result.data.totalCount;
      }
    }
  loadMoreData() {
    //Display a spinner to signal that data is being loaded
    //Display "Loading" when more data is being loaded
    this.loadMoreStatus = "Loading";
    const currentRecord = this.data;
    const lastRecId = currentRecord[currentRecord.length - 1].Id;
    initRecords({
      ObjectName: this.objectApiName,
      fieldNamesStr: this.fieldNamesStr,
      recordId: lastRecId,
      Orderby: "Id",
      OrderDir: "ASC",
      inlineEdit: this.inlineEdit,
      enableColAction: this.colAction
    })
      .then(result => {
        const currentData = result.sobList;
        //Appends new data to the end of the table
        const newData = currentRecord.concat(currentData);
        this.data = newData;
        if (this.data.length >= this.totalNumberOfRows) {
          this.loadMoreStatus = "No more data to load";
        } else {
          this.loadMoreStatus = "";
        }
      })
      .catch(error => {
        console.log("-------error-------------" + error);
        console.log(error);
      });
  }

  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "edit":
        this.editRecord(row);
        break;
      case "view":
        this.viewRecord(row);
        break;
      case "delete":
        this.deleteRecord(row);
        break;
      default:
        this.viewRecord(row);
        break;
    }
  }

  //currently we are doing client side delete, we can call apex tp delete server side
  deleteRecord(row) {
    const { id } = row;
    const index = this.findRowIndexById(id);
    if (index !== -1) {
      this.data = this.data.slice(0, index).concat(this.data.slice(index + 1));
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

  editRecord(row) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: row.Id,
        actionName: "edit"
      }
    });
  }

  viewRecord(row) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: row.Id,
        actionName: "view"
      }
    });
  }*/

  //When save method get called from inlineEdit
  handleSave(event) {
    /*
    var draftValuesStr = JSON.stringify(event.detail.draftValues);
    updateRecords({
      sobList: this.data,
      updateObjStr: draftValuesStr,
      objectName: this.objectApiName
    })
      // eslint-disable-next-line no-unused-vars
      .then(result => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Records updated",
            variant: "success"
          })
        );
        // Clear all draft values
        this.draftValues = [];
        return refreshApex(this.wiredsObjectData);
      })
      .catch(error => {
        console.log("-------error-------------" + error);
        console.log(error);
      });
    */
  }

  // The method will be called on sort click
  /*updateColumnSorting(event) {
    var fieldName = event.detail.fieldName;
    var sortDirection = event.detail.sortDirection;
  }*/
}