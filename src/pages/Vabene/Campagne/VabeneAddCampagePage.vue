<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter une campagne" />
  <BreadCrumb v-else PageTitle="Detail campagne" />
  <VabeneAddCampagne :action="action ?? 'add'" :campagneID="campagneID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddCampagne from "@/components/Vabene/Campagne/AddCampagne/VabeneAddCampagne.vue";
export default defineComponent({
  name: "VabeneAddCampagnePage",
  components: {
    BreadCrumb,
    VabeneAddCampagne,
  },

  data() {
    return {
      action: null as string | null,
      campagneID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.campagneID = this.$route.params.campagneID as string;
    console.log('action:', this.action);
    console.log('campagneID:', this.campagneID);
  },
});
</script>