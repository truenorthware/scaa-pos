<template>
  <v-card :class="stat.bgColor" dark>
    <v-container fluid grid-list-sm dark>
      <v-layout class="mt-0 mb-0 mx-1 media-box" row wrap>
        <v-flex sm3 md2 hidden-xs-only class="d-flex align-start pt-3">
          <v-icon class="mx-0" x-large dark>{{ stat.icon }}</v-icon>
        </v-flex>
        <v-flex sm9 md10 xs12>
          <v-layout class="mt-0 mb-0 pa-0 d-block">
            <div class="silver--text subheading mb-1">{{ stat.title }}</div>
            <div class="silver--text display-1">{{ stat.data }}</div>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { IFiscalBalance } from "@/types";

@Component({})
export default class DashboardStatsCard extends Vue {
  @Prop({ default: {} as any }) stat?: any;
}
</script>
