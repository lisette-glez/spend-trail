<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const name = computed(() => user.value?.user_metadata.full_name);
const profile = computed(() => user.value?.user_metadata.avatar_url);

const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  await navigateTo("/auth");
};
</script>

<template>
  <nav class="navbar navbar-expand container-xxl">
    <NuxtLink to="/" class="nav-link">
      <img src="~/assets/img/logo.png" class="w-75"
    /></NuxtLink>
    <ul class="navbar-nav me-auto">
      <li class="nav-item cs-pointer me-4">
        <NuxtLink to="/" class="nav-link"
          ><span class="text-light fs-5">About</span></NuxtLink
        >
      </li>
      <li class="nav-item cs-pointer me-3">
        <NuxtLink to="/upload-image" class="nav-link"
          ><span class="text-light fs-5">Live demo</span></NuxtLink
        >
      </li>
    </ul>
    <ul class="navbar-nav me-auto">
      <li class="nav-item">
        <NuxtLink
          to="https://www.linkedin.com/in/lisette-gonzalez/"
          target="_blank"
          class="nav-link text-light fs-5"
          ><i class="bi bi-linkedin"></i
        ></NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink
          to="https://lisette.dev"
          target="_blank"
          class="nav-link text-light fs-5"
          ><i class="bi bi-link-45deg"></i
        ></NuxtLink>
      </li>
      <li class="nav-item">
        <NuxtLink
          to="https://github.com/lisette900809/image2text"
          target="_blank"
          class="nav-link text-light fs-5"
          ><i class="bi bi-github"></i
        ></NuxtLink>
      </li>
      <template v-if="user"
        ><li class="nav-item">
          <div class="vr h-75 ms-2 text-white align-text-top"></div>
        </li>
        <li class="nav-item cs-pointer ms-3">
          <img
            class="img-thumbnail rounded-circle"
            style="width: 2.5rem; height: 2.5rem"
            :src="profile"
          />
          <span class="ms-2 text-primary"> {{ name }}</span>
        </li>
        <li class="nav-item cs-pointer me-3">
          <NuxtLink @click="logout" class="nav-link"
            ><span class="text-light fs-5">Logout</span></NuxtLink
          >
        </li></template
      >
    </ul>
  </nav>
</template>
