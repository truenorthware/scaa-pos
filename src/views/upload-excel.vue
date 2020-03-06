<template>
  <div>
    <excel-import :on-success="handleSuccess" :before-upload="beforeUpload" />

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="excelData"
      :items-per-page="-1"
      :item-key="keyCode"
      hide-default-footer
      show-select
      class="elevation-1"
    >
      <template v-slot:top>
        <slot-top-excel-upload
          :tabItems="tabItems"
          :tabIndex.sync="tab"
          :on-cancel="handleCancel"
          :on-print="handlePrint"
          :on-upload="handleUpload"
        />
      </template>

      <template v-slot:item.Status="{ item }">
        <v-chip v-if="showStatus(item)" :color="statusColor(item)">
          {{ statusText(item) }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import * as api from "@/services";
import _ from "lodash";

@Component({
  components: {
    SlotTopExcelUpload: () => import("@/components/datatable/slot-top-excel-upload.vue"),
    ExcelImport: () => import("@/components/excel/excel-import.vue")
  }
})
export default class UploadExcel extends Vue {
  private loading = false;
  private selected = [];
  private tableData = [];
  private tableHeader = [];
  private uploadStatus = [];

  private tab = 0;

  private tabItems = AppModule.excelUpload.map(el => el.option);
  private columns = AppModule.excelUpload.map(el => el.headers);
  private keys = AppModule.excelUpload.map(el => el.key);

  get excelData() {
    return this.tableData;
  }

  get headers() {
    return this.columns[this.tab];
  }

  get keyCode() {
    return this.keys[this.tab];
  }

  beforeUpload(file) {
    const isLt1M = file.size / 1024 / 1024 < 1;
    return Boolean(isLt1M);
  }

  handleSuccess({ header, results }) {
    this.selected = [];
    this.uploadStatus = [];
    this.tableHeader = header;

    const result = [];
    const map = new Map();

    // ensure to have unique key to keep datatable happy!!
    for (const item of results.slice(0)) {
      if (!map.has(item[this.keyCode])) {
        map.set(item[this.keyCode], true); // set any value to Map
        result.push(item);
      }
    }

    const requireColumns = this.columns[this.tab].map(el => el.value).filter(el => el != "Status");
    const diff = _.xor(requireColumns, header);

    if (_.isEmpty(diff)) {
      // All good. Column header match
      this.tableData = result;
      //confirm("array is empty");
    } else {
      confirm("Columns does not match");
      this.handleCancel();
    }
  }

  handleCancel() {
    this.selected = [];
    this.tableData = [];
    this.tableHeader = [];
    this.uploadStatus = [];
  }

  handlePrint() {
    // let items = AppModule.excelUpload.map(el => el.option);
    // confirm("hello print" + JSON.stringify(items));
  }

  private findMatch(code: string) {
    return this.uploadStatus.find(el => el.Code === code);
  }

  private showStatus(item: any) {
    return Boolean(this.findMatch(item[this.keyCode]));
  }

  private statusColor(item: any) {
    let match = this.findMatch(item[this.keyCode]);

    if (match.response.Mode) {
      switch (match.response.Mode) {
        case "insert":
          return "success";
        case "update":
          return "info";
        default:
          return "error";
      }
    }
    return "error";
  }

  private statusText(item: any) {
    let match = this.findMatch(item[this.keyCode]);

    if (match.response.Mode) {
      return match.response.Mode;
    }

    return this.$t("chip-text-error");
  }

  private async handleUpload() {
    this.uploadStatus = [];

    // Caution: The func items need to be precisely match to the tab order
    const func = [api.upsertPosProduct, api.upsertPosCustomer, api.upsertPosStaff];
    const idx = Math.min(this.tab, func.length - 1);

    for (const item of this.selected) {
      let code = item[this.keyCode];
      await this.uploadSingleItem(code, item, func[idx]);
    }
  }

  private async uploadSingleItem(code: string, item: any, func1: Function) {
    this.loading = true;

    try {
      const response = await func1(item);
      const status = { Code: code, response: response };
      this.uploadStatus.push(status);
      console.log(JSON.stringify(response));
    } catch (e) {
      this.loading = false;
      console.log("add product failed..", e);
    } finally {
      this.loading = false;
    }
  }

  @Watch("tab")
  onTabChange() {
    this.handleCancel();
  }
}
</script>
