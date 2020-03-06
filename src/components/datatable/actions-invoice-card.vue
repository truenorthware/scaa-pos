<template>
  <div>
    <invoice-reprint-dialog class="mr-3" :item="item" :title="$t('dialog-title-reprint-invoice')" />
    <invoice-void-dialog v-if="voidable" :item="item" :title="$t('dialog-title-void-invoice')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { IInvoiceItem } from "@/types";

@Component({
  components: {
    InvoiceReprintDialog: () => import("@/components/dialog/invoice-reprint-dialog.vue"),
    InvoiceVoidDialog: () => import("@/components/dialog/invoice-void-dialog.vue")
  }
})
export default class ActionDashboard extends Vue {
  private isEdit = true;
  // @Prop({ default: {} as IInvoiceItem }) item?: IInvoiceItem;
  @Prop({ default: {} as any }) item?: any;

  @Emit("onUpdate")
  private handleSave(item: IInvoiceItem) {
    return item;
  }

  @Emit("onCancel")
  private handleCancel(item: IInvoiceItem) {
    return item;
  }

  get voidable() {
    return Boolean(this.item.Flag == 0);
  }
}
</script>
