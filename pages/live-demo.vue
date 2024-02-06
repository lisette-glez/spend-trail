<script setup lang="ts">
import type { Document } from "../types/document";
const imgUrl = ref(useRuntimeConfig().public.img1Url);
const imgFile = ref<File | string>("");
const extractedData = ref<Document | null>(null);
const parsedData = ref<any>({});
const previewImg = ref("/_nuxt/assets/img/demo/receipt.png");
const loading = ref(false);
const activeImg = ref("Receipt");

onMounted(() => {
  processImage("/api/receipt");
});

async function processImage(apiUrl: string) {
  try {
    loading.value = true;
    await convertDocument();
    const formData = new FormData();
    formData.append("document", imgFile.value);
    extractedData.value = await $fetch<Document>(apiUrl, {
      method: "POST",
      body: formData,
    });

    displayData();
  } catch (error) {
    console.log(error);
    alert("An error occurred while processing the file");
  }
}

function displayData() {
  if (
    extractedData.value &&
    extractedData.value.api_request.status_code == 201
  ) {
    parsedData.value = renameKeys(
      extractedData.value!.document.inference.prediction
    );
    loading.value = false;
  } else {
    alert(
      extractedData.value
        ? extractedData.value.api_request.error.message
        : "An error occurred processing the data"
    );
  }
}

function changeImage(img: string) {
  activeImg.value = img;
  extractedData.value = null;
  if (activeImg.value == "Receipt") {
    previewImg.value = "/_nuxt/assets/img/demo/receipt.png";
    imgUrl.value = useRuntimeConfig().public.img1Url;
    processImage("/api/receipt");
  } else if (activeImg.value == "Invoice") {
    processImage("/api/invoice");
    previewImg.value = "/_nuxt/assets/img/demo/invoice.png";
    imgUrl.value = useRuntimeConfig().public.img2Url;    
  }
}

async function imageUrlToFile(url: string): Promise<File> {
  // Fetch image data from the URL
  const response = await fetch(url);
  const blob = await response.blob();
  // Extract filename from URL
  const filename = url.substring(url.lastIndexOf("/") + 1);
  // Create a File object from the fetched image data
  const file = new File([blob], filename, { type: blob.type });
  return file;
}

async function convertDocument() {
  await imageUrlToFile(imgUrl.value)
    .then((file) => {
      imgFile.value = file;
    })
    .catch((error) => {
      console.error("Error converting image URL to File:", error);
    });
}
</script>

<template>
  <div class="card custom-card px-5 py-5 shadow-sm border-0">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="d-inline-block overflow-hidden bg-light">
          <img :src="previewImg" class="demo-img img-fluid border" />
        </div>
        <div class="row">
          <div class="mt-3 col-md-4">
            <img
              src="~/assets/img/demo/receipt.png"
              class="img-thumbnail cs-pointer"
              @click="changeImage('Receipt')"
            />
          </div>
          <div class="mt-3 col-md-4">
            <img
              src="~/assets/img/demo/invoice.png"
              class="img-thumbnail cs-pointer"
              @click="changeImage('Invoice')"
            />
          </div>
        </div>
      </div>
      <div class="col-md-8 extracted-data ps-md-5">
        <h5 class="mb-3">
          EXTRACTED DATA FROM YOUR
          <span class="text-uppercase">{{ activeImg }}</span>
          <span
            class="spinner-border text-primary spinner-border-sm ms-2"
            role="status"
            aria-hidden="true"
            v-if="loading"
          ></span>
        </h5>
        <ul
          class="list-group rounded-0 d-flex flex-row flex-wrap"
          v-if="!loading"
        >
          <template v-for="(text, key) in parsedData" :key="key">
            <div v-if="text.value != null" class="data-container">
              <div class="fw-bold key-name text-uppercase">{{ key }}</div>
              <li class="list-group-item mb-3">
                <div>{{ text.value }}</div>
              </li>
            </div>
          </template>
          <div class="data-container" v-if="parsedData.locale">
            <div class="fw-bold key-name">CURRENCY</div>
            <li class="list-group-item">
              <div>{{ parsedData.locale.currency }}</div>
            </li>
          </div>
          <div
            class="data-container"
            v-if="
              parsedData.reference_numbers &&
              parsedData.reference_numbers.length > 0
            "
          >
            <div class="fw-bold key-name">PO #</div>
            <li
              class="list-group-item mb-3"
              v-for="(reference, index) in parsedData.reference_numbers"
              :key="index"
            >
              <div>{{ reference.value }}</div>
            </li>
          </div>
        </ul>
        <ul
          class="list-group rounded-0"
          v-if="
            parsedData.line_items &&
            parsedData.line_items.length > 0 &&
            !loading
          "
        >
          <div class="fw-bold key-name">LINE ITEMS</div>
          <li
            class="list-group-item mb-3"
            v-for="(item, index) in parsedData.line_items"
            :key="item.id"
          >
            <div>
              {{ item.quantity || 1 }}- {{ item.description }}
              <span v-if="item.unit_price"> ${{ item.unit_price }}.00</span>
              -
              {{ item.total_amount }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
