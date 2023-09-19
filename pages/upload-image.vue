<script setup>
const runtimeConfig = useRuntimeConfig();
const isUpload = ref(false);
const isLoading = ref(false);
const imgFile = ref(null);
const imgPreview = ref(null);
const allowedTypes = ref(["image/jpeg", "image/png"]);
const errorType = ref(false);
const text = ref(null);
const activeTab = ref("device");

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
    errorType.value = true;
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
  console.log(url);
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
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
            v-if="errorType"
          >
            File type not allow
            <i class="bi-exclamation-triangle"></i>
            You can upload only JPEG and PNG images.
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              @click="errorType = !errorType"
            ></button>
          </div>
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
                  >My device</a
                >
              </li>
              <li
                class="nav-item cs-pointer"
                v-if="!isUpload"
                @click="changeTab('link')"
              >
                <a class="nav-link" :class="{ active: activeTab == 'link' }"
                  >Link (URL)</a
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
            </ul>
            <div class="card-body">
              <div
                v-if="activeTab == 'device'"
                class="uploader"
                @dragover.prevent
                @dragenter.prevent
                @dragstart.prevent
                @drop.prevent="onChange($event.dataTransfer)"
                :class="{ noPaddingTop: isUpload }"
              >
                <div class="text-end" v-if="isUpload">
                  <i class="bi-x close-icon" @click="cancelUpload"></i>
                </div>
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
                <p class="h6" v-if="!isUpload">
                  Drag image here or click to browse
                </p>
                <div v-if="isUpload">
                  <img :src="imgPreview" class="img-fluid px-5" />
                </div>
              </div>
              <UploadByLink @typedUrl="getUrl" v-if="activeTab == 'link'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
