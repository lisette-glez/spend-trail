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
  <nav class="navbar navbar-expand shadow-sm px-4 py-0">
    <NuxtLink to="/" class="nav-link">
      <img src="/spendtrail.png" class="w-50 pt-2"
    /></NuxtLink>
    <Menu v-if="user" />
    <ul class="navbar-nav ms-auto pe-4">
      <div v-if="user">
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle text-light fs-6 pe-0"
            data-bs-toggle="dropdown"
            href="#"
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
          </a>
          <ul class="dropdown-menu dropdown-menu-end border-0 my-0 py-1">
            <li>
              <NuxtLink @click="logout" class="dropdown-item pe-1"
                ><div class="text-end fs-6 cs-pointer">
                  Logout <i class="bi bi-door-closed pe-2"></i></div
              ></NuxtLink>
            </li>
          </ul>
        </li>
      </div>
    </ul>
    <ColorModeSwitch />
    <SocialIcons />
  </nav>
</template>
