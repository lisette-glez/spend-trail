<script setup lang="ts">
const fileUrl = ref(null);
const emit = defineEmits(["typedUrl"]);
</script>

<template>
  <div class="row mt-5 mb-4 justify-content-center">
    <div class="col-md-9 offset-md-1">
      <div class="input-group link-input">
        <span class="input-group-text bg-transparent">
          <i class="bi-link-45deg"></i
        ></span>
        <input
          type="text"
          class="form-control"
          placeholder="Enter a URL"
          v-model="fileUrl"
        />
        <span
          class="input-group-text cs-pointer"
          @click="$emit('typedUrl', fileUrl)"
        >
          <i class="bi-send"></i
        ></span>
      </div>
    </div>
  </div>
</template>
