<template>
  <v-card class="cyan darken-3" dark>
    <v-container fluid grid-list-sm dark>
      <v-layout class="mt-0 mb-0 mx-1 media-box" wrap>
        <v-flex sm3 md2 hidden-xs-only class="d-flex align-start pt-3">
          <v-icon class="mx-0" x-large dark>{{ icon }}</v-icon>
        </v-flex>
        <v-flex sm9 md10 xs12>
          <v-layout class="mt-0 mb-0 pa-0 d-block">
            <v-flex d-flex xs12 class="pa-0">
              <div class="silver--text subheading">{{ fiscalBalance.FiscalYear }}</div>
            </v-flex>

            <v-flex d-flex xs12 class="pa-0">
              <div class="silver--text display-1">
                {{ fiscalBalance.Opening }}
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm9 md10 xs12>
          <open-balance-dialog :fiscalBalance="fiscalBalance" @onSave="handleSave"> </open-balance-dialog>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { IFiscalBalance } from "@/types";

@Component({
  components: {
    OpenBalanceDialog: () => import("@/components/dialog/open-balance-dialog.vue")
  }
})
export default class FiscalYearBalanceCard extends Vue {
  private icon = "fas fa-dollar-sign";

  @Prop({ default: {} as IFiscalBalance }) fiscalBalance?: IFiscalBalance;

  @Emit("onSave")
  private handleSave(result: any) {
    return result;
  }
}
</script>
