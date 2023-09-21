<script setup lang="ts">
const props = defineProps({
  errorMessage: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    {{ props.errorMessage }}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    ></button>
  </div>
</template>
