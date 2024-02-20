<script setup lang="ts">
const uploadInput = ref<HTMLInputElement | null>(null);
const imgFile = ref<File | string>("");
const isUpload = ref(false);
const error = ref("");

const emit = defineEmits(["uploadImage"]);

function onChange(event: Event) {
  const files =
    event.type == "change"
      ? (event.target as HTMLInputElement).files
      : (event as DragEvent).dataTransfer!.files;
  if (files && files![0].type.match("(jpeg|png|webp|heic|tiff)")) {
    imgFile.value = files![0];
    isUpload.value = true;
  } else {
    imgFile.value = "";
    error.value =
      "File type not allowed. You can upload only jpg, png, webp, heic and tiff images.";
  }

  emit("uploadImage", isUpload.value, imgFile.value, error.value);
}

function triggerUpload() {
  uploadInput.value?.click();
}
</script>

<template>
  <div
    class="uploader"
    @dragover.prevent
    @dragenter.prevent
    @dragstart.prevent
    @drop.prevent="onChange($event)"
    :class="{ noPaddingTop: isUpload }"
  >
    <div class="file-input" v-if="!isUpload" @click="triggerUpload">
      <div for="file">
        <img src="/upload-img.png" class="img-fluid upload-image" />
        <input type="file" ref="uploadInput" @change="onChange($event)" />
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <p class="h6 upload-title" v-if="!isUpload" @click="triggerUpload">
          Drag and drop an image here, or click to upload from your device
        </p>
      </div>
    </div>
  </div>
</template>
