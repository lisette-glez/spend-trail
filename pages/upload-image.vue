<script setup>
const runtimeConfig = useRuntimeConfig();
const isUpload = ref(false);
const imgFile = ref(null);

function onChange(e) {
  imgFile.value = e.target.files[0];
  isUpload.value = true;
}

async function uploadImage() {
  const formData = new FormData();
  formData.append("image", imgFile.value);
  const response = await useFetch(runtimeConfig.public.apiBase, {
    method: "post",
    headers: { "X-Api-Key": runtimeConfig.public.apiKey },
    body: formData,
  });
  console.log(response);
}
</script>

<template>
  <section>
    <div class="container">
      <div class="row my-5 justify-content-center">
        <div class="col-md-8">
          <div class="card upload-card mt-4">
            <div class="card-body">
              <div class="text-center mt-3">
                <h5 class="fw-bolder">
                  Select image to Upload or Drag and Drop
                </h5>
              </div>
              <form method="post" @submit.prevent="onSubmit">
                <div class="uploader">
                  <div class="file-input">
                    <div for="file" v-if="!isUpload">
                      <img
                        src="~/assets/img/upload-img.png"
                        class="img-fluid upload-image"
                      />
                      <p class="custom-subtitle mt-4">
                        <button
                          size="sm"
                          class="btn btn-info browse-btn"
                          @click="$refs.file.click()"
                        >
                          <i class="bi-plus-circle-dotted btn-icon"></i> Browse
                          image
                        </button>
                      </p>
                      <input type="file" ref="file" @change="onChange" />
                    </div>
                    <button
                      size="sm"
                      class="btn btn-info text-light"
                      v-if="isUpload"
                      @click="uploadImage"
                    >
                      <i class="bi-upload btn-icon"></i> Upload image
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
