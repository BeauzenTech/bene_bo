<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter une franchise" />
  <BreadCrumb v-else PageTitle="Mettre à jour la franchise" />
  <VabeneAddFranchise  :action="action ?? 'add'" :franchiseID="franchiseID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddFranchise from "@/components/Vabene/Franchise/VabeneAddFranchise.vue";
import VabeneAddCategorie from "@/components/Vabene/Categorie/AddCategorie/VabeneAddCategorie.vue";

export default defineComponent({
  name: "VabeneAddFranchisePage",
  components: {
    BreadCrumb,
    VabeneAddFranchise,
  },
  data() {
    return {
      action: null as string | null,
      franchiseID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.franchiseID = this.$route.params.franchiseID as string;
  },
});
</script>