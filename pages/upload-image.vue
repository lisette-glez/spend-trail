<script setup>
const runtimeConfig = useRuntimeConfig();
const isUpload = ref(false);
const isLoading = ref(false);
const imgFile = ref(null);
const imgPreview = ref(null);
const text = ref(null);
const activeTab = ref("device");
const errorAlert = ref(false);
const errorMessage = ref(null);
const allowedTypes = ref([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/tiff",
]);

function onChange(e) {
  imgFile.value = e.files[0];
  if (allowedTypes.value.includes(imgFile.value.type)) {
    isUpload.value = true;
    //image preview
    let reader = new FileReader();
    reader.readAsDataURL(imgFile.value);
    reader.onload = (e) => {
      imgPreview.value = e.target.result;
    };
  } else {
    imgFile.value = null;
    errorMessage.value =
      "File type not allowed. You can upload only jpg, png, webp, heic and tiff images.";
    errorAlert.value = true;
  }
}

async function uploadImage() {
  isLoading.value = true;
  const formData = new FormData();
  formData.append("document", imgFile.value);

  const { data } = await useFetch(runtimeConfig.public.apiBase, {
    method: "post",
    headers: { Authorization: "Token " + runtimeConfig.public.apiKey },
    body: formData,
  });

  if (data.value.api_request.status_code == 201) {
    text.value = data.value.document.inference.prediction;
    isLoading.value = false;
  }
}

function cancelUpload() {
  imgFile.value = null;
  imgPreview.value = null;
  isUpload.value = false;
}

function getUrl(url) {
  imgFile.value = imgPreview.value = url;
  isUpload.value = true;
}

function changeTab(tabName) {
  activeTab.value = tabName;
}
</script>

<template>
  <section>
    <div class="container">
      <div class="row my-5 justify-content-center">
        <div class="col-md-6">
          <AppAlert v-if="errorAlert" :errorMessage="errorMessage" />
          <div class="card upload-card mt-4 p-4">
            <div class="row mt-2 mb-5 text-center" v-if="!isUpload">
              <h5 class="mb-4">Select document type you want process</h5>
              <div class="col">
                <div class="card doc-type-card type-active">
                  <span><i class="bi-file-earmark-text pe-1"></i> Invoice</span>
                </div>
              </div>
              <div class="col">
                <div class="card doc-type-card">
                  <span><i class="bi-receipt pe-1"></i> Receipt</span>
                </div>
              </div>
              <div class="col">
                <div class="card doc-type-card">
                  <span><i class="bi-bank pe-1"></i> Bank Statement</span>
                </div>
              </div>
            </div>
            <ul class="nav nav-tabs justify-content-end">
              <li
                class="nav-item cs-pointer"
                v-if="!isUpload"
                @click="changeTab('device')"
              >
                <a class="nav-link" :class="{ active: activeTab == 'device' }"
                  >Upload</a
                >
              </li>
              <li
                class="nav-item cs-pointer"
                v-if="!isUpload"
                @click="changeTab('link')"
              >
                <a class="nav-link" :class="{ active: activeTab == 'link' }"
                  >From URL</a
                >
              </li>
              <li
                class="nav-item cs-pointer"
                v-if="isUpload"
                @click="uploadImage"
              >
                <div class="nav-link">
                  <i class="bi-upload pe-1"></i> Upload
                  <span
                    class="spinner-border text-primary spinner-border-sm ms-1"
                    role="status"
                    aria-hidden="true"
                    v-if="isLoading"
                  ></span>
                </div>
              </li>
              <li
                class="nav-item cs-pointer"
                v-if="isUpload"
                @click="cancelUpload"
              >
                <div class="nav-link">
                  <i class="bi-x-circle pe-1 text-danger"></i> Cancelar
                  <span
                    class="spinner-border text-primary spinner-border-sm ms-1"
                    role="status"
                    aria-hidden="true"
                    v-if="isLoading"
                  ></span>
                </div>
              </li>
            </ul>
            <div class="card-body">
              <div
                v-if="activeTab == 'device' && !isUpload"
                class="uploader"
                @dragover.prevent
                @dragenter.prevent
                @dragstart.prevent
                @drop.prevent="onChange($event.dataTransfer)"
                :class="{ noPaddingTop: isUpload }"
              >
                <div
                  class="file-input"
                  v-if="!isUpload"
                  @click="$refs.file.click()"
                >
                  <div for="file">
                    <img
                      src="~/assets/img/upload-img.png"
                      class="img-fluid upload-image"
                    />
                    <input
                      type="file"
                      ref="file"
                      @change="onChange($event.target)"
                    />
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-md-5">
                    <p
                      class="h6 upload-title"
                      v-if="!isUpload"
                      @click="$refs.file.click()"
                    >
                      Click to browse, or drag and drop an image here
                    </p>
                  </div>
                </div>
              </div>
              <UploadByLink
                @typedUrl="getUrl"
                v-if="activeTab == 'link' && !isUpload"
              />
            </div>
            <div v-if="isUpload">
              <img :src="imgPreview" class="img-fluid px-5 py-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
