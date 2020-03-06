export default {
  table: {
    tableWrapper: "",
    tableHeaderClass: "fixed",
    tableBodyClass: "vuetable-semantic-no-top fixed",
    tableClass: "v-datatable v-table theme--light",
    loadingClass: "loading",
    ascendingClass: "sorted-asc",
    descendingClass: "sorted-desc",
    sortableIcon: "fas fa-sort",
    handleIcon: "grey sidebar icon",
    ascendingIcon: "fas fa-chevron-up",
    descendingIcon: "fas fa-chevron-down"
  },
  pagination: {
    wrapperClass: "v-datatable__actions v-datatable__actions__range-controls",
    activeClass: "primary",
    disabledClass: "disabled",
    pageClass: "v-btn v-btn--flat v-btn--icon theme--light",
    linkClass: "v-btn v-btn--flat v-btn--icon theme--light grey--text darken-1 small",
    paginationClass: "ui bottom attached segment grid",
    paginationInfoClass: "left floated left aligned six wide column",
    dropdownClass: "ui search dropdown",
    icons: {
      first: "fas fa-fast-backward",
      prev: "fas fa-chevron-left",
      next: "fas fa-chevron-right ",
      last: "fas fa-fast-forward"
    }
  },
  paginationInfo: {
    infoClass: "v-datatable__actions__select grey--text darken-1"
  }
};
