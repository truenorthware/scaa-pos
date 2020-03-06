<template>
  <v-dialog v-model="showDialog" max-width="500" persistent>
    <template v-slot:activator="{ on }">
      <v-avatar size="36px" tile class="ma-0" v-on="on">
        <v-img :lazy-src="lazyUrl" :src="thumbnail" v-on:error="onThumbnailError"></v-img>
      </v-avatar>
    </template>

    <!-- form -->
    <v-card>
      <v-card-title primary-title>{{ title }}</v-card-title>
      <v-divider></v-divider>
      <v-container grid-list-md class="grey lighten-5">
        <v-layout wrap>
          <v-flex xs12 class="text-center text-sm-center text-md-center text-lg-center">
            <v-img class="white--text" aspect-ratio="1" height="400px" :src="productImage">
              <input type="file" style="display: none" ref="image1" accept="image/*" @change="onFilePicked" />
            </v-img>
          </v-flex>
        </v-layout>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn icon @click="pickFile"> <v-icon>fas fa-folder-open</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="uploadMode == 0" text color="red" @click="handleRemove">Remove</v-btn>
        <v-btn v-if="uploadMode == 1" color="primary" text @click="handleSave()">{{ $t("button-text-save") }}</v-btn>
        <v-btn text @click="handleCancel">{{ $t("button-text-cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
    <!-- form> -->
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch } from "vue-property-decorator";
import { BASE_URL } from "@/utils/const";
@Component({
  components: {}
})
export default class ProductImageDialog extends Vue {
  private showDialog = false;

  imageUrl = require("@/assets/img/empty1.png");
  imageFile: any;
  uploadMode = 0;

  @Prop({ default: {} as any }) item?: any;
  @Prop({ default: require("@/assets/img/empty1.png") }) lazyUrl?: any;
  @Prop() onSave: Function;

  private onThumbnailError(event) {
    confirm("onThumbnailError");
  }

  private handleCancel() {
    this.uploadMode = 0;
    this.showDialog = false;
    return;
  }

  private handleRemove() {
    this.uploadMode = -1;
  }

  private handleSave() {
    this.onSave(this.item, this.imageFile);
    this.showDialog = false;
  }

  get title() {
    return this.item.ProductCode;
  }

  get thumbnail() {
    let ver = this.item.ImageVersion;
    console.log("version +", ver);
    return this.item.ImageId == 0
      ? require("@/assets/img/empty1.png")
      : BASE_URL + `/api/V1/GetPosProductImage?imageId=` + this.item.ImageId + "&ver=" + ver;
  }

  get productImage() {
    return this.uploadMode ? this.imageUrl : this.thumbnail;
  }

  pickFile() {
    const image: any = this.$refs.image1;
    image.click();
  }

  onFilePicked(e) {
    const files = e.target.files;
    if (files[0] !== undefined) {
      const file = e.target.files[0];
      // const url = URL.createObjectURL(file);

      this.uploadMode = 1;
      const reader = new FileReader();
      reader.onload = e => {
        this.imageFile = files[0]; // this is an image file that can be sent to server...
        this.imageUrl = reader.result;
        // confirm("imageFile" + JSON.stringify(this.imageFile));
        // confirm(JSON.stringify(this.imageUrl));
      };
      reader.readAsDataURL(files[0]);
    }
  }

  @Watch("showDialog")
  onDialogShow() {}
}
</script>
