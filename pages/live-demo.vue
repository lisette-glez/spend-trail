<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const docApiUrl = ref(runtimeConfig.public.apiBaseReceipt);
const imgUrl =
  "https://wkqtbrfzamxmkwdwqnbi.supabase.co/storage/v1/object/public/receipts/b7ba9396-0d51-4e1a-a5db-9f6bdf613d5c";
const extractedData = ref({});

onMounted(() => {
  processImage();
});

async function processImage() {
  const formData = new FormData();
  formData.append("document", imgUrl);

  const { data, error } = await useFetch<any>(docApiUrl, {
    method: "post",
    headers: { Authorization: "Token " + runtimeConfig.public.apiKey },
    body: formData,
  });

  if (data.value) {
    extractedData.value = data.value.document.inference.prediction;
    extractedData.value = renameKeys(extractedData.value);
  } else {
    alert(error.value);
  }
}
</script>

<template>
  <div class="card upload-card px-5 py-5 shadow-sm border-0">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="d-inline-block overflow-hidden bg-light">
          <img src="~/assets/img/publixdemo.png" class="demo-img img-fluid" />
        </div>
        <div class="row">
          <div class="mt-3 col-md-3">
            <img
              src="~/assets/img/publixdemo.png"
              class="img-thumbnail cs-pointer"
            />
          </div>
        </div>
      </div>
      <div class="col-md-8 extracted-data">
        <h5 class="mb-3">EXTRACTED DATA FROM YOUR RECEIPT</h5>
        <ul class="list-group rounded-0 d-flex flex-row flex-wrap">
          <template v-for="(text, key) in extractedData" :key="key">
            <div v-if="text.value != null" class="data-container">
              <div class="fw-bold key-name text-uppercase">{{ key }}</div>
              <li class="list-group-item mb-3">
                <div>{{ text.value }}</div>
              </li>
            </div>
          </template>
          <div class="data-container" v-if="extractedData.locale">
            <div class="fw-bold key-name text-uppercase">Currency</div>
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
          v-if="extractedData.line_items && extractedData.line_items.length > 0"
        >
          <div class="fw-bold key-name">Line Items</div>
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
