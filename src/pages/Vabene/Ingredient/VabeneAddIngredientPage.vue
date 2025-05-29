<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter un ingredient" />
  <BreadCrumb v-else PageTitle="Mettre à jour ingredient" />
  <VabeneAddIngredient :action="action ?? 'add'" :categorieID="ingredientID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddIngredient from "@/components/Vabene/Ingredient/AddIngredient/VabeneAddIngredient.vue";
export default defineComponent({
  name: "VabeneAddIngredientPage",
  components: {
    BreadCrumb,
    VabeneAddIngredient,
  },

  data() {
    return {
      action: null as string | null,
      ingredientID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.ingredientID = this.$route.params.ingredientID as string;
    console.log('action:', this.action);
    console.log('ingredientID:', this.ingredientID);
  },
});
</script>