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
            style="width: 2.2rem; height: 2.2rem"
            :src="profile"
          />
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle text-light fs-6"
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-expanded="false"
          >
            {{ name }}</a
          >
          <ul class="dropdown-menu border-0 my-0 py-1">
            <li>
              <NuxtLink @click="logout" class="dropdown-item"
                ><div class="text-end fs-6 cs-pointer">
                  <i class="bi bi-door-closed pe-2"></i>Logout
                </div></NuxtLink
              >
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </nav>
</template>
