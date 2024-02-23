<script setup lang="ts">
const supabase = useSupabaseClient();
const fullName = ref("");
const email = ref("");
const password = ref("");
const errorAlert = ref(false);
const errorMessage = ref<any>(null);
const signIn = ref(true);

const signUpNewUser = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: email.value,
        full_name: fullName.value,
      },
    },
  });
  if (error) {
    errorAlert.value = true;
    errorMessage.value = error.message;
    setTimeout(() => {
      errorAlert.value = false;
    }, 2500);
  } else {
    fullName.value = "";
    email.value = "";
    password.value = "";
    alert("Check your email for the login link!");
    setTimeout(() => {
      navigateTo("/confirm");
    }, 2000);
  }
};

async function signInWithEmail() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (error) {
    errorAlert.value = true;
    errorMessage.value = error.message;
    setTimeout(() => {
      errorAlert.value = false;
    }, 2500);
  } else {
    navigateTo("/");
  }
}

const handleGithubLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://lisette.dev/confirm",
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
      redirectTo: "http://lisette.dev/confirm",
    },
  });

  if (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-7 col-lg-5 col-xl-4">
      <AppAlert v-if="errorAlert" :errorMessage="errorMessage" />
      <div class="card card-login shadow-sm">
        <div class="p-5 text-center">
          <div v-if="signIn">
            <h4 class="mb-2">Sign in</h4>
            <p>
              Enter your email and password, or quickly sign in with your social
              networks.
            </p>
          </div>
          <div v-else>
            <h4 class="mb-2">Sign up</h4>
            <p>
              Enter your name, email and password, or quickly sign in with your
              social networks.
            </p>
          </div>
          <i class="bi bi-person-circle"></i>
          <div class="mb-3 text-start" v-if="!signIn">
            <input
              type="text"
              class="form-control"
              placeholder="Full Name"
              v-model="fullName"
            />
          </div>
          <div class="mb-3 text-start">
            <input
              type="email"
              class="form-control"
              placeholder="Email"
              v-model="email"
            />
          </div>
          <div class="mb-1 text-start">
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              v-model="password"
            />
          </div>
          <div class="d-grid gap-2 mt-2">
            <button
              class="btn regular-btn text-light mt-2 mb-3"
              type="button"
              @click="signIn ? signInWithEmail() : signUpNewUser()"
            >
              <i class="bi bi-envelope-at me-1"></i>
              <span v-if="signIn"> Sign in</span>
              <span v-else> Sign up</span>
            </button>
          </div>
          <p class="mb-0" v-if="signIn">
            Don't have an account?
            <span class="link-50" @click="signIn = !signIn">Sign Up</span>
          </p>
          <p v-else>
            Already have an account?
            <span class="link-50" @click="signIn = !signIn">Sign in</span>
          </p>
          <div class="text-success">
            <hr />
          </div>
          <div class="d-grid gap-2 mt-4">
            <button
              class="btn btn-danger"
              type="button"
              @click="handleGoogleLogin"
            >
              <i class="bi bi-google me-1"></i>
              Continue with Google
            </button>
            <button
              class="btn green-btn text-light mt-2 mb-4"
              type="button"
              @click="handleGithubLogin"
            >
              <i class="bi bi-github me-1"></i>
              Continue with Github
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-login .bi-person-circle {
  font-size: var(--text-5xl);
  color: var(--green-light);
}

.card-login p {
  font-size: var(--text-sm);
  margin-bottom: 0.5rem;
}

.link-50 {
  cursor: pointer;
  color: var(--blue-50);
}
</style>
