<script setup lang="ts">
const loading = ref(true);
const props = defineProps({
  file: {
    type: File,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  docType: {
    type: String,
    required: true,
  },
});

const { data } = useAsyncData("imageData", async () => {
  const imageData = await useProcessData(props.url, props.file);
  const parsedData: any = useRenameKeys(
    imageData!.document.inference.prediction
  );
  loading.value = false;
  return parsedData;
});
</script>

<template>
  <h5 class="mb-3">
    EXTRACTED DATA FROM YOUR
    <span class="text-uppercase">{{ props.docType }}</span>
    <span
      class="spinner-border regular-color spinner-border-sm ms-3"
      role="status"
      aria-hidden="true"
      v-if="loading"
    ></span>
  </h5>
  <div v-if="!loading">
    <ul class="list-group rounded-0 d-flex flex-row flex-wrap">
      <template v-for="(text, key) in data" :key="key">
        <div v-if="text.value != null" class="data-container">
          <div class="fw-bold key-name text-uppercase">{{ key }}</div>
          <li class="list-group-item mb-3">
            <div>{{ text.value }}</div>
          </li>
        </div>
      </template>
      <div
        class="data-container"
        v-if="props.docType == 'Invoice' && data?.taxes.length > 0"
      >
        <div class="fw-bold key-name text-uppercase">Taxes</div>
        <li
          class="list-group-item mb-3"
          v-for="tax in data.taxes"
          :key="tax.id"
        >
          <div>{{ tax.rate }}% - {{ tax.value }}</div>
        </li>
      </div>
      <div
        class="data-container"
        v-if="data?.reference_numbers && data?.reference_numbers.length > 0"
      >
        <div class="fw-bold key-name">PO #</div>
        <li
          class="list-group-item mb-3"
          v-for="(reference, index) in data.reference_numbers"
          :key="index"
        >
          <div>{{ reference.value }}</div>
        </li>
      </div>
      <div class="data-container" v-if="data?.locale">
        <div class="fw-bold key-name">CURRENCY</div>
        <li class="list-group-item">
          <div>{{ data.locale.currency }}</div>
        </li>
      </div>
    </ul>
    <ul
      class="list-group rounded-0"
      v-if="data?.line_items && data?.line_items.length > 0"
    >
      <div class="fw-bold key-name">LINE ITEMS</div>
      <li
        class="list-group-item mb-3"
        v-for="item in data.line_items"
        :key="item.id"
      >
        <div>
          {{ item.quantity || 1 }}- {{ item.description }}
          <span v-if="item.unit_price">x {{ item.unit_price }}.00</span>
          -
          {{ item.total_amount }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.extracted-data .list-group {
  background-color: var(--gray-50);
  padding: 1rem;
}

.extracted-data .list-group .key-name {
  color: var(--gray-200);
}

.extracted-data .list-group .list-group-item {
  border-left: 3px solid var(--blue-50);
  padding: 5px 7px;
}

.data-container {
  width: 100%;
}

@media (min-width: 45em) {
  .data-container {
    width: 30%;
    margin-right: 1rem;
  }
}
</style>
