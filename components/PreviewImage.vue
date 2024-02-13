<script setup lang="ts">
const props = defineProps({
  preview: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["clearData"]);
</script>

<template>
  <ul class="nav nav-tabs justify-content-end mb-4" v-if="!props.success">
    <li
      class="nav-item cs-pointer"
      data-bs-toggle="modal"
      data-bs-target="#myModal"
    >
      <div class="nav-link">
        <i class="bi-file-arrow-down"></i> Extract data
        <span
          class="spinner-border text-primary spinner-border-sm ms-1"
          role="status"
          aria-hidden="true"
          v-if="props.loading"
        ></span>
      </div>
    </li>
    <li class="nav-item cs-pointer" @click="emit('clearData')">
      <div class="nav-link"><i class="bi-x-circle text-danger"></i> Cancel</div>
    </li>
  </ul>
  <img :src="props.preview" class="img-fluid py-3 px-2 preview-img" />
</template>
