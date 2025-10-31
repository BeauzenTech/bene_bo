<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter un restaurant" />
  <BreadCrumb v-else PageTitle="Mettre a jour" />
  <VabeneAddRestaurant :action="action ?? 'add'" :restaurantID="restaurantID ?? ''" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddRestaurant from "@/components/Vabene/Restaurant/AddRestaurant/VabeneAddRestaurant.vue";

export default defineComponent({
  name: "VabeneAddUserPage",
  components: {
    BreadCrumb,
    VabeneAddRestaurant,
  },
  data() {
    return {
      action: null as string | null,
      restaurantID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.restaurantID = this.$route.params.restaurantID as string;
  },
});
</script>