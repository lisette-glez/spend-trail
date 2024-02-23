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
  <ul class="nav nav-tabs mb-4" v-if="!props.success">
    <li
      class="nav-item cs-pointer"
      data-bs-toggle="modal"
      data-bs-target="#myModal"
    >
      <div class="nav-link">
        <i class="bi-file-arrow-down text-sm"></i> Extract data
        <span
          class="spinner-border regular-color spinner-border-sm ms-1"
          role="status"
          aria-hidden="true"
          v-if="props.loading"
        ></span>
      </div>
    </li>
    <li class="nav-item cs-pointer" @click="emit('clearData')">
      <div class="nav-link">
        <i class="bi-x-circle text-danger text-sm"></i> Cancel
      </div>
    </li>
  </ul>
  <img :src="preview" class="img-fluid w-100 preview-img" />
</template>

<style lang="scss">
.bi-file-arrow-down {
  color: var(--blue-50);
}

.preview-img {
  border: 0.5px solid var(--blue-50);
}
</style>
