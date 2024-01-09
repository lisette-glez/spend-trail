<script setup lang="ts">
const supabase = useSupabaseClient();

// const email = ref("");

// const signInWithOtp = async () => {
//   console.log("Entre aqui");
//   const { error } = await supabase.auth.signInWithOtp({
//     email: email.value,
//     options: {
//       emailRedirectTo: "http://localhost:3000/confirm",
//     },
//   });
//   if (error) console.log(error);
// };

const handleLogin = async () => {
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

// const loginGoogle = async () => {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//   });

//   if (error) {
//     console.error(error);
//   }
// };
</script>

<template>
  <div>
    <div>
      <button @click="handleLogin">Sign In with Github</button>
    </div>
    <!-- <div>
      <button @click="loginGoogle">Sign In with Google</button>
    </div>
    <div>
      <button @click="signInWithOtp">Sign In with E-Mail</button>
      <input v-model="email" type="email" />
    </div> -->
  </div>
</template>
