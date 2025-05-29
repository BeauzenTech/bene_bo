<template>
  <BreadCrumb PageTitle="Franchises" />
  <FranchiseList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import FranchiseList from "@/components/Vabene/Franchise/FranchiseList.vue";

export default defineComponent({
  name: "FranchiseListPage",
  components: {
    BreadCrumb,
    FranchiseList,
  },
});
</script>