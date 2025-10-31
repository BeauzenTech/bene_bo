<template>
  <BreadCrumb PageTitle="Zones de livraison" />
  <VabeneDeliveryZoneList />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneDeliveryZoneList from "@/components/Vabene/DeliveryZone/DeliveryZoneList/VabeneDeliveryZoneList.vue";

export default defineComponent({
  name: "VabeneDeliveryZoneListPage",
  components: {
    BreadCrumb,
    VabeneDeliveryZoneList
  }
});
</script>
