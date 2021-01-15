import { LightningElement } from "lwc";

export default class HumanaQuickLinks extends LightningElement {
  links = [];
  connectedCallback() {
    this.links = [
      { title: "Secure E-mail", url: "#", id: 1 },
      { title: "Benifits reports (BUD)", url: "#", id: 2 },
      { title: "Manage group access", url: "#", id: 3 },
      { title: "Contracting & licensing", url: "#", id: 4 },
      { title: "Access member ID cards", url: "#", id: 5 }
    ];
  }
}