<script setup>
const runtimeConfig = useRuntimeConfig();
const isUpload = ref(false);
const isLoading = ref(false);
const imgFile = ref(null);
const imgPreview = ref(null);
const allowedTypes = ref(["image/jpeg", "image/png"]);
const errorType = ref(false);
const text = ref(null);

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
            <div class="row mt-2 mb-5 text-center">
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
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#"
                  >My device</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link (URL)</a>
              </li>
            </ul>
            <div class="card-body">
              <div
                @click="$refs.file.click()"
                class="uploader"
                @dragover.prevent
                @dragenter.prevent
                @dragstart.prevent
                @drop.prevent="onChange($event.dataTransfer)"
              >
                <div class="file-input" v-if="!isUpload">
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
                <p class="h6">Drag image here or click to browse</p>
                <div v-if="isUpload">
                  <img :src="imgPreview" class="img-fluid px-5" />
                  <button
                    size="sm"
                    class="btn btn-info text-light mt-5"
                    @click="uploadImage"
                  >
                    <i class="bi-upload btn-icon"></i> Upload image
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      v-if="isLoading"
                    ></span>
                  </button>
                  <div class="form-floating mt-5 px-5">
                    <textarea class="form-control">{{ text }}</textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
