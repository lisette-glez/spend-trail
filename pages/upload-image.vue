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
  formData.append("file", imgFile.value);
  formData.append("language", "eng");
  formData.append("apikey", runtimeConfig.public.apiKey);
  formData.append("OCREngine", 3);

  const { data } = await useFetch(runtimeConfig.public.apiBase, {
    method: "post",
    headers: { "X-Api-Key": runtimeConfig.public.apiKey },
    body: formData,
  });

  if (data.value.OCRExitCode == 1) {
    text.value = data.value.ParsedResults[0].ParsedText;
    isLoading.value = false;
  }
}
</script>

<template>
  <section>
    <div class="container">
      <div class="row my-5 justify-content-center">
        <div class="col-md-8">
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
          <div class="card upload-card mt-4">
            <div class="card-body">
              <div class="text-center mt-3">
                <h5 class="fw-bolder">
                  Select image to Upload or Drag and Drop
                </h5>
              </div>
              <div
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
                    <p class="custom-subtitle mt-4">
                      <button
                        size="sm"
                        class="btn btn-info browse-btn mt-2"
                        @click="$refs.file.click()"
                      >
                        <i class="bi-plus-circle-dotted btn-icon"></i> Browse
                        image
                      </button>
                    </p>
                    <input
                      type="file"
                      ref="file"
                      @change="onChange($event.target)"
                    />
                  </div>
                </div>
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
                    <textarea class="form-control" v-model="text"></textarea>
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
