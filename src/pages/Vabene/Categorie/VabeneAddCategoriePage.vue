<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter une catégorie" />
  <BreadCrumb v-else PageTitle="Mettre à jour la catégorie" />
  <VabeneAddCategorie :action="action ?? 'add'" :categorieID="categorieID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddCategorie from "@/components/Vabene/Categorie/AddCategorie/VabeneAddCategorie.vue";

export default defineComponent({
  name: "VabeneAddCategoriePage",
  components: {
    BreadCrumb,
    VabeneAddCategorie,
  },

  data() {
    return {
      action: null as string | null,
      categorieID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.categorieID = this.$route.params.categorieID as string;
  },
});
</script>