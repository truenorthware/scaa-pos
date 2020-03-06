<template>
  <div>
    <input ref="excelUploadInput" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick" />
    <div class="drop my-5" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop excel file here or
      <v-btn rounded color="secondary" class="ml-2" :loading="isLoading" @click="handleUpload">
        Browse
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import XLSX from "xlsx";
import { IExcelResult } from "@/types";

@Component({})
export default class ExcelImport extends Vue {
  private name = "cart-content-list";

  @Prop() beforeUpload: Function;
  @Prop() onSuccess: Function;

  private loading: boolean = false;
  private excelData = {
    header: null,
    results: null
  };

  get isLoading() {
    return this.loading;
  }

  private generateData(result: IExcelResult) {
    this.excelData.header = result.Header;
    this.excelData.results = result.Data;
    this.onSuccess(this.excelData);
  }

  handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.loading) return;

    const files = e.dataTransfer.files;
    if (files.length !== 1) {
      //this.$message.error("Only support uploading one file!");
      return;
    }
    const rawFile = files[0]; // only use files[0]
    // confirm(rawFile);
    if (!this.isExcel(rawFile)) {
      // this.$message.error("Only supports upload .xlsx, .xls, .csv suffix files");
      return false;
    }

    // confirm("isexcel");

    this.upload(rawFile);
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  handleUpload() {
    (this.$refs.excelUploadInput as HTMLInputElement).click();
  }

  handleClick(e) {
    const files = e.target.files;
    const rawFile = files[0]; // only use files[0]
    if (!rawFile) return;
    this.upload(rawFile);
  }

  private upload(rawFile) {
    (this.$refs.excelUploadInput as HTMLInputElement).value = null;

    if (!this.beforeUpload) {
      this.readerData(rawFile);
      return;
    }
    const before = this.beforeUpload(rawFile);

    this.loading = true;
    let promise = this.readerData(rawFile);

    promise.then(result => {
      this.loading = false;
      this.generateData(result as IExcelResult);
    });
  }

  private readerData(rawFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const header = this.getHeaderRow(worksheet);
        const results = XLSX.utils.sheet_to_json(worksheet);

        let result: IExcelResult = { Header: header, Data: results };
        resolve(result);
      };
      reader.readAsArrayBuffer(rawFile);
    });
  }

  getHeaderRow(sheet) {
    const headers = [];
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    let C;
    const R = range.s.r;
    /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) {
      /* walk every column in the range */
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
      /* find the cell in the first row */
      let hdr = "UNKNOWN " + C; // <-- replace with your desired default
      if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
      headers.push(hdr);
    }
    return headers;
  }

  isExcel(file) {
    return /\.(xlsx|csv)$/.test(file.name);
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
