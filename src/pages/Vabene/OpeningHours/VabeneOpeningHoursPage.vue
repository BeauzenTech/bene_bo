

<template>
  <BreadCrumb PageTitle="Horaires d'ouverture" />
  <VabeneOpeningHoursList />
</template>

<script lang="ts">


import { defineComponent } from "vue";
import VabeneOpeningHoursList from "@/components/Vabene/OpeningHours/OpeningHoursList/VabeneOpeningHoursList.vue";

export default defineComponent({
  name: "VabeneOpeningHoursPage",
  components: {
    VabeneOpeningHoursList
  }
});
</script>
