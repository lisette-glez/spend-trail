<script setup lang="ts">
const preview = ref("");
const props = defineProps({
  file: {
    type: File,
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

onMounted(() => {
  getImagePreview(props.file);
});

const emit = defineEmits(["clearData"]);

function getImagePreview(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    preview.value = reader.result as string;
  };
}
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
  <img :src="preview" class="img-fluid py-3 px-2 preview-img" />
</template>
