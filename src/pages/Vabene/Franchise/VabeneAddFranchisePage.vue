<template>
  <BreadCrumb PageTitle="Ajouter une franchise" />
  <VabeneAddFranchise />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddFranchise from "@/components/Vabene/Franchise/VabeneAddFranchise.vue";

export default defineComponent({
  name: "VabeneAddFranchisePage",
  components: {
    BreadCrumb,
    VabeneAddFranchise,
  },
});
</script>