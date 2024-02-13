<script setup lang="ts">
const colorMode = useColorMode();
const onClick = () =>
  colorMode.value === "light"
    ? (colorMode.preference = "dark")
    : (colorMode.preference = "light");
</script>

<template>
  <ColorScheme>
    <template v-if="colorMode.value === 'dark'">
      <div class="me-4">
        <span
          ><i
            class="bi-sun cs-pointer text-light text-sm"
            name="light-mode"
            @click="onClick"
          ></i
        ></span>
        <span class="visually-hidden">Light Mode</span>
      </div>
    </template>
    <template v-else>
      <div class="me-4">
        <span
          ><i
            class="bi-moon-stars cs-pointer text-sm text-light"
            name="dark-mode"
            @click="onClick"
          ></i
        ></span>
        <span class="visually-hidden">Dark Mode</span>
      </div>
    </template>
  </ColorScheme>
</template>
