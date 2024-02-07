<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  docType: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
});
</script>
<template>
  <h5 class="mb-3">
    EXTRACTED DATA FROM YOUR
    <span class="text-uppercase">{{ props.docType }}</span>
  </h5>
  <div class="text-center mt-5" v-if="props.loading">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <template v-else
    ><ul class="list-group rounded-0 d-flex flex-row flex-wrap">
      <template v-for="(text, key) in props.data" :key="key">
        <div v-if="text.value != null" class="data-container">
          <div class="fw-bold key-name text-uppercase">{{ key }}</div>
          <li class="list-group-item mb-3">
            <div>{{ text.value }}</div>
          </li>
        </div>
      </template>
      <div
        class="data-container"
        v-if="props.docType == 'Invoice' && props.data.taxes.length > 0"
      >
        <div class="fw-bold key-name text-uppercase">Taxes</div>
        <li
          class="list-group-item mb-3"
          v-for="(tax, index) in props.data.taxes"
          :key="index"
        >
          <div>{{ tax.rate }}% - {{ tax.value }}</div>
        </li>
      </div>
      <div
        class="data-container"
        v-if="
          props.data.reference_numbers &&
          props.data.reference_numbers.length > 0
        "
      >
        <div class="fw-bold key-name">PO #</div>
        <li
          class="list-group-item mb-3"
          v-for="(reference, index) in props.data.reference_numbers"
          :key="index"
        >
          <div>{{ reference.value }}</div>
        </li>
      </div>
      <div class="data-container" v-if="props.data.locale">
        <div class="fw-bold key-name">CURRENCY</div>
        <li class="list-group-item">
          <div>{{ props.data.locale.currency }}</div>
        </li>
      </div>
    </ul>
    <ul
      class="list-group rounded-0"
      v-if="props.data.line_items && props.data.line_items.length > 0"
    >
      <div class="fw-bold key-name">LINE ITEMS</div>
      <li
        class="list-group-item mb-3"
        v-for="item in props.data.line_items"
        :key="item.id"
      >
        <div>
          {{ item.quantity || 1 }}- {{ item.description }}
          <span v-if="item.unit_price">x {{ item.unit_price }}.00</span>
          -
          {{ item.total_amount }}
        </div>
      </li>
    </ul></template
  >
</template>
