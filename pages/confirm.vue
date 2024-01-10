<script setup lang="ts">
const user = useSupabaseUser();
watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="row justify-content-center pt-5">
    <div class="col-md-3 text-center">
      <div class="spinner-border text-info me-3" role="status"></div>
      <div role="status" class="fs-5 text-dark mt-3">Waiting for login...</div>
    </div>
  </div>
</template>
