<template>
  <BreadCrumb PageTitle="Parrainage & Fidelité" />
  <VabeneProgrammeList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneProgrammeList from "@/components/Vabene/ProgrammeParrainage/VabeneProgrammeList.vue";
export default defineComponent({
  name: "VabeneProgrammeAffiliationListPage",
  components: {
    BreadCrumb,
    VabeneProgrammeList,
  },
});
</script>