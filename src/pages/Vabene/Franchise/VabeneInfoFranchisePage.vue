<template>
  <BreadCrumb PageTitle="Information General" />
  <div class="row">
    <div class="col-12">
      <ProfileContent />
    </div>



  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import ProfileContent from "@/components/PagesInner/Profile/ProfileContent.vue";


export default defineComponent({
  name: "VabeneInfoFranchisePage",
  components: {
    ProfileContent,
    BreadCrumb,
  },

});
</script>

<style scoped>
div#whatHappening.card.bg-success.mb-25.border-0.rounded-0.welcome-box{
  height: 300px !important;
  padding: 40px !important;
}

div#topProduitReport.card.mb-25.border-0.rounded-0.bg-white.expected-earnings-box{
  padding: 40px !important;
  padding-bottom: 20px !important;
  height: 300px !important;
}
</style>