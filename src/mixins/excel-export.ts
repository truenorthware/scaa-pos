import Vue from "vue";
import { Component } from "vue-property-decorator";
import { IOptions } from "@/types";
import _ from "lodash";

@Component
export default class ExcelExport extends Vue {
  defaultFooterProps = {
    showCurrentPage: true,
    showFirstLastPage: true,
    itemsPerPageOptions: [10, 25, 50, 100],
    itemsPerPageText: "每頁顯示"
  };

  private forceFileDownload(response, fileName: string) {
    var blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", fileName); //or any other extension
    document.body.appendChild(link);
    link.click();
  }

  private sortParams(options: any) {
    return _.zipWith(options.sortBy, options.sortDesc, function(by, isDesc) {
      return isDesc ? by + "|desc" : by;
    }).join(",");
  }

  setSortOptions(options: any, sortBy: any, sortDesc: any) {
    if (sortBy.length > 0 && options.sortBy[0] != sortBy[0]) {
      options.sortBy = sortBy;
    }
    if (sortDesc.length > 0 && options.sortDesc[0] != sortDesc[0]) {
      options.sortDesc = sortDesc;
    } else if (sortBy.length <= 0) {
      options.sortDesc = options.sortDesc ? [false] : [true];
      options.sortBy = sortBy;
      options.sortDesc = sortDesc;
    }
  }

  saveRecord(item: any, editedIndex: number, create: Function, update: Function, close: Function) {
    if (editedIndex == -1) {
      //  new record
      create(item);
    } else {
      update(item);
    }
    close();
  }

  async processApiCall(obj: any, func: Function, setLoading: Function, refreshData: Function) {
    setLoading(true);
    try {
      const response = await func(obj);
      // console.log(JSON.stringify(response));
    } catch (e) {
      console.log("exceptions...", e);
    } finally {
      refreshData();
      setLoading(false);
    }
  }

  async exportExcel(funcExport: Function, showLoading: Function, filename: string) {
    showLoading(true);
    try {
      await funcExport().then(response => this.forceFileDownload(response, filename));
    } catch (e) {
      showLoading(false);
      console.log("export customer failed..", e);
    } finally {
      showLoading(false);
    }
  }

  // eslint-disable-next-line
  async fetchData(
    options: IOptions,
    filter: string,
    getData: Function,
    loadItems: Function,
    showLoading: Function
  ) {
    const sort = this.sortParams(options);
    const pageNo = options.page;
    const pageSize = options.itemsPerPage;

    showLoading(true);
    try {
      const response = await getData(pageNo, pageSize, sort, filter);
      loadItems(response);
    } catch (e) {
      console.log("fetch data failed..", e);
    } finally {
      showLoading(false);
    }
  }

  // eslint-disable-next-line
  private async saveImage(
    item: any,
    file: File,
    uploadImage: Function,
    reloadImage: Function,
    showLoading: Function
  ) {
    let formData = new FormData();
    formData.append("ProductCode", item.ProductCode);
    formData.append("FormFile", file);

    showLoading(true);
    try {
      const response = await uploadImage(formData);
      console.log(JSON.stringify(response));
      reloadImage(response, item);
    } catch (e) {
      showLoading(false);
      console.log("set product image failed..", e);
    } finally {
      showLoading(false);
    }
  }
}
