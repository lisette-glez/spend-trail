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
  <nav class="navbar navbar-expand bg-white py-3 shadow-sm">
    <div>
      <span class="navbar-brand fw-bold ms-4 text-primary" href="#"
        >Image2Text</span
      >
    </div>
    <ul class="navbar-nav ms-auto">
      <li class="nav-item cs-pointer me-3">
        <NuxtLink to="/" class="nav-link"
          ><span class="text-primary">About</span></NuxtLink
        >
      </li>
      <template v-if="user">
        <li class="nav-item cs-pointer me-3">
          <NuxtLink to="/upload-image" class="nav-link"
            ><span class="text-primary">Live demo</span></NuxtLink
          >
        </li>
        <li class="nav-item cs-pointer me-3">
          <img
            class="img-thumbnail rounded-circle"
            style="width: 2.5rem; height: 2.5rem"
            :src="profile"
          />
          <span class="ms-2 text-primary"> {{ name }}</span>
        </li>
        <li class="nav-item cs-pointer me-3">
          <NuxtLink @click="logout" class="nav-link"
            ><span class="text-primary">Logout</span></NuxtLink
          >
        </li>
      </template>
    </ul>
  </nav>
</template>
