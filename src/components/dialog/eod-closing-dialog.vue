<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn slot="activator" v-on="on" text icon color="green" @click="onClick">
        <v-icon>check_circle</v-icon>
      </v-btn>
    </template>

    <v-form v-model="validInput">
      <v-card>
        <v-card-title primary-title>{{ $t("title-eod-posting") }}</v-card-title>
        <v-divider></v-divider>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 v-if="isEdit">
              <v-menu
                v-model="menuPostingDate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="postingDate"
                    label="Opening Date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="postingDate" @input="menuPostingDate = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-menu
                v-model="menuCloseDate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <!-- label="`$t('label-order-posting-close-date')`" -->
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="postingCloseDate"
                    label="Close Date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="postingCloseDate" @input="menuCloseDate = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="select"
                :items="staffItems"
                item-text="state"
                item-value="abbr"
                label="Cashier"
                persistent-hint
                return-object
                prepend-icon="account_circle"
                :loading="loading"
              ></v-select>
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
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { IPosPosting } from "@/types";
import { MASK_16A } from "@/utils/const";
import { mask } from "vue-the-mask";
import * as api from "@/services";
import _ from "lodash";
import moment from "moment";

@Component({ directives: { mask } })
export default class EodClosingDialog extends Vue {
  private showDialog = false;

  private rules = { required: value => !!value || "Required" };
  private validInput: boolean = false;

  private staffItems = [];
  private loading = true;
  private select = { state: "", abbr: "" };
  private menuPostingDate = false;
  private postingDate = "";
  private postingCloseDate = "";
  private menuCloseDate = false;

  private maskStaffCode = MASK_16A;
  @Prop({ default: {} as IPosPosting }) item?: IPosPosting;
  @Prop({ default: false }) isEdit?: boolean;

  @Emit("onSave")
  handleSave() {
    this.showDialog = false;
    this.item.StaffCode = this.select.state;
    this.item.PostingDate = this.postingDate;
    this.item.PostingCloseDate = this.postingCloseDate;
    return this.item;
  }

  @Emit("onCancel")
  handleCancel() {
    this.showDialog = false;
    return this.item;
  }

  get PostingDateLabel() {
    return this.$t("label-order-posting-date");
  }

  get disableOk() {
    let notReady = this.validInput == false || this.loading == true;
    return notReady;
  }

  private onClick() {
    // this.amt = this.fiscalBalance.Opening;
    let pDate = moment(this.item.PostingDate);
    let pcDate = moment(this.item.PostingCloseDate);

    this.postingDate = pDate.isValid()
      ? this.item.PostingDate.substring(0, 10)
      : new Date().toISOString().substring(0, 10);

    this.postingCloseDate = pcDate.isValid()
      ? this.item.PostingCloseDate.substring(0, 10)
      : new Date().toISOString().substring(0, 10);

    this.fetchData();
  }

  private async fetchData() {
    this.loading = true;
    try {
      let sortParams = _.zipWith(["StaffCode"], [false], function(by, isDesc) {
        return isDesc ? by + "|desc" : by;
      }).join(",");

      let response = await api.getStaff(1, 1000, sortParams, "");

      this.staffItems = response.data.map(s => ({ state: s.StaffCode, abbr: s.StaffCode }));
      let i = this.staffItems.findIndex(o => o.state == this.item.StaffCode);
      if (i == -1) {
        this.select = this.staffItems[0];
      } else {
        this.select = this.staffItems[i];
      }
    } catch (e) {
      console.log("fetch Staff failed..", e);
    } finally {
      this.loading = false;
    }
  }
}
</script>
