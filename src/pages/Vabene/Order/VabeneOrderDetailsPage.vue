<template>
  <BreadCrumb PageTitle="Détail de la commande" />
  <VabeneOrderDetails v-if="localCommandeID" :commandeID="localCommandeID"/>
  <div v-else class="loading-container">
    <p>Chargement...</p>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneOrderDetails from "@/components/Vabene/POS/OrderDetails/VabeneOrderDetails.vue";
export default defineComponent({
  name: "VabeneOrderDetailsPage",
  components: {
    BreadCrumb,
    VabeneOrderDetails,
  },
  props: {
    commandeID: {
      type: String as PropType<string>,
      required: false,
      default: null
    }
  },
  data() {
    return {
      localCommandeID: null as string | null,
    };
  },
  mounted() {
    // Utiliser la prop si fournie, sinon utiliser le paramètre de route
    this.localCommandeID = this.commandeID || this.$route.params.commandeID as string;
  },
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
}
</style>