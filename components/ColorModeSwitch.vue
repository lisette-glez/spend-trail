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
      <span
        ><i
          class="bi-sun cs-pointer text-light fs-5"
          name="light-mode"
          @click="onClick"
        ></i
      ></span>
      <span class="visually-hidden">Light Mode</span>
    </template>
    <template v-else>
      <span
        ><i
          class="bi-moon-stars cs-pointer fs-5 text-light"
          name="dark-mode"
          @click="onClick"
        ></i
      ></span>
      <span class="visually-hidden">Dark Mode</span>
    </template>
  </ColorScheme>
</template>
