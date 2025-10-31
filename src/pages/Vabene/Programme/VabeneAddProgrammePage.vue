<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter un programme" />
  <BreadCrumb v-else PageTitle="Mettre à jour le programme" />
  <VabeneAddProgramme :action="action ?? 'add'" :categorieID="categorieID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddProgramme from "@/components/Vabene/ProgrammeParrainage/AddProgramme/VabeneAddProgramme.vue";
export default defineComponent({
  name: "VabeneAddProgrammePage",
  components: {
    BreadCrumb,
    VabeneAddProgramme
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