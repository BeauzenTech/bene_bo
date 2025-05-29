<template>
  <div class="col">
    <div class="row">
      <div class="col-xxl-7 col-xxxl-6">
        <WhatHappening />
      </div>
      <div class="col-xxl-5 col-xxxl-6">
        <div class="row">
          <div class="col-lg-6 col-xxxl-6 col-md-6">
            <NewContact />
          </div>
          <div class="col-lg-6 col-xxxl-6 col-md-6">
            <AverageDailySales />
          </div>
        </div>
      </div>

    </div>
    <div class="row">
      <div class="col-xxl-7 col-xxxl-6">
        <SalesByPOSLocation />
      </div>
      <div class="col-xxl-7 col-xxxl-6">
        <TaskOverview />
      </div>


    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";

import WhatHappening from "@/components/Dashboard/Ecommerce/WhatHappening.vue";
import AverageDailySales from "@/components/Dashboard/Ecommerce/AverageDailySales.vue";
import NewContact from "@/components/Charts/MixedCharts/NewContact.vue";
import SalesByPOSLocation from "@/components/Charts/Charts/SalesByPOSLocation.vue";
import TaskOverview from "@/components/Charts/Charts/TaskOverview.vue";


export default defineComponent({
  name: "VabeneDashPage",
  components: {
    TaskOverview,
    SalesByPOSLocation,
    WhatHappening,
    AverageDailySales,
    NewContact
  },
});
</script>