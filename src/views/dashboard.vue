<template>
  <!-- <template :loading="loading"> -->
  <v-container id="dashboard" fluid grid-list-lg class="mx-0 pa-3">
    <v-layout wrap>
      <!-- stats card -->
      <v-flex lg4>
        <v-layout wrap>
          <v-flex xs12 v-for="(stat, index) in headers.monthlyStats" v-bind:key="index">
            <dashboard-stats-card :stat="stat"></dashboard-stats-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- invoice card -->
      <v-flex lg8>
        <invoice-card></invoice-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import * as api from "@/services";

@Component({
  components: {
    DashboardStatsCard: () => import("@/components/card/dashboard-stats-card.vue"),
    InvoiceCard: () => import("@/components/card/invoice-card.vue")
  }
})
export default class Dashboard extends Vue {
  private loading = false;
  private outstandingAmount = 0;
  private orderCount = 0;

  get headers() {
    return {
      monthlyStats: [
        {
          bgColor: "cyan darken-3",
          icon: "monetization_on",
          title: this.$t("title-total-turnover"),
          data: this.outstandingAmount,
          action: {
            label: this.$t("button-text-more-info"),
            link: ""
          }
        },
        {
          bgColor: "deep-orange  lighten-3",
          icon: "payment",
          title: this.$t("title-number-of-orders"),
          data: this.orderCount,
          action: {
            label: this.$t("button-text-more-info"),
            link: ""
          }
        }
      ]
    };
  }

  private async fetchStatus() {
    this.loading = true;

    try {
      const response = await api.getUnpostedInvoiceStatistics();

      this.outstandingAmount = response.turnover;
      this.orderCount = response.orderCount;
    } catch (e) {
      // console.log("fetchInvoice outstanding amount failed..", e);
    } finally {
      this.loading = false;
    }
  }

  created() {
    this.fetchStatus();
  }
}
</script>
