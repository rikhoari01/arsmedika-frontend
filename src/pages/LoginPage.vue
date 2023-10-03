<template>
  <div class="fixed fixed-center bg-primary">
    <q-card
      square
      class="flex-center text-center"
      style="width: 400px; padding: 50px"
    >
      <div style="font-size: 3rem; font-weight: bold; padding-bottom: 10px">
        ARSMEDIKA
      </div>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          type="email"
          autofocus
          v-model.trim="form.email"
          label="Email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please type your email',
          ]"
        />

        <q-input
          type="password"
          label="Password"
          v-model.trim="form.password"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please type your password',
          ]"
        />
        <div class="text-red" v-if="bad_auth">Authorization Failed</div>
        <q-card-actions>
          <q-btn push type="submit" class="fit" color="primary">Login</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import { ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { authStore } from "src/stores/auth";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const auth = authStore();
    const router = useRouter();
    const bad_auth = ref(false);
    const form = reactive({ email: "", password: "" });

    if (auth.isLoggedIn) {
      router.push("/");
    }

    const onSubmit = async () => {
      const result = await auth.login(form);

      if (result.status === 200) {
        await router.push("/");
      } else {
        bad_auth.value = true;
      }
    };
    return { form, onSubmit, bad_auth };
  },
});
</script>
