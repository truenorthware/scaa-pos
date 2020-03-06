<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn slot="activator" v-on="on" outlined text small color="darkgrey--text darken-1" @click="onClick">
        {{ $t("button-text-change-opening") }}
      </v-btn>
    </template>

    <v-form v-model="validInput">
      <v-card>
        <v-card-title primary-title>{{ $t("title-opening-balance") }}</v-card-title>
        <v-divider></v-divider>
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- Opening Balance -->
            <v-flex xs12>
              <v-text-field clearable v-model.lazy="amt" :rules="[rules.required]"></v-text-field>
            </v-flex>
            <!-- Staff Code -->
            <v-flex xs12>
              <v-select
                v-model="select"
                hint="Staff Code"
                :items="items"
                item-text="state"
                item-value="abbr"
                label="Select"
                persistent-hint
                return-object
                single-line
                :loading="loading"
              ></v-select>
            </v-flex>
            <!-- Opening Date -->
            <v-flex xs12>
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="openingDate" prepend-icon="event" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="openingDate" @input="menu2 = false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="handleCancel">{{ $t("button-text-cancel") }}</v-btn>
          <v-btn color="primary" text @click="handleSave" :disabled="disableOk">{{ $t("button-text-confirm") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";
import { IFiscalBalance } from "@/types";
import { MASK_16A } from "@/utils/const";
import { mask } from "vue-the-mask";

import * as api from "@/services";
import _ from "lodash";

@Component({})
export default class OpenBalanceDialog extends Vue {
  private showDialog = false;
  private amt = 0;
  //private staffCode = "";
  private openingDate = "";

  loading = true;
  menu = false;
  modal = false;
  menu2 = false;
  select = { state: "", abbr: "" };
  items = [];

  private rules = { required: value => !!value || "Required" };
  private validInput: boolean = false;
  private result = {
    Opening: this.amt,
    StaffCode: this.select.state,
    OpeningDate: this.openingDate
  };

  @Prop({ default: {} as IFiscalBalance }) fiscalBalance?: IFiscalBalance;

  @Emit("onSave")
  handleSave() {
    this.showDialog = false;
    this.result.Opening = this.amt;
    this.result.StaffCode = this.select.state;
    this.result.OpeningDate = this.openingDate;

    return this.result;
  }

  @Emit("onCancel")
  handleCancel() {
    this.showDialog = false;
  }

  get disableOk() {
    let notReady = this.validInput == false || this.loading == true;
    return notReady;
  }

  private onClick() {
    this.amt = this.fiscalBalance.Opening;
    //this.staffCode = this.fiscalBalance.StaffCode;
    this.openingDate = this.fiscalBalance.OpeningDate.substring(0, 10);
    this.fetchData();
  }

  private async fetchData() {
    this.loading = true;
    try {
      let sortParams = _.zipWith(["StaffCode"], [false], function(by, isDesc) {
        return isDesc ? by + "|desc" : by;
      }).join(",");

      let response = await api.getStaff(1, 1000, sortParams, "");

      this.items = response.data.map(s => ({ state: s.StaffCode, abbr: s.StaffCode }));
      let i = this.items.findIndex(o => o.state == this.fiscalBalance.StaffCode);
      if (i == -1) {
        this.select = this.items[0];
      } else {
        this.select = this.items[i];
      }
    } catch (e) {
      console.log("fetch Staff failed..", e);
    } finally {
      this.loading = false;
    }
  }
}
</script>
