
<template>
    <BreadCrumb  PageTitle="Configuration des horaires" />
  <VabeneAddOpeningHours />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VabeneAddOpeningHours from "@/components/Vabene/OpeningHours/AddOpeningHours/VabeneAddOpeningHours.vue";

export default defineComponent({
  name: "VabeneAddOpeningHoursPage",
  components: {
    VabeneAddOpeningHours
  }
});
</script>
