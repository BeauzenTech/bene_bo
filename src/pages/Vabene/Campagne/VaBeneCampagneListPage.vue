<template>
  <BreadCrumb PageTitle="Liste des campagnes" />
  <VabeneCampagneList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneCampagneList from "@/components/Vabene/Campagne/CampagneList/VabeneCampagneList.vue";

export default defineComponent({
  name: "VabeneCampagneListPage",
  components: {
    BreadCrumb,
    VabeneCampagneList,
  },
});
</script>