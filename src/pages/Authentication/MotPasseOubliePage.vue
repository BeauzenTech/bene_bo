<template>
  <PasswordReset />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import PasswordReset from "@/components/Authentication/ForgotPassword/PasswordReset.vue";
export default defineComponent({
  name: "MotDePasseOubliePage",
  components: {
    PasswordReset,
  },
});
</script>

