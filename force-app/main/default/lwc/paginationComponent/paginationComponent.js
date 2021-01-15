import { LightningElement, api, track } from "lwc";

/**
 * Show an item
 */
export default class PaginationComponent extends LightningElement {
  @api pageSize = 10;
  @api total;
  @api paginationRange = 9;
  @track currentPage = 1;
  totalPages = 0;

  connectedCallback() {
    this.totalPages = Math.ceil(this.total / this.pageSize);
  }

  get pages() {
    let pages = [];
    this.totalPages = Math.ceil(this.total / this.pageSize);
    let halfWay = Math.ceil(this.paginationRange / 2);
    let position;

    if (this.currentPage <= halfWay) {
      position = "start";
    } else if (this.totalPages - halfWay < this.currentPage) {
      position = "end";
    } else {
      position = "middle";
    }
    let ellipsesNeeded = this.paginationRange < this.totalPages;
    for (let i = 1; i <= this.totalPages && i <= this.paginationRange; i++) {
      let pageNumber = this.calculatePageNumber(
        i,
        this.currentPage,
        this.paginationRange,
        this.totalPages
      );
      let openingEllipsesNeeded =
        i === 2 && (position === "middle" || position === "end");
      let closingEllipsesNeeded =
        i === this.paginationRange - 1 &&
        (position === "middle" || position === "start");
      let page = {
        index: pageNumber,
        label: pageNumber,
        cls: "default",
        id: this.random_str(5)
      };
      if (this.currentPage == page.index) {
        page.cls += " active";
      }
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        page.index = "...";
        page.label = "...";
        page.cls += " disabled";
      }
      pages.push(page);
    }
    return pages;
  }

  calculatePageNumber(i, currentPage, paginationRange, totalPages) {
    let halfWay = Math.ceil(paginationRange / 2);
    if (i === paginationRange) {
      return totalPages;
    } else if (i === 1) {
      return i;
    } else if (paginationRange < totalPages) {
      if (totalPages - halfWay < currentPage) {
        return totalPages - paginationRange + i;
      } else if (halfWay < currentPage) {
        return currentPage - halfWay + i;
      } else {
        return i;
      }
    } else {
      return i;
    }
  }

  pageClicked(e) {
    e.preventDefault();
    let currentPage = parseInt(e.target.innerHTML);
    this.currentPage = currentPage;
    this.goToPage(this.currentPage);
  }

  get elementClass() {
    return "page-index";
  }

  get showPagination() {
    this.totalPages = Math.ceil(this.total / this.pageSize);
    return this.totalPages > 1 ? true : false;
  }

  get prevDisabled() {
    return this.currentPage === 1 ? "disabled" : "";
  }

  get nextDisabled() {
    return this.currentPage === this.totalPages ? "disabled" : "";
  }

  next(e) {
    e.preventDefault();
    if (this.currentPage === this.totalPages) return;
    this.goToPage(++this.currentPage);
  }

  prev(e) {
    e.preventDefault();
    if (this.currentPage === 1) return;
    this.goToPage(--this.currentPage);
  }

  goToPage(pageIndex) {
    this.dispatchEvent(new CustomEvent("pageclick", { detail: pageIndex }));
  }

  random_str(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}