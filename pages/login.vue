<script setup lang="ts">
const supabase = useSupabaseClient();

const handleGithubLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/confirm",
    },
  });

  if (error) {
    console.error(error);
  }
};

const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: "http://localhost:3000/confirm",
    },
  });

  if (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="row justify-content-center pt-5">
    <div class="col-sm-6 col-md-4">
      <div class="card shadow-sm card-login">
        <div class="card-body p-5 text-center">
          <h4 class="card-title mt-2 mb-0">Social Login</h4>
          <p>Quickly sign in with your social network</p>
          <i class="bi bi-person-circle"></i>
          <div class="d-grid gap-2 mt-2">
            <button
              class="btn btn-danger"
              type="button"
              @click="handleGoogleLogin"
            >
              <i class="bi bi-google me-1"></i>
              Sign in with Google
            </button>
            <button
              class="btn btn-primary github-btn mt-2 mb-4"
              type="button"
              @click="handleGithubLogin"
            >
              <i class="bi bi-github me-1"></i>
              Sign in with Github
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
