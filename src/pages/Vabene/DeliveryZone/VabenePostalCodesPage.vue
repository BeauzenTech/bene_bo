<template>
  <BreadCrumb PageTitle="Codes postaux" />
  <VabenePostalCodesList 
    :zoneId="zoneId" 
    :zoneName="zoneName" 
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabenePostalCodesList from "@/components/Vabene/DeliveryZone/PostalCodesList/VabenePostalCodesList.vue";

export default defineComponent({
  name: "VabenePostalCodesPage",
  components: {
    BreadCrumb,
    VabenePostalCodesList
  },
  computed: {
    zoneId(): string {
      return this.$route.params.zoneId as string;
    },
    zoneName(): string {
      return this.$route.query.zoneName as string || 'Zone de livraison';
    }
  }
});
</script>
