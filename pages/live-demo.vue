<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const docApiUrl = ref(runtimeConfig.public.apiBaseReceipt);
const imgUrl = ref(runtimeConfig.public.img1Url);
const extractedData = ref({});
const previewImg = ref("/_nuxt/assets/img/demo/receipt.png");
const loading = ref(false);
const activeImg = ref("Receipt");

onMounted(() => {
  processImage();
});

async function processImage() {
  loading.value = true;
  const formData = new FormData();
  formData.append("document", imgUrl.value);

  const { data, error } = await useFetch<any>(docApiUrl, {
    method: "post",
    headers: { Authorization: "Token " + runtimeConfig.public.apiKey },
    body: formData,
  });

  if (data.value?.api_request.status_code == 201) {
    extractedData.value = renameKeys(data.value.document.inference.prediction);
    loading.value = false;
  } else {
    alert(error.value?.data.api_request.error.message);
  }
}

function changeImage(img: string) {
  activeImg.value = img;
  extractedData.value = {};
  switch (activeImg.value) {
    case "Receipt":
      previewImg.value = "/_nuxt/assets/img/demo/receipt.png";
      imgUrl.value = runtimeConfig.public.img1Url;
      docApiUrl.value = runtimeConfig.public.apiBaseReceipt;
      break;
    case "Invoice":
      previewImg.value = "/_nuxt/assets/img/demo/invoice.png";
      imgUrl.value = runtimeConfig.public.img2Url;
      docApiUrl.value = runtimeConfig.public.apiBaseInvoice;
      break;
    case "Passport":
      previewImg.value = "/_nuxt/assets/img/demo/passport.jpg";
      imgUrl.value = runtimeConfig.public.img4Url;
      docApiUrl.value = runtimeConfig.public.apiBasePassport;
      break;
  }
  processImage();
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
          <div class="mt-3 col-md-4">
            <img
              src="~/assets/img/demo/passport.jpg"
              class="img-thumbnail cs-pointer"
              @click="changeImage('Passport')"
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
          <template v-for="(text, key) in extractedData" :key="key">
            <div v-if="text.value != null" class="data-container">
              <div class="fw-bold key-name text-uppercase">{{ key }}</div>
              <li class="list-group-item mb-3">
                <div>{{ text.value }}</div>
              </li>
            </div>
          </template>
          <div class="data-container" v-if="extractedData.locale">
            <div class="fw-bold key-name">CURRENCY</div>
            <li class="list-group-item">
              <div>{{ extractedData.locale.currency }}</div>
            </li>
          </div>
          <div
            class="data-container"
            v-if="
              extractedData.reference_numbers &&
              extractedData.reference_numbers.length > 0
            "
          >
            <div class="fw-bold key-name">PO #</div>
            <li
              class="list-group-item mb-3"
              v-for="(reference, index) in extractedData.reference_numbers"
              :key="index"
            >
              <div>{{ reference.value }}</div>
            </li>
          </div>
        </ul>
        <ul
          class="list-group rounded-0"
          v-if="
            extractedData.line_items &&
            extractedData.line_items.length > 0 &&
            !loading
          "
        >
          <div class="fw-bold key-name">LINE ITEMS</div>
          <li
            class="list-group-item mb-3"
            v-for="(item, index) in extractedData.line_items"
            :key="index"
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
