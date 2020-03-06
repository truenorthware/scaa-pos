<template>
  <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
    <v-text-field
      label="Select Product Image"
      @click="pickFile"
      v-model="imageName"
      prepend-icon="attach_file"
    ></v-text-field>
    <input type="file" style="display: none" ref="image1" accept="image/*" @change="onFilePicked" />
    <img :src="imageUrl" height="150" v-if="imageUrl" />
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component({})
export default class ImagePrev extends Vue {
  private imageData = null;
  imageName = "";
  imageUrl = "";
  imageFile = "";
  @Prop({ default: "0" }) value?: String;

  pickFile() {
    const image: any = this.$refs.image1;
    image.click();
  }

  onFilePicked(e) {
    const files = e.target.files;
    if (files[0] !== undefined) {
      this.imageName = files[0].name;
      if (this.imageName.lastIndexOf(".") <= 0) {
        return;
      }
      const fr = new FileReader();
      fr.readAsDataURL(files[0]);
      fr.addEventListener("load", () => {
        this.imageUrl = fr.result.toString();
        this.imageFile = files[0]; // this is an image file that can be sent to server...
      });
    } else {
      this.imageName = "";
      this.imageFile = "";
      this.imageUrl = "";
    }
  }
}
</script>

<style scoped>
.base-image-input {
  display: block;
  width: 200px;
  height: 200px;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}
.placeholder {
  background: #f0f0f0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 18px;
  font-family: Helvetica;
}
.placeholder:hover {
  background: #e0e0e0;
}
.file-input {
  display: none;
}
</style>
