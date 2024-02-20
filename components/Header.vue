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

  await navigateTo("/login");
};
</script>

<template>
  <nav class="navbar navbar-expand-lg pe-lg-4 py-lg-0">
    <div class="container-fluid">
      <div class="toggler-wrapper">
        <NuxtLink to="/" class="navbar-brand">
          <img src="/spendtrail.png" class="w-50 w-lg pt-2 ps-2 ps-lg-4"
        /></NuxtLink>
        <button
          class="navbar-toggler p-1"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSpendTrail"
          aria-controls="navbarSpendTrail"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon fs-6"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarSpendTrail">
        <Menu v-if="user" />
        <ul
          class="navbar-nav ms-lg-auto pe-4 mb-3 mb-lg-0 ps-5 ps-lg-0"
          v-if="user"
        >
          <li class="nav-item dropdown">
            <NuxtLink
              class="nav-link dropdown-toggle text-light text-sm pe-0"
              data-bs-toggle="dropdown"
              role="button"
              aria-expanded="false"
            >
              <img
                v-if="profile"
                class="img-thumbnail rounded-circle"
                style="width: 2rem; height: 2rem"
                :src="profile"
              />
              <i
                class="bi bi-person-circle fs-4 text-primary align-middle"
                v-if="!profile"
              ></i>
              {{ name }}
            </NuxtLink>
            <ul class="dropdown-menu dropdown-menu-end border-0 my-0 py-1">
              <li>
                <NuxtLink @click="logout" class="dropdown-item pe-1"
                  ><div class="text-end fs-6 cs-pointer">
                    Logout <i class="bi bi-door-closed pe-2"></i></div
                ></NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
        <div class="d-flex ps-5 ps-lg-0 ms-auto">
          <ColorModeSwitch />
          <SocialIcons />
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.toggler-wrapper {
  display: contents;
}

.navbar-nav {
  width: max-content;
}

@media (max-width: 45em) {
  .toggler-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
