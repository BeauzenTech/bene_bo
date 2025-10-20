<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter une zone de livraison" />
  <BreadCrumb v-else PageTitle="Modifier la zone de livraison" />
  <VabeneAddDeliveryZone :action="action === 'add' ? 'Ajouter' : 'Modifier'" :zoneID="zoneID" :restaurantId="restaurantId" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddDeliveryZone from "@/components/Vabene/DeliveryZone/AddDeliveryZone/VabeneAddDeliveryZone.vue";

export default defineComponent({
  name: "VabeneAddDeliveryZonePage",
  components: {
    BreadCrumb,
    VabeneAddDeliveryZone
  },
  computed: {
    action() {
      // Si on a un zoneID dans les params, c'est une édition, sinon c'est un ajout
      return this.$route.params.zoneID ? 'edit' : 'add';
    },
    zoneID() {
      const zoneId = this.$route.params.zoneID;
      return Array.isArray(zoneId) ? zoneId[0] : zoneId;
    },
    restaurantId() {
      // Pour l'ajout, restaurantId vient des query params
      // Pour l'édition, il peut venir des params ou des query
      const paramRestaurantId = this.$route.params.restaurantId;
      const queryRestaurantId = this.$route.query.restaurantId;
      
      const paramId = Array.isArray(paramRestaurantId) ? paramRestaurantId[0] : paramRestaurantId;
      const queryId = Array.isArray(queryRestaurantId) ? queryRestaurantId[0] : queryRestaurantId;
      
      return paramId || (queryId || undefined);
    }
  }
});
</script>
