<template>
  <POSMain />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import POSMain from "@/components/Vabene/POS/Modern/views/POSMain.vue";

export default defineComponent({
  name: "VabeneAddOrderPage",
  components: {
    POSMain,
  },
});
</script>

<style scoped>
/* Enlever tout padding/margin pour une expérience plein écran */
</style>