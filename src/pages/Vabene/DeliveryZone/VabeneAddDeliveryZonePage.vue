<template>
  <div class="main-content">
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 class="mb-sm-0">
                {{ action === 'add' ? 'Ajouter une zone de livraison' : 'Modifier la zone de livraison' }}
              </h4>
              <div class="page-title-right">
                <ol class="breadcrumb m-0">
                  <li class="breadcrumb-item">
                    <a href="javascript: void(0);">Tableau de bord</a>
                  </li>
                  <li class="breadcrumb-item">
                    <router-link to="/delivery-zones">Zones de livraison</router-link>
                  </li>
                  <li class="breadcrumb-item active">
                    {{ action === 'add' ? 'Ajouter' : 'Modifier' }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <VabeneAddDeliveryZone :action="action" :zoneID="zoneID" :restaurantId="restaurantId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VabeneAddDeliveryZone from "@/components/Vabene/DeliveryZone/AddDeliveryZone/VabeneAddDeliveryZone.vue";

export default defineComponent({
  name: "VabeneAddDeliveryZonePage",
  components: {
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
